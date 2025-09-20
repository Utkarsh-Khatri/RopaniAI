import React from "react";

const Landing = () => {
  return (
    <section className="bg-gray-50 min-h-screen px-6 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-[#00316C]">
          Welcome To RopaniAI
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Transparent Land Prices. Smarter Deals. A Fair Market for Everyone.
        </p>
      </div>

      {/* About Section */}
      <div className="mt-12 max-w-3xl mx-auto text-center bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-[#223A60]">About Us</h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Ropani AI makes land prices transparent. We help buyers and sellers
          compare government rates with market prices, ensuring fair and trusted
          deals.
        </p>
      </div>

      {/* Contact Info */}
      <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h3 className="font-semibold text-[#00316C]">Our Address</h3>
          <p className="text-gray-600 mt-2">
            Sunway College, Maitidevi, <br />
            Kathmandu, Nepal, 44600
          </p>
        </div>

        <div className="bg-white p-6 shadow-md rounded-lg">
          <h3 className="font-semibold text-[#00316C]">Contact Us</h3>
          <p className="text-gray-600 mt-2">+977 111111111</p>
          <p className="text-gray-600">+977 0000000000</p>
          <p className="text-gray-600 mt-2">ropaniAI@gmail.com</p>
        </div>
      </div>
    </section>
  );
};

export default Landing;
