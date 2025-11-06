import React from "react";
import { MapPin, Phone, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./css/land.css"; // 👈 custom CSS

const Land = () => {
  const navigate = useNavigate();
  // Temporary static data — replace with backend later
  const lands = [
    {
      id: "00001",
      title: "Residential land for sale",
      location: "Chovar, Kirtipur, Kathmandu",
      area: "9 Anna",
      price: "NPR. 20,00,000/Aana",
      seller: "Utkarsh",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: "00002",
      title: "Land for sale",
      location: "Chovar, Kirtipur, Kathmandu",
      area: "9 Anna",
      price: "NPR. 20,00,000/Aana",
      seller: "Utkarsh",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
    },
    {
      id: "00003",
      title: "Residential land for sale",
      location: "Chovar, Kirtipur, Kathmandu",
      area: "9 Anna",
      price: "NPR. 20,00,000/Aana",
      seller: "Utkarsh",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60",
    },
  ];

  return (
    <div className="land-page-body">
      {/* Top Value Section */}
      <div className="value-section">
        <h2>
          Want to know the <span className="highlight">value of your land?</span>
        </h2>
        <p>Fill out the form or upload photo of the legal document (Lalpurja).</p>
        <div className="top-buttons">
        <button
      className="form-btn"
      onClick={() => navigate("/land/form")}
    >
      Form
    </button>
          <button className="upload-btn">Upload Photo</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Filter Section */}
        <div className="filter-box">
          <h3>Filter Your Search</h3>
          <select>
            <option>Select District</option>
          </select>
          <select>
            <option>Select Municipality</option>
          </select>
          <select>
            <option>Select Price Range</option>
          </select>
          <select>
            <option>Select Land Price Type</option>
          </select>
          <button className="clear-btn">CLEAR</button>
        </div>

        {/* Right Section */}
        <div className="listings-section">
          {/* Top Controls */}
          <div className="listings-top">
            <button className="sell-btn">Sell Property</button>
            <div className="sort-box">
              <span>SORT BY</span>
              <select>
                <option>Latest</option>
              </select>
            </div>
          </div>

          {/* Listings */}
          {lands.map((land) => (
            <div key={land.id} className="listing-card">
              <div className="listing-image">
                <img src={land.image} alt={land.title} />
              </div>
              <div className="listing-info">
                <h4>{land.title}</h4>
                <p className="location">
                  <MapPin size={16} className="icon" />
                  {land.location}
                </p>
                <p><strong>Land ID:</strong> {land.id}</p>
                <p><strong>Area:</strong> {land.area}</p>
                <p><strong>Price:</strong> {land.price}</p>
                <p><strong>Seller Name:</strong> {land.seller}</p>
                <div className="listing-buttons">
                  <button className="contact-btn">
                    <Phone size={16} /> Contact
                  </button>
                  <button className="buy-btn">
                    <ShoppingCart size={16} /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="pagination">
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>Last</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Land;
