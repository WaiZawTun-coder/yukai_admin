"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { useApi } from "../../../utilities/api";
import Image from "next/image";

const Settings = () => {
  const { user, setUser } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const apiFetch = useApi();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // States for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profilePicFile, setProfilePicFile] = useState(null);

  const [saving, setSaving] = useState(false);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    if (profilePicPreview) {
      URL.revokeObjectURL(profilePicPreview);
    }

    setProfilePicFile(file);
    setProfilePicPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (profilePicPreview) {
        URL.revokeObjectURL(profilePicPreview);
      }
    };
  }, [profilePicPreview]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      if (displayName) formData.append("display_name", displayName);
      // if (username) formData.append("username", username);
      if (profilePicFile) formData.append("profile_image", profilePicFile);

      const res = await apiFetch("/api/edit-admin-profile", {
        method: "POST",
        body: formData,
      });

      if (res.status) {
        const newUser = { ...user };
        if (displayName) newUser.display_name = displayName;
        // if (username) newUser.username = username;
        if (profilePicPreview) newUser.profile_image = res.data.profile_image;

        setUser(newUser);
      }
    } catch (error) {
      console.error("Failed to save profile:", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    try {
      if (newPassword !== confirmNewPassword) {
        alert("New password and confirm password do not match.");
        return;
      }

      const res = await apiFetch("/api/check-admin-password", {
        method: "POST",
        body: { password: currentPassword },
      });

      if (!res.status) {
        alert("Incorrect current password.");
        return;
      }

      const updatePasswordRes = await apiFetch("/api/change-admin-password", {
        method: "POST",
        body: { new_password: newPassword },
      });

      if (updatePasswordRes.status) {
        alert("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        alert(
          updatePasswordRes.message ||
            "Failed to update password. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error updating password:", error.message);
      alert(error.message || "An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    const updateFormFields = () => {
      if (user) {
        setDisplayName(user.display_name || "");
        setUsername(user.username || "");
        setEmail(user.email || "");
      }
    };

    updateFormFields();
  }, [user]);

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
                {user.role !== "super_admin" && (
                  <li
                    className={activeSection === "security" ? "active" : ""}
                    onClick={() => setActiveSection("security")}
                  >
                    Security
                  </li>
                )}
              </ul>
            </div>
          </section>

          {/* ===== RIGHT PANEL ===== */}
          <div className="settings-content">
            {activeSection === "profile" && (
              <section className="settings-card">
                <h2>Edit Profile</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveProfile();
                  }}
                >
                  <div className="profile-photo-container">
                    <div className="profile-photo-wrapper">
                      <Image
                        className="profile-photo"
                        src={
                          profilePicPreview
                            ? profilePicPreview
                            : user?.profile_image
                              ? `/api/images?url=${user?.profile_image}`
                              : `/Images/default-profiles/${user?.gender || "male"}.jpg`
                        }
                        alt="Profile"
                        width={142}
                        height={142}
                      />
                      <label className="profile-photo-overlay">
                        <CameraAltOutlinedIcon className="camera-icon" />
                        <input
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={handleProfilePicChange}
                        />
                      </label>
                    </div>
                    <p className="profile-label">PROFILE PHOTO</p>
                  </div>

                  <div className="form-group">
                    <label>Display Name</label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Username <span>username cannot be edited</span>
                    </label>
                    <input
                      value={username}
                      disabled
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>New Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button className="save-btn" type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </form>
              </section>
            )}

            {activeSection === "security" && (
              <section className="settings-card">
                <h2>Account Security</h2>
                <p className="section-subtitle">
                  Enter your current password to update your account details.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSavePassword();
                  }}
                >
                  <div className="form-group ">
                    <label>Current Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                        }}
                        value={currentPassword}
                      />
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="section-divider"></div>
                  {/* New Password with Eye Toggle */}
                  <div className="form-group">
                    <label>New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                        }}
                        value={newPassword}
                      />
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
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
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        value={confirmNewPassword}
                      />
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )}
                      </button>
                    </div>
                  </div>

                  <button className="save-btn" type="submit">
                    Update Account
                  </button>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
