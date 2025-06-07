// src/pages/ScholarshipDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ScholarshipDetailPage.css';

const ScholarshipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScholarshipDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/scholarship/${id}`);
        const Data = await response.json();
        console.log(Data);
        const ddata={
          "Eligibility": "PhD degree holders",
          "Region": "India",
          "Deadline": "Always Open",
          "Award": "INR 45,000 to INR 55,000 per month plus HRA",
          "Description": "The Indian Institute of Technology, Bhubaneswar is inviting applications for IIT Bhubaneswar Post Doctoral Fellowship Programme 2020 from PhD degree holders below 35 years of age. The fellows will be required to participate in the teaching and research activities of the Institute including mentoring young undergraduates and post-graduate students. The selected fellows will receive a fellowship of  INR 45,000 to INR 55,000 per month plus HRA (depending upon the experience and qualification).",
          "Email": "ar.acad@iitbbs.ac.in",
          "Contact Number": "0674-7134578",
          "link": "http://webapps.iitbbs.ac.in/pdf-application/index.php",
          "category": "mixed",
          "Links": "{'Apply online link': 'http://webapps.iitbbs.ac.in/pdf-application/pdf-registration.php', 'Latest scholarship link': 'http://webapps.iitbbs.ac.in/pdf-application/index.php', 'Others': 'http://webapps.iitbbs.ac.in/pdf-application/pdf-usefull-info-01.pdf'}",
          "contactDetails": "Assistant Registrar (Academic Affairs)\nIndian Institute of Technology Bhubaneswar\nArgul, Khordha-752050, ODISHA\nE-mail id – ar.acad@iitbbs.ac.in\nContact No. – 0674-7134578",
          "name": "Name"
        }
        const data = Data[0] || ddata; // Use the first item or sample data if not found
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch scholarship details');
        }

        setScholarship(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchScholarshipDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleApplyClick = () => {
    // In a real app, this would redirect to the application page or external site
    const links = JSON.parse(scholarship.Links.replace(/'/g, '"'));
    if(links['Apply online link']){
      window.open(links['Apply online link'], '_blank');
    }
  };

  if (loading) {
    return <div className="loading">Loading scholarship details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!scholarship) {
    return <div className="not-found">Scholarship not found</div>;
  }

  const deadline = (new Date(scholarship.Deadline) === "Invalid Date" ? scholarship.Deadline : new Date(scholarship.Deadline));
  const now = new Date();
  const diffTime = deadline - now;
  const links = JSON.parse(scholarship.Links.replace(/'/g, '"'));
  let diffDays = -1;
  if(new Date(scholarship.Deadline).toLocaleDateString() !== "Invalid Date"){
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="scholarship-detail-container">
      <button onClick={handleBackClick} className="back-button">
        &larr; Back to Scholarships
      </button>

      <div className="scholarship-header">
        <h1>{scholarship.name}</h1>
        <div className="scholarship-meta">
          <span className="amount-badge">
            {scholarship.category} Funding
          </span> 
          <span className="deadline">
            Deadline: {deadline.toLocaleDateString()} {diffDays > 0 ? `(${diffDays} days left)` : ""}
          </span>
        </div>
      </div>

      <div className="scholarship-content">
        <div className="main-content">
          <div className="section">
            <h2>Description</h2>
            <p>{scholarship.Description}</p>
          </div>

          <div className="section">
            <h2>Eligibility Criteria</h2>
            <ul>
              <li><strong> {scholarship.Eligibility}</strong></li>
              <li><strong>Location:</strong> {scholarship.Region}</li>
              {/* {scholarship.specialCriteria && (
                <li><strong>Special Criteria:</strong> {scholarship.specialCriteria}</li>
              )} */}
            </ul>
          </div>

          <div className="section">
            <h2>Benefits</h2>
            <p>{scholarship.Award}</p>
          </div>

        <div className="sidebar">
          <div className="sidebar-section">
            <h3>Quick Facts</h3>
            <ul>
              <li><strong>Provider:</strong> {scholarship.name}</li>
              <li><strong>Funding Type:</strong> {scholarship.category}</li>
              {/* <li><strong>Number of Awards:</strong> {scholarship.numberOfAwards || 'Varies'}</li> */}
              {/* <li><strong>Renewable:</strong> {scholarship.renewable ? 'Yes' : 'No'}</li> */}
            </ul>
          </div>

          <div className="sidebar-section">
            <h3>Contact Information</h3>
            {scholarship.contactDetails}
          </div>

          <div className="sidebar-section">
            <h3>Webite Link:</h3>
            <a href={links['Original website'] || scholarship.link} target='_blank'>{scholarship.link}</a>
          </div>

          <button 
            onClick={handleApplyClick} 
            className="apply-button"
            disabled={diffDays <= 0}
          >
            {diffDays <= 0 ? 'Application Closed' : 'Apply Now'}
          </button>

          {diffDays <= 0 && (
            <p className="expired-notice">This scholarship deadline has passed.</p>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ScholarshipDetailPage;