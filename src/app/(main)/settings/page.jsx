"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const Settings = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  // States for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfilePicPreview(URL.createObjectURL(file));
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-page">
        <div className="settings-grid">

          {/* ===== LEFT MENU ===== */}
          <section className="settings-menu">
            <h1>Settings</h1>
            <div className="menu-section">
              <h3>Account Setting</h3>
              <hr />
              <ul>
                <li
                  className={activeSection === "profile" ? "active" : ""}
                  onClick={() => setActiveSection("profile")}
                >
                  Edit Profile
                </li>
                <li
                  className={activeSection === "security" ? "active" : ""}
                  onClick={() => setActiveSection("security")}
                >
                  Security & Email
                </li>
              </ul>
            </div>
          </section>

          {/* ===== RIGHT PANEL ===== */}
          <div className="settings-content">
            {activeSection === "profile" && (
              <section className="settings-card">
                <h2>Edit Profile</h2>
                <div className="profile-photo-container">
                  <div className="profile-photo-wrapper">
                    <img
                      className="profile-photo"
                      src={profilePicPreview || user?.profile_image || `/images/default-profiles/${user?.gender || "male"}.jpg`}
                      alt="Profile"
                    />
                    <label className="profile-photo-overlay">
                      <CameraAltOutlinedIcon className="camera-icon" />
                      <input type="file" hidden accept="image/*" onChange={handleProfilePicChange} />
                    </label>
                  </div>
                  <p className="profile-label">PROFILE PHOTO</p>
                </div>

                <div className="form-group">
                  <label>Display Name</label>
                  <input value={user?.display_name || "Admin"} onChange={(e) => setDisplayName(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Username</label>
                  <input value={user?.username || "admin"} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <button className="save-btn">Save Profile</button>
              </section>
            )}

            {activeSection === "security" && (
              <section className="settings-card">
                <h2>Account Security</h2>
                <p className="section-subtitle">Enter your current password to update your account details.</p>

            
                <div className="form-group ">
                  <label>Current Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      placeholder="Enter current password" 
                    />
                    <button 
                      type="button" 
                      className="eye-btn" 
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </button>
                  </div>
                </div>

                <div className="section-divider"></div>

                <div className="form-group">
                  <label>New Email Address</label>
                  <input type="email" defaultValue={user?.email || "email@example.com"} />
                </div>

                {/* New Password with Eye Toggle */}
                <div className="form-group">
                  <label>New Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder="Enter new password" 
                    />
                    <button 
                      type="button" 
                      className="eye-btn" 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password with Eye Toggle */}
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="password-input-wrapper">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Confirm new password" 
                    />
                    <button 
                      type="button" 
                      className="eye-btn" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
                    </button>
                  </div>
                </div>

                <button className="save-btn">Update Account</button>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;