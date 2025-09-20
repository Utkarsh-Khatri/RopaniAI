import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA, LLMChain
from langchain.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain_community.llms import HuggingFacePipeline
from transformers import pipeline

# -------------------------------
# 1. Load API key
# -------------------------------
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("❌ Please set the GROQ_API_KEY environment variable.")

# -------------------------------
# 2. Load PDF and split into chunks
# -------------------------------
PDF_PATH = "malpot_docs.pdf"
print("📄 Loading and processing PDF...")

loader = PyPDFLoader(PDF_PATH)
docs = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=200)
chunks = splitter.split_documents(docs)

# -------------------------------
# 3. Create vector DB
# -------------------------------
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectordb = Chroma.from_documents(chunks, embeddings, persist_directory="db")
retriever = vectordb.as_retriever(search_kwargs={"k": 3})

# -------------------------------
# 4. Setup Groq LLM for RAG
# -------------------------------
llm_rag = ChatGroq(model="llama-3.3-70b-versatile", api_key=GROQ_API_KEY)

qa_chain_rag = RetrievalQA.from_chain_type(
    llm=llm_rag,
    retriever=retriever,
    chain_type="stuff",
    return_source_documents=True
)

# -------------------------------
# 5. Setup fallback general LLM
# -------------------------------
hf_pipeline = pipeline("text-generation", model="google/flan-t5-small", max_length=300)
llm_fallback = HuggingFacePipeline(pipeline=hf_pipeline)

fallback_prompt = PromptTemplate(
    input_variables=["question"],
    template="Answer this question concisely based on general knowledge:\n{question}"
)
fallback_chain = LLMChain(llm=llm_fallback, prompt=fallback_prompt)

# -------------------------------
# 6. Keywords for land-related questions
# -------------------------------
land_keywords = ["land", "malpot", "property", "kitta", "plot", "ownership", "registration", "survey"]

# -------------------------------
# 7. CLI Chat Loop with combined RAG + fallback
# -------------------------------
print("\n✅ Malpot RAG Chatbot is ready!")
print("Ask questions about the Malpot documents (type 'exit' to quit)\n")

while True:
    query = input("You: ")
    if query.lower() in ["exit", "quit"]:
        print("👋 Goodbye!")
        break

    # 1️⃣ Try RAG (PDF-based)
    result = qa_chain_rag.invoke({"query": query})
    answer_rag = result["result"].strip()

    # Check if RAG answer is meaningful
    fallback_keywords = [
        "doesn't specify", "not mentioned", "the text doesn't",
        "I don't know", "cannot find", "uncertain"
    ]
    is_rag_empty = len(answer_rag) < 20 or any(kw in answer_rag.lower() for kw in fallback_keywords)

    # 2️⃣ Determine which answer to use
    if not is_rag_empty:
        answer = answer_rag
    else:
        # Use fallback LLM directly
        answer_fallback = fallback_chain.invoke({"question": query})["text"].strip()
        if not answer_fallback or len(answer_fallback) < 10:
            answer = "I don't know the answer to this question."
        else:
            answer = answer_fallback

    # 3️⃣ Print the answer
    print("\nAssistant:", answer)

    # 4️⃣ Show sources only if question seems about land AND RAG had a meaningful answer
    if any(kw in query.lower() for kw in land_keywords) and not is_rag_empty and result.get("source_documents"):
        print("\n📖 Sources (explainable context):")
        seen_texts = set()
        for i, doc in enumerate(result["source_documents"], start=1):
            snippet = doc.page_content[:400].replace("\n", " ").strip()
            if snippet in seen_texts:
                continue
            seen_texts.add(snippet)
            page = doc.metadata.get("page_number", "N/A")
            score = doc.metadata.get("score", None)
            if score:
                print(f"{i}. Page {page} | Relevance: {score}\n   {snippet}...\n")
            else:
                print(f"{i}. Page {page}\n   {snippet}...\n")
