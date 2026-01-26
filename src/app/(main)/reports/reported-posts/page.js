"use client";
import React, { useState } from "react";

const ReportedTable = () => {
  const [reports, setReports] = useState([
    {
      id: "REP-882",
      postUrl: "#",
      reason: "Harassment",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
    {
      id: "REP-879",
      postUrl: "#",
      reason: "Spam / Bot",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
    {
      id: "REP-875",
      postUrl: "#",
      reason: "Copyright",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
  ]);

  const [confirmAction, setConfirmAction] = useState({
    reportId: null,
    nextStage: null,
    label: "",
  });

  const resetConfirm = () => {
    setConfirmAction({ reportId: null, nextStage: null, label: "" });
  };

  const applyAction = () => {
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
          : r
      )
    );
    resetConfirm();
  };

  return (
    <div className="table-main-area">
      <div className="table-container">
        <div className="table-header">
          <h2>Reported Post Overview</h2>
        </div>

        <table className="user-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Reported Post</th>
              <th>Reason</th>
              <th>Reporter</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="uid">{report.id}</td>

                <td>
                  <a
                    href={report.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-post-link"
                  >
                    View Post
                  </a>
                </td>

                <td>
                  <div className="display-name">{report.reason}</div>
                </td>

                <td>
                  <div className="username">{report.reporter}</div>
                </td>

                <td>
                  <span className={`status-label ${report.status.toLowerCase()}`}>
                    <span className="status-dot" />
                    {report.status}
                  </span>
                </td>

                <td>
                  <div className="action-gap">
                    {/* Pending → Ignore / Ban */}
                    {report.actionStage === "pending" && (
                      <>
                        <button
                          className="btn-ignore"
                          onClick={() =>
                            setConfirmAction({
                              reportId: report.id,
                              nextStage: "ignored",
                              label: "Ignore",
                            })
                          }
                        >
                          Ignore
                        </button>

                        <button
                          className="btn-ban"
                          onClick={() =>
                            setConfirmAction({
                              reportId: report.id,
                              nextStage: "banned",
                              label: "Ban",
                            })
                          }
                        >
                          Ban
                        </button>
                      </>
                    )}

                    {/* Ignored → Ban */}
                    {report.actionStage === "ignored" && (
                      <button
                        className="btn-ban"
                        onClick={() =>
                          setConfirmAction({
                            reportId: report.id,
                            nextStage: "banned",
                            label: "Ban",
                          })
                        }
                      >
                        Ban
                      </button>
                    )}

                    {/* Banned → Unban */}
                    {report.actionStage === "banned" && (
                      <button
                        className="btn-unban"
                        onClick={() =>
                          setConfirmAction({
                            reportId: report.id,
                            nextStage: "unbanned",
                            label: "Un Ban",
                          })
                        }
                      >
                        Un Ban
                      </button>
                    )}

                    {/* Unbanned → Ban */}
                    {report.actionStage === "unbanned" && (
                      <button
                        className="btn-ban"
                        onClick={() =>
                          setConfirmAction({
                            reportId: report.id,
                            nextStage: "banned",
                            label: "Ban",
                          })
                        }
                      >
                        Ban
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONFIRM MODAL */}
      {confirmAction.label && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to{" "}
              <strong>{confirmAction.label}</strong> this post?
            </p>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={resetConfirm}>
                Cancel
              </button>
              <button
                className={
                  confirmAction.label === "Ban"
                    ? "btn-danger"
                    : "btn-success"
                }
                onClick={applyAction}
              >
                Yes, {confirmAction.label}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedTable;
