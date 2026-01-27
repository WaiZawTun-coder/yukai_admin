"use client";
import React, { useState } from "react";
import ReportsNav from "../ReportsNav";

const ReportedTable = () => {
  const [reports, setReports] = useState([
    {
      id: "REP-882",
      content:
        "Look at how ugly @user is in this photo, everyone needs to see this fail.",
      reason: "Bullying",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
    {
      id: "REP-879",
      content:
        "I made $3000 today working from home, ask me how! Just visit our site.",
      reason: "Financial Scam",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
    {
      id: "REP-875",
      content:
        "This is my artwork, you just put a filter on it and claimed it was yours.",
      reason: "Copyright",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
    {
      id: "REP-876",
      content:
        "The election was hacked by aliens, I have the proof right here.",
      reason: "False Information",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
    {
      id: "REP-867",
      content:
        "Drinking household chemicals will cure the virus instantly.",
      reason: "Misinformation",
      reporter: "@aungthuhein99",
      status: "Pending",
      actionStage: "pending",
    },
  ]);

  const [viewComment, setViewComment] = useState(null);

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

  const truncateText = (text, limit = 30) =>
    text.length > limit ? text.slice(0, limit) + "..." : text;

  return (
    <div className="table-main-area">
      <div className="table-container">
        <ReportsNav />

        <table className="user-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Reported Comment</th>
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
                  <div className="narrow-content-box">
                    <span className="report-preview">
                      "{truncateText(report.content)}"
                    </span>
                    <button
                      className="btn-see-more-link"
                      onClick={() => setViewComment(report)}
                    >
                      See more
                    </button>
                  </div>
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

      {/* VIEW COMMENT MODAL */}
      {viewComment && (
        <div className="modal-overlay">
          <div className="modal comment-modal">
            <h3>Reported Content</h3>
            <div className="full-comment-box">
              <p>"{viewComment.content}"</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setViewComment(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM ACTION MODAL */}
      {confirmAction.label && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to{" "}
              <strong>{confirmAction.label}</strong> this comment?
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
