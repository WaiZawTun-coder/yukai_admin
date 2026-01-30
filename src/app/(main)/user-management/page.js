"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";

export default function Page() {
  const [users, setUsers] = useState([
    { id: "1024", username: "@kaung", displayName: "Kaung Thant", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1025", username: "@thant", displayName: "Thant Sithu Thein", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1026", username: "@arkar", displayName: "Saw Win Myint Aung", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1027", username: "@waizawhtun", displayName: "Wai Zaw Htun", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1028", username: "@bawgyi", displayName: "Aung Thu Hein", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1029", username: "@kaung", displayName: "Kaung Thant", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1030", username: "@kaung", displayName: "Kaung Thant", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1031", username: "@thant", displayName: "Thant Sithu Thein", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1032", username: "@arkar", displayName: "Saw Win Myint Aung", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1033", username: "@waizawhtun", displayName: "Wai Zaw Htun", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1034", username: "@bawgyi", displayName: "Aung Thu Hein", status: "Active", photo: "./images/S&RcatPfp.jpg" },
    { id: "1035", username: "@kaung", displayName: "Kaung Thant", status: "Active", photo: "./images/S&RcatPfp.jpg" },
  ]);

  const [confirmUser, setConfirmUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortRef = useRef(null);

  // Close sort menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  //  Filter + Sort logic
  const filteredUsers = useMemo(() => {
    let filtered = users.filter((user) => {
      const term = searchTerm.toLowerCase();
      return (
        user.id.includes(term) ||
        user.username.toLowerCase().includes(term) ||
        user.displayName.toLowerCase().includes(term)
      );
    });

    filtered.sort((a, b) => {
      let value = 0;

      if (sortBy === "name") {
        value = a.displayName.localeCompare(b.displayName);
      } else if (sortBy === "status") {
        value = a.status.localeCompare(b.status);
      } else {
        value = Number(a.id) - Number(b.id);
      }

      return sortOrder === "asc" ? value : -value;
    });

    return filtered;
  }, [users, searchTerm, sortBy, sortOrder]);

  return (
    <div className="table-main-area">
      <div className="table-container">
        {/* HEADER */}
        <div className="table-header">
          <h2>User Management Overview</h2>

          <div className="table-controls">
            {/* SEARCH */}
            <input
              type="text"
              className="search-input"
              placeholder="Search by ID,Username,Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* SORT MENU */}
            <div className="sort-wrapper" ref={sortRef}>
              <button
                className="sort-trigger"
                onClick={() => setShowSortMenu((prev) => !prev)}
              >
                Sort <span className="sort-icon">⇅</span>
              </button>

              {showSortMenu && (
                <div className="sort-menu">
                  <div className="sort-section">
                    <p className="sort-title">Sort by</p>

                    <button
                      className={sortBy === "name" ? "active" : ""}
                      onClick={() => setSortBy("name")}
                    >
                      Name
                    </button>

                    <button
                      className={sortBy === "id" ? "active" : ""}
                      onClick={() => setSortBy("id")}
                    >
                      ID
                    </button>

                    <button
                      className={sortBy === "status" ? "active" : ""}
                      onClick={() => setSortBy("status")}
                    >
                      Status
                    </button>
                  </div>

                  <div className="sort-divider" />

                  <div className="sort-section">
                    <button
                      className={sortOrder === "asc" ? "active" : ""}
                      onClick={() => setSortOrder("asc")}
                    >
                       Ascending
                    </button>

                    <button
                      className={sortOrder === "desc" ? "active" : ""}
                      onClick={() => setSortOrder("desc")}
                    >
                       Descending
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <table className="user-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Display Name</th>
              <th>Profile</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              
              <tr key={user.id}>
                <td className="uid">{user.id}</td>
                <td className="username">{user.username}</td>
                <td className="display-name">{user.displayName}</td>
                <td>
                  <img src={user.photo} className="profile-img" />
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
                    {user.status === "Active" ? "Ban" : "Unban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONFIRM MODAL */}
      {confirmUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to{" "}
              <strong>{confirmUser.status === "Active" ? "Ban" : "Unban"}</strong>{" "}
              {confirmUser.displayName}?
            </p>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmUser(null)}>
                Cancel
              </button>
              <button
                className={
                  confirmUser.status === "Active"
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
}
