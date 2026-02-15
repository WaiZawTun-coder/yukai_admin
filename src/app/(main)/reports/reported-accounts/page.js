"use client";
import { useApi } from "@/utilities/api";
import { useEffect, useState } from "react";
import ReportsNav from "../ReportsNav";

const statusActions = {
  pending: [
    { label: "Ignore", nextStage: "reviewed", endpoint: null },
    { label: "Ban", nextStage: "banned", endpoint: "/api/ban-user" },
    { label: "Warn", nextStage: "warned", endpoint: "/api/warn-user" },
    { label: "Suspend", nextStage: "suspended", endpoint: "/api/suspend-user" },
  ],
  reviewed: [
    { label: "Ban", nextStage: "banned", endpoint: "/api/ban-user" },
    { label: "Warn", nextStage: "warned", endpoint: "/api/warn-user" },
    { label: "Suspend", nextStage: "suspended", endpoint: "/api/suspend-user" },
  ],
  banned: [
    { label: "Unban", nextStage: "reviewed", endpoint: "/api/unban-user" },
  ],
  warned: [
    {
      label: "Remove Warn",
      nextStage: "reviewed",
      endpoint: "/api/remove-warn-user",
    },
    { label: "Ban", nextStage: "banned", endpoint: "/api/ban-user" },
    { label: "Suspend", nextStage: "suspended", endpoint: "/api/suspend-user" },
  ],
  suspended: [
    {
      label: "Unsuspend",
      nextStage: "reviewed",
      endpoint: "/api/unsuspend-user",
    },
    { label: "Ban", nextStage: "banned", endpoint: "/api/ban-user" },
  ],
};

