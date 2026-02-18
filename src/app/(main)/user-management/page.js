"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useApi } from "../../../utilities/api";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmUser, setConfirmUser] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");

  const apiFetch = useApi();

  // Fetch users for a specific page
  const fetchUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const res = await apiFetch(
          `/api/admin/get-users?page=${page}&limit=${limit}${searchTerm ? `&search=${searchTerm}` : ""}`,
        );

        if (res?.status) {
          const formatted = res.data.map((user) => ({
            id: String(user.user_id),
            username: "@" + user.username,
            displayName: user.display_name,
            isActive: user.is_active == 1,
            isSuspended: user.status == "suspend_user",
            isWarned: user.status == "warn_user",
            photo: user.profile_image || "/images/default-profiles/male.jpg",
          }));

          setUsers(formatted);
          setCurrentPage(res.page || page);
          setTotalPages(res.total_pages || 1);
          setLimit(res.limit || limit);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [apiFetch, limit, searchTerm],
  );

  // Initial load or when page/searchTerm changes
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, searchTerm, fetchUsers]);

  useEffect(() => {
    setCurrentPage(1);
    fetchUsers(1);
  }, [fetchUsers, searchTerm]);

  const confirmUserAction = async () => {
    try {
      const action = confirmUser.action;

      const res = await apiFetch(`/api/${action}-user`, {
        method: "POST",
        body: {
          user_id: confirmUser.id,
        },
      });

      if (!res?.status) return;

      // 🔥 Optimistic UI update
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id !== confirmUser.id) return u;

          switch (action) {
            case "ban":
              return { ...u, isActive: false };

            case "unban":
              return { ...u, isActive: true };

            case "suspend":
              return { ...u, isSuspended: true };

            case "unsuspend":
              return { ...u, isSuspended: false };

            case "warn":
              return { ...u, isWarned: true };

            case "unwarn":
              return { ...u, isWarned: false };

            default:
              return u;
          }
        }),
      );

      setConfirmUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!statusFilter) return true;

    if (statusFilter === "active")
      return user.isActive && !user.isSuspended && !user.isWarned;

    if (statusFilter === "banned") return !user.isActive;

    if (statusFilter === "suspended") return user.isSuspended;

    if (statusFilter === "warned") return user.isWarned;

    return true;
  });

  return (
    <div className="table-main-area">
      <div className="table-container">
        {/* HEADER */}
        <div className="table-header">
          <h2>User Management Overview</h2>

          <div>
            <input
              type="text"
              className="search-input"
              placeholder="Search by ID, Username, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              {/* <option value="suspended">Suspended</option> */}
              <option value="warned">Warned</option>
            </select>
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
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.displayName}</td>
                  <td>
                    <img
                      src={user.photo}
                      className="profile-img"
                      onError={(e) =>
                        (e.target.src = "/images/default-profiles/male.jpg")
                      }
                    />
                  </td>
                  <td>
                    {!user.isActive && (
                      <span className="status-label banned">Banned</span>
                    )}

                    {user.isActive && !user.isSuspended && !user.isWarned && (
                      <span className="status-label active">Active</span>
                    )}

                    {user.isSuspended && (
                      <span className="status-label suspended">Suspended</span>
                    )}

                    {user.isWarned && (
                      <span className="status-label warned">Warned</span>
                    )}
                  </td>
                  <td>
                    <select
                      className="action-select"
                      onChange={(e) => {
                        if (!e.target.value) return;
                        setConfirmUser({ ...user, action: e.target.value });
                        e.target.value = "";
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Action
                      </option>

                      {user.isActive && <option value="ban">Ban</option>}
                      {!user.isActive && <option value="unban">Unban</option>}

                      {/* {!user.isSuspended && (
                        <option value="suspend">Suspend</option>
                      )}
                      {user.isSuspended && (
                        <option value="unsuspend">Unsuspend</option>
                      )} */}

                      {!user.isWarned && <option value="warn">Warn</option>}
                      {user.isWarned && (
                        <option value="unwarn">Remove Warning</option>
                      )}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <button
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages || loading}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirmUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 style={{ width: "100%", textAlign: "left", padding: "0 10px" }}>
              Confirm Action
            </h3>
            <p style={{ width: "100%", textAlign: "left", padding: "0 10px" }}>
              Are you sure you want to <strong>{confirmUser.action}</strong>{" "}
              {confirmUser.displayName}?
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setConfirmUser(null)}
              >
                Cancel
              </button>
              <button
                className={
                  confirmUser.action === "ban" ||
                  confirmUser.action === "suspend"
                    ? "btn-danger"
                    : "btn-success"
                }
                onClick={confirmUserAction}
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
