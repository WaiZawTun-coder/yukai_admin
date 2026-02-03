"use client";

const Settings = () => {
  return (
    <div className="settings-wrapper">
      <div className="settings-page">
        <h1 className="page-title">Settings</h1>

        {/* ===== TWO COLUMN LAYOUT ===== */}
        <div className="settings-grid">
          
          {/* ===== Edit Profile ===== */}
          <section className="settings-card">
            <h2>Edit Profile</h2>

            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Full name" />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="example@gmail.com" />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input type="password" placeholder="••••••••" />
            </div>

            <button className="save-btn">Save</button>
          </section>

          {/* ===== Privacy Settings  ===== */}
          <section className="settings-card">
            <h2>Privacy Settings</h2>

            <div className="toggle-row">
              <div>
                <h4>Enforce Two-Factor Authentication </h4>
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
