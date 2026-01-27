"use client";
import React, { useState } from "react";
import ReportsNav from "../ReportsNav";


const ReportedTable = () => {
  const [reports, setReports] = useState([
    {
      id: "REP-882",
      profileUrl: "/profile/aungthuhein99",
      reason: "Harassment",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
    {
      id: "REP-879",
      profileUrl: "/profile/aungthuhein99",
      reason: "Spam / Bot",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
    {
      id: "REP-875",
      profileUrl: "/profile/aungthuhein99",
      reason: "Copyright",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
    {
      id: "REP-870",
      profileUrl: "/profile/aungthuhein99",
      reason: "Hate Speech",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
    {
      id: "REP-864",
      profileUrl: "/profile/aungthuhein99",
      reason: "Misinformation",
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
    setConfirmAction({
      reportId: null,
      nextStage: null,
      label: "",
    });
  };

  return (
    <div className="table-main-area">
      <div className="table-container">
        <ReportsNav />

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
              <tr key={report.id}>
                <td>
                  <div className="uid">{report.id}</div>
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
              <strong>{confirmAction.label}</strong> this account?
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
                        : r
                    )
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
    </div>
  );
};

export default ReportedTable;
