"use client";
import React, { useState } from "react";



const UserTable = () => {
  const [users, setUsers] = useState([
    { id: "1024", username: "@kaung", displayName: "Kaung Thant", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1025", username: "@thant", displayName: "Thant Sithu Thein", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1026", username: "@arkar", displayName: "Saw Win Myint Aung", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1027", username: "@waizawhtun", displayName: "Wai Zaw Htun", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1028", username: "@bawgyi", displayName: "Aung Thu Hein", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1029", username: "@kaung", displayName: "Kaung Thant", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1030", username: "@thant", displayName: "Thant Sithu Thein", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1031", username: "@arkar", displayName: "Saw Win Myint Aung", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1032", username: "@waizawhtun", displayName: "Wai Zaw Htun", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1033", username: "@bawgyi", displayName: "Aung Thu Hein", status: "Active", photo: "./images/S&RcatPfp.jpg" },
  ]);

  const [confirmUser, setConfirmUser] = useState(null);

  const confirmToggleStatus = () => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === confirmUser.id
          ? { ...user, status: user.status === "Active" ? "Banned" : "Active" }
          : user
      )
    );
    setConfirmUser(null);
  };

  return (
    <div className="table-main-area">
      <div className="table-container">
        <div className="table-header">
          <h2>User Management Overview</h2>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Display Name</th>
              <th>Profile Photo</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><div className="uid">{user.id}</div></td>
                <td><div className="username">{user.username}</div></td>
                <td><div className="display-name">{user.displayName}</div></td>
                <td>
                  <img src={user.photo} alt={user.displayName} className="profile-img" />
                </td>
                <td>
                  <span className={`status-label ${user.status.toLowerCase()}`}>
                    <span className="status-dot"></span>
                    {user.status}
                  </span>
                </td>
                <td>
                  <button
                    className={user.status === "Active" ? "btn-ban" : "btn-unban"}
                    onClick={() => setConfirmUser(user)}
                  >
                    {user.status === "Active" ? "Ban" : "Un Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Popup */}
      {confirmUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Action</h3>
            <p>Are you sure you want to <strong>{confirmUser.status === "Active" ? "Ban" : "Unban"}</strong> {confirmUser.displayName}?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmUser(null)}>Cancel</button>
              <button
                className={confirmUser.status === "Active" ? "btn-danger" : "btn-success"}
                onClick={confirmToggleStatus}
              >
                {confirmUser.status === "Active"? "Yes, Ban" : "Yes, UnBan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;




