import React, { useEffect, useState } from "react";
import "./css/dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
  });
  const [properties, setProperties] = useState([]);
  const [photo, setPhoto] = useState(null);

  // 🔹 Fetch profile + property list
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/"; // redirect to login
      return;
    }

    // Fetch user details
    fetch(`${process.env.REACT_APP_API_URL}/dashboard/profile/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => console.error(err));

    // Fetch user's property list
    fetch(`${process.env.REACT_APP_API_URL}/dashboard/my-properties/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch properties");
        return res.json();
      })
      .then((data) => setProperties(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Save updated profile info
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dashboard/profile/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(user),
        }
      );

      if (response.ok) {
        alert("✅ Profile updated successfully!");
      } else {
        alert("❌ Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Something went wrong.");
    }
  };

  // 🔹 Local photo upload (UI only for now)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">My Dashboard</h2>

      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-photo">
          <img
            src={photo || "/images/profile-placeholder.png"}
            alt="Profile"
            className="profile-img"
          />
          <input
            type="file"
            accept="image/*"
            id="photo-upload"
            onChange={handlePhotoUpload}
            style={{ display: "none" }}
          />
          <label htmlFor="photo-upload" className="upload-btn">
            Upload Photo
          </label>
        </div>

        <form className="profile-form" onSubmit={handleSaveProfile}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={user.full_name}
              onChange={(e) =>
                setUser({ ...user, full_name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={user.email} disabled />
          </div>

          <div className="form-group">
            <label>Phone No:</label>
            <input
              type="text"
              value={user.phone_number}
              onChange={(e) =>
                setUser({ ...user, phone_number: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              value={user.address}
              onChange={(e) =>
                setUser({ ...user, address: e.target.value })
              }
            />
          </div>

          <button type="submit" className="save-btn">
            Save Profile
          </button>
        </form>
      </div>

      {/* Property Section */}
      <div className="property-section">
        <h3>My Property List</h3>

        <div className="property-filters">
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
          <button className="clear-btn">Clear</button>
        </div>

        <div className="property-list">
          {properties.length > 0 ? (
            properties.map((property) => (
              <div key={property.id} className="property-card">
                <img
                  src={property.image || "/images/land-placeholder.jpg"}
                  alt={property.title}
                  className="property-img"
                />
                <div className="property-info">
                  <h4>{property.title}</h4>
                  <p>📍 {property.location}</p>
                  <p>Land ID: {property.id}</p>
                  <p>Area: {property.area} Aana</p>
                  <p>Price: NPR. {property.price}</p>
                  <p>Seller: {property.seller_name}</p>
                  <button className="edit-btn">Edit Details</button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-property-text">No properties listed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
