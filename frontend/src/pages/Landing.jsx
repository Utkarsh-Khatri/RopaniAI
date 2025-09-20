import React from "react";
import "./css/landing.css";

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>
            Welcome To <span className="highlight">RopaniAI</span>
          </h1>
          <p className="subtitle">
            Transparent Land Prices. Smarter Deals. A Fair Market for Everyone.
          </p>
        </div>
      </div>

      {/* Dashboard Section */}
      <section className="dashboard">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Dashboard</h2>

          {/* Search Filters */}
          <div className="search-bar">
            <input type="text" placeholder="Search District" />
            <input type="text" placeholder="Search Municipality" />
            <input type="text" placeholder="Search Ward No." />
          </div>
        </div>

        {/* Graph Placeholder */}
        <div className="graph-container">
          <div className="graph-placeholder">
            {/* Graph Image/Component would go here */}
          </div>
        </div>
      </section>
    </div>
  );
}
