import React from "react";
import "./css/landform.css";
import { useNavigate } from "react-router-dom";

const LandForm = () => {
    const navigate = useNavigate();
  return (
    <div className="land-form-container">
      {/* Upload Section */}
      <div className="upload-section">
        <h2 className="upload-heading">
          Upload Your <span className="highlight">Lalpurja</span> To Fill The Form
        </h2>
        <div className="upload-box">
          <p>📤 Upload photo/Drag and Drop</p>
        </div>
      </div>

      {/* Main Form Section */}
      <form className="land-details-form">
        <h3 className="form-title">Land Details Form</h3>

        {/* Owner Information */}
        <fieldset>
          <legend>Owner Information</legend>
          <div className="form-row">
            <label>Full name:</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Father's / Husband's Name (if available):</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Citizenship No.:</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Issued District:</label>
            <input type="text" />
          </div>
        </fieldset>

        {/* Land Information */}
        <fieldset>
          <legend>Land Information</legend>
          <div className="form-row">
            <label>Land Parcel (Plot) Number (किता नं.):</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Sheet Number (नक्शा नं.):</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>District (जिल्ला):</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Land Area (in Ropani):</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Ward Number (वडा नं.):</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Municipality/Rural Municipality (गा.पा./ना.पा.):</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Short Description:</label>
            <textarea rows="3"></textarea>
          </div>
        </fieldset>

        {/* Registration Details */}
        <fieldset>
          <legend>Registration Details</legend>
          <div className="form-row">
            <label>Lalpurja Number:</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Malpot (Land Revenue Office) Name:</label>
            <input type="text" />
          </div>
          <div className="form-row">
            <label>Date of Issue (निबन्ध):</label>
            <input type="text" />
          </div>
          <div className="form-row small">
            <label>Enter Your Price:</label>
            <input type="text" />
          </div>
        </fieldset>

        {/* Buttons */}
        <div className="button-row">
          <button type="button" className="predict-btn">
            Predict Land Price
          </button>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>

      {/* Go Back */}
     
      <div className="go-back" onClick={() => navigate("/land/")}>
        &lt; Go Back
      </div>
  
      
    </div>
  );
};

export default LandForm;
