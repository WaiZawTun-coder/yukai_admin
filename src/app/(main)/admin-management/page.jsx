"use client";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useApi } from "../../../utilities/api";

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);

  const { user: authUser } = useAuth();
  const apiFetch = useApi();

  const [confirmAdmin, setConfirmAdmin] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [adminBanError, setAdminBanError] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [isLoading, setIsLoading] = useState(true);

  const [newAdmin, setNewAdmin] = useState({
    email: "",
    displayName: "",
  });

  const filteredAdmins = admins.filter((admin) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      admin.username.toLowerCase().includes(term) ||
      admin.displayName.toLowerCase().includes(term) ||
      String(admin.id).toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "All" || admin.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const confirmToggleStatus = async (action = "ban") => {
    const res = await apiFetch(`/api/${action}-admin`, {
      method: "POST",
      body: { banned_admin_id: confirmAdmin.id },
    });

    if (res.status) {
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === confirmAdmin.id
            ? {
                ...admin,
                status: admin.status === "Active" ? "Banned" : "Active",
              }
            : admin,
        ),
      );
      setConfirmAdmin(null);
    } else {
      setAdminBanError(res.message);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    setCreateError("");
    setCreating(true);

    try {
      const res = await apiFetch("/auth/admin/register", {
        method: "POST",
        body: newAdmin,
      });

      if (!res || !res.status) {
        // API returned error
        setCreateError(res?.message || "Failed to create admin");
        return;
      }

      const createdAdmin = res.data;

      setAdmins((prev) => [
        ...prev,
        {
          id: createdAdmin.admin_id || createdAdmin.email,
          username: "@" + createdAdmin.username,
          displayName: createdAdmin.display_name,
          status: createdAdmin.is_active == 1 ? "Active" : "Banned",
          photo: "/Images/default-profiles/male.jpg",
        },
      ]);

      // Success
      setNewAdmin({ email: "", displayName: "" });
      setShowCreateModal(false);

      // Optional: reload admin list
      // await getAdmin();  (if you move getAdmin outside useEffect)
    } catch (error) {
      console.error(error);
      setCreateError(error.message || "Server error. Please try again.");
    } finally {
      setCreating(false);
    }
  };
  const getAdmin = useCallback(
    async (page = 1) => {
      try {
        setIsLoading(true);
        const res = await apiFetch(`/api/get-admin-lists?page=${page}`);

        if (res?.status && res?.data) {
          const formattedAdmins = res.data.map((admin, index) => ({
            id: admin.admin_id || index,
            username: "@" + admin.username,
            displayName: admin.display_name,
            status: admin.is_active == "1" ? "Active" : "Banned",
            photo: admin.profile_image || "/Images/default-profiles/male.jpg",
          }));

          setAdmins(formattedAdmins);
          setCurrentPage(res.current_page);
          setTotalPages(res.total_pages);
        }
      } catch (error) {
        console.error("Failed to fetch admins:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [apiFetch],
  );

  useEffect(() => {
    getAdmin(currentPage);
  }, [apiFetch, getAdmin, currentPage]);

  return (
    <div className="table-main-area">
      <div className="table-container">
        <div className="admin-table-header">
          <h2>Admin Management Overview</h2>

          <div className="admin-header-actions">
            <select
              className="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Banned">Banned</option>
            </select>

            <input
              type="text"
              placeholder="Search by ID, username, or name..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {authUser.role == "super_admin" && (
              <button
                className="btn-create-admin"
                onClick={() => setShowCreateModal(true)}
              >
                Create Admin
              </button>
            )}
          </div>
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
            {isLoading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Loading admins...
                </td>
              </tr>
            ) : (
              filteredAdmins.map((admin) => (
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
              ))
            )}
            {filteredAdmins.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => getAdmin(currentPage - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => getAdmin(currentPage + 1)}
          >
            Next
          </button>
        </div>
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
                  setNewAdmin({ ...newAdmin, email: e.target.value }) ||
                  setCreateError("")
                }
              />

              <input
                type="text"
                placeholder="Name"
                value={newAdmin.displayName}
                required
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, displayName: e.target.value }) ||
                  setCreateError("")
                }
              />
              {createError && <div className="form-error">{createError}</div>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-success"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create"}
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

            {adminBanError && <div className="form-error">{adminBanError}</div>}

            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => {
                  setAdminBanError("");
                  setConfirmAdmin(null);
                }}
              >
                Cancel
              </button>

              <button
                className={
                  confirmAdmin.status === "Active"
                    ? "btn-danger"
                    : "btn-success"
                }
                onClick={() =>
                  confirmToggleStatus(
                    confirmAdmin.status == "Active" ? "ban" : "unban",
                  )
                }
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
