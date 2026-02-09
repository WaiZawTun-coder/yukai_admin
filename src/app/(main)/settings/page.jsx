"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';

const Settings = () => {
  const { user } = useAuth();

  const [adminName, setAdminName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  // Edit states (empty → placeholder mode)
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const handleVerify = () => {
    setError("");

    if (!user) {
      setError("User not loaded yet.");
      return;
    }

    if (adminName !== user.username) {
      setError("Admin name is incorrect.");
      return;
    }

    if (!oldPassword) {
      setError("Please enter the old password.");
      return;
    }

    setIsVerified(true);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePic(file);
    setProfilePicPreview(URL.createObjectURL(file));
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-page">
        <h1 className="page-title">Settings</h1>

        <div className="settings-grid">
          {/* ===== Verification ===== */}
          {!isVerified && (
            <section className="settings-card">
              <h2>Edit Email & Password</h2>

              <div className="form-group">
                <label>Admin Name</label>
                <input
                  type="text"
                  placeholder="Admin Name"
                  onChange={(e) => setAdminName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Enter Old Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>

              {error && <p style={{ color: "red" }}>{error}</p>}

              <button className="save-btn" onClick={handleVerify}>
                Continue
              </button>
            </section>
          )}

          {/* ===== Edit Email & Password ===== */}
          {isVerified && (
            <section className="settings-card">
              <h2>Edit Email & Password</h2>

              <div className="form-group">
                <label>New Email</label>
                <input
                  type="email"
                  placeholder={user?.email || "New Email"}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="New Password" />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" placeholder="Confirm Password" />
              </div>

              <button className="save-btn">Save Changes</button>
            </section>
          )}

          {/* ===== Modern Edit Profile ===== */}
          <section className="settings-card ">
            <h2>Edit Profile</h2>

            <div className="profile-photo-wrapper modern-profile">
              <img
                src={profilePicPreview || user?.profilePic}
                alt="Profile"
                className="profile-photo"
              />

              <label className="edit-photo-btn">
                <BorderColorRoundedIcon fontSize="small"/>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfilePicChange}
                />
              </label>
            </div>

            <p className="profile-label ">PROFILE PHOTO</p>

            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                placeholder={
                  user?.display_name || "Admin"
                }
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder={user?.username || "Username"}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <button className="save-btn">Save Profile</button>
          </section>

          {/* ===== Privacy ===== */}
          <section className="settings-card">
            <h2>Privacy Settings</h2>

            <div className="toggle-row">
              <div>
                <h4>Enforce Two-Factor Authentication</h4>
                <p>Require 2FA for every login.</p>
              </div>

              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </div>

            <div className="form-group">
              <label>Data Access Control</label>
              <select>
                <option>Full Access</option>
                <option>Limited Access</option>
                <option>Read Only</option>
              </select>
            </div>

            <button className="save-btn">Save</button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
