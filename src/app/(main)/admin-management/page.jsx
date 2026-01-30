"use client";
import React, { useState } from "react";


const AdminTable = () => {
  const [admins, setAdmins] = useState([
    {
      id: "1024",
      username: "@kaung",
      displayName: "Kaung Thant",
      status: "Active",
      photo: "./images/S&RcatPfp.jpg",
    },
  ]);

  const [confirmAdmin, setConfirmAdmin] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newAdmin, setNewAdmin] = useState({
    email: "",
    username: "",
    displayName: "",
  });

  const confirmToggleStatus = () => {
    setAdmins((prev) =>
      prev.map((admin) =>
        admin.id === confirmAdmin.id
          ? {
              ...admin,
              status: admin.status === "Active" ? "Banned" : "Active",
            }
          : admin
      )
    );
    setConfirmAdmin(null);
  };

  const handleCreateAdmin = (e) => {
    e.preventDefault();

    console.log("Admin Request Sent:", newAdmin);

    // Reset & close
    setNewAdmin({ email: "", username: "", displayName: "" });
    setShowCreateModal(false);
  };

  return (
    <div className="table-main-area">
      <div className="table-container">
        <div className="admin-table-header">
          <h2>Admin Management Overview</h2>

          <button
            className="btn-create-admin"
            onClick={() => setShowCreateModal(true)}
          >
            Create Admin
          </button>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Admin ID</th>
              <th>Username</th>
              <th>Display Name</th>
              <th>Profile Photo</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {admins.map((admin) => (
            <tr key={admin.id}>
                <td className="uid">{admin.id}</td>
                <td className="username">{admin.username}</td>
                <td className="display-name">{admin.displayName}</td>
                <td>
                  <img src={admin.photo} className="profile-img" />
                </td>
                <td>
                  <span
                    className={`status-label ${admin.status.toLowerCase()}`}
                  >
                    <span className="status-dot"></span>
                    {admin.status}
                  </span>
                </td>
                <td>
                  <button
                    className={
                      admin.status === "Active" ? "btn-ban" : "btn-unban"
                    }
                    onClick={() => setConfirmAdmin(admin)}
                  >
                    {admin.status === "Active" ? "Ban" : "Unban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="create-admin-overlay">
          <div className="create-admin-modal">
            <h3>Create Admin</h3>

            <form className="create-admin-form" onSubmit={handleCreateAdmin}>
              <input
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                required
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Username"
                value={newAdmin.username}
                required
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, username: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Name"
                value={newAdmin.displayName}
                required
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, displayName: e.target.value })
                }
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="btn-success">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ban / Unban Confirm Modal */}
      {confirmAdmin && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to{" "}
              <strong>
                {confirmAdmin.status === "Active" ? "Ban" : "Unban"}
              </strong>{" "}
              {confirmAdmin.displayName}?
            </p>

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setConfirmAdmin(null)}
              >
                Cancel
              </button>

              <button
                className={
                  confirmAdmin.status === "Active"
                    ? "btn-danger"
                    : "btn-success"
                }
                onClick={confirmToggleStatus}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
