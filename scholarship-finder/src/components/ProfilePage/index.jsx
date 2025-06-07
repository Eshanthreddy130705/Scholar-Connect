import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar.jsx";
import "./ProfilePage.css";

const initialProfile = {
  college: "",
  course: "",
  cpi: "",
  region: "",
  name: "",
  profilePicture: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [selectedFile, setSelectedFile] = useState(null); // For file upload

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file); // for preview
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    // console.log("Saving profile with data:", form.name);
    const formData = {
      name: form.name,
      college: form.college,
      course: form.course,
      cpi: form.cpi,
      region: form.region,
      profilePicture: form.profilePicture, // This will be a base64 string if set
    };
    // console.log("Form data to be sent:", JSON.stringify(formData));
    const response = await fetch("http://localhost:3000/user/profile/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtoken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error updating profile:", error);
      return;
    }

    const updatedProfile = await response.json();
    setProfile(updatedProfile);
    setForm(updatedProfile);
    setSelectedFile(null);
    setEditing(false);
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtoken")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setProfile(data);
        setForm(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <h1>Student Profile</h1>

        <div className="profile-box">
          <div>
            {editing ? (
              <div className="profile-field">
                <label>Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  name="profilePicture"
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <img
                src={
                  form.profilePicture && form.profilePicture.trim() !== ""
                    ? form.profilePicture
                    : "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small_2x/user-icon-on-transparent-background-free-png.png"
                }
                alt="Profile"
                className="profile-pic"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://static.vecteezy.com/system/resources/thumbnails/019/879/186/small_2x/user-icon-on-transparent-background-free-png.png";
                }}
              />
            )}
          </div>

          <div className="profile-table">
            <div className="profile-field">
              <label>Name</label>
              {editing ? (
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              ) : (
                <p>{profile.name}</p>
              )}
            </div>

            <div className="profile-field">
              <label>College</label>
              {editing ? (
                <input
                  name="college"
                  value={form.college}
                  onChange={handleChange}
                  placeholder="Enter your college name"
                />
              ) : (
                <p>{profile.college}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Course</label>
              {editing ? (
                <input
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="Enter your course"
                />
              ) : (
                <p>{profile.course}</p>
              )}
            </div>

            <div className="profile-field">
              <label>CPI</label>
              {editing ? (
                <input
                  name="cpi"
                  value={form.cpi}
                  onChange={handleChange}
                  placeholder="Enter your CPI"
                  type="number"
                />
              ) : (
                <p>{profile.cpi}</p>
              )}
            </div>

            <div className="profile-field">
              <label>Region</label>
              {editing ? (
                <input
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  placeholder="Enter your region"
                />
              ) : (
                <p>{profile.region}</p>
              )}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          {editing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button
                onClick={handleCancel}
                style={{ backgroundColor: "#64748b" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEdit}>Edit Profile</button>
          )}
        </div>
      </div>
    </>
  );
}