const ReportedTable = () => {
  const apiFetch = useApi();
  const [reports, setReports] = useState([]);
  const [reportTypePopup, setReportTypePopup] = useState({
    isOpen: false,
    reportId: null,
  });

  const [confirmAction, setConfirmAction] = useState({
    reportId: null,
    nextStage: null,
    label: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await apiFetch("/api/get-reported-accounts");

        if (!res.status) {
          alert(res.message || "Failed to fetch reports");
          return;
        }
        const enrichedReports = res.data.map((r) => ({
          ...r,
          profileUrl: `https://yukai-social.vercel.app/${r.username}`,
          reporter: `@user${r.reporter_user_id}`,
          reason: r.type, // or r.description
          actionStage: "pending",
          status: r.is_active == 0 ? "Banned" : r.status,
        }));

        console.log("Fetched reports: ", { enrichedReports });
        setReports(enrichedReports);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [apiFetch]);

  const handleStatusAction = async ({ reportId, nextStage, endpoint }) => {
    try {
      if (endpoint) {
        const res = await apiFetch(endpoint, {
          method: "POST",
          body: {
            report_id: reportId,
            user_id: reports.find((r) => r.report_id === reportId)
              ?.reported_user_id,
          },
        });

        if (!res.status) {
          alert(res.message || "Action failed");
          return;
        }
      }

      await apiFetch(`/api/update-account-report-status`, {
        method: "POST",
        body: {
          report_id: reportId,
          status: nextStage,
        },
      });

      // Update local state
      setReports((prev) =>
        prev.map((r) =>
          r.report_id === reportId
            ? {
                ...r,
                status: nextStage.charAt(0).toUpperCase() + nextStage.slice(1),
                actionStage: nextStage,
              }
            : r,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const resetConfirm = () => {
    setConfirmAction({
      reportId: null,
      nextStage: null,
      label: "",
    });
  };

  const handleReportTypeSubmit = async ({ reportId, type }) => {
    try {
      const res = await apiFetch(`/api/admin/report-action`, {
        method: "POST",
        body: { report_id: reportId, action: "banned", reason: type },
      });

      if (!res.status) {
        alert(res.message || "Failed to submit report type");
        return;
      }

      setReports((prev) =>
        prev.map((r) =>
          r.report_id === reportId
            ? {
                ...r,
                actionStage: "banned",
                status: "Banned",
                reason: type,
              }
            : r,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="table-main-area">
      <div className="table-container">
        <ReportsNav />

        {loading ? (
          <div className="loading">Loading reports...</div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Reported Account</th>
                <th>Reason</th>
                <th>Reporter</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.report_id}>
                  <td>
                    <div className="uid">{report.report_id}</div>
                  </td>

                  <td>
                    <a
                      href={report.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-profile-link"
                    >
                      View Profile
                    </a>
                  </td>

                  <td>
                    <div className="display-name">{report.reason}</div>
                  </td>

                  <td>
                    <div className="username">{report.reporter}</div>
                  </td>

                  <td>
                    <span
                      className={`status-label ${report.status.toLowerCase()}`}
                    >
                      <span className="status-dot"></span>
                      {report.status}
                    </span>
                  </td>

                  <td>
                    <div className="action-gap">
                      {(statusActions[report.status.toLowerCase()] || []).map(
                        (action) => (
                          <button
                            key={action.label}
                            className={`btn-${action.label.replace(" ", "-").toLowerCase()}`}
                            onClick={() => {
                              if (action.label === "Ban") {
                                // Show report type popup
                                setReportTypePopup({
                                  isOpen: true,
                                  reportId: report.report_id,
                                });
                              } else {
                                handleStatusAction({
                                  reportId: report.report_id,
                                  nextStage: action.nextStage,
                                  endpoint: action.endpoint,
                                });
                              }
                            }}
                          >
                            {action.label}
                          </button>
                        ),
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CONFIRM MODAL */}
      {confirmAction.label && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to <strong>{confirmAction.label}</strong>{" "}
              this account?
            </p>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={resetConfirm}>
                Cancel
              </button>

              <button
                className={
                  confirmAction.label === "Ban" ? "btn-danger" : "btn-success"
                }
                onClick={() => {
                  setReports((prev) =>
                    prev.map((r) =>
                      r.id === confirmAction.reportId
                        ? {
                            ...r,
                            actionStage: confirmAction.nextStage,
                            status:
                              confirmAction.nextStage.charAt(0).toUpperCase() +
                              confirmAction.nextStage.slice(1),
                          }
                        : r,
                    ),
                  );
                  resetConfirm();
                }}
              >
                Yes, {confirmAction.label}
              </button>
            </div>
          </div>
        </div>
      )}

      {reportTypePopup.isOpen && (
        <ReportTypePopup
          reportId={reportTypePopup.reportId}
          onClose={() => setReportTypePopup({ isOpen: false, reportId: null })}
          onSubmit={async ({ reportId, type }) => {
            try {
              const res = await apiFetch("/api/ban-user", {
                method: "POST",
                body: {
                  report_id: reportId,
                  reason: type,
                  user_id: reports.find((r) => r.report_id === reportId)
                    ?.reported_user_id,
                },
              });

              if (!res.status) {
                // alert(res.message || "Failed to ban user");
                console.error(res.message || "Failed to ban user");
                return;
              }

              setReports((prev) =>
                prev.map((r) =>
                  r.report_id === reportId
                    ? {
                        ...r,
                        status: "Banned",
                        actionStage: "banned",
                        reason: type,
                      }
                    : r,
                ),
              );
            } catch (err) {
              console.error(err);
            }
            setReportTypePopup({ isOpen: false, reportId: null });
          }}
        />
      )}
    </div>
  );
};

export default ReportedTable;

const ReportTypePopup = ({ onClose, onSubmit, reportId }) => {
  const [selectedType, setSelectedType] = useState("");

  const reportTypes = [
    { value: "spam", label: "Spam / Bot" },
    { value: "harassment", label: "Harassment" },
    { value: "copyright", label: "Copyright" },
    { value: "hate_speech", label: "Hate Speech" },
    { value: "misinformation", label: "Misinformation" },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Select Report Type</h3>
        <div className="report-options">
          {reportTypes.map((type) => (
            <label key={type.value} className="report-option">
              <input
                type="radio"
                name="reportType"
                value={type.value}
                checked={selectedType === type.value}
                onChange={(e) => setSelectedType(e.target.value)}
              />
              {type.label}
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-confirm"
            disabled={!selectedType}
            onClick={() => {
              onSubmit({ reportId, type: selectedType });
              onClose();
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
