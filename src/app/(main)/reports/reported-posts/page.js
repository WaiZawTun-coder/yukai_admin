"use client";
import React, { useState } from "react";

const ReportedTable = () => {
  const [reports, setReports] = useState([
    { id: "REP-882", postUrl: "#", reason: "Harassment", reporter: "@aungthuhein99", status: "No Action" },
    { id: "REP-879", postUrl: "#", reason: "Spam / Bot", reporter: "@aungthuhein99", status: "No Action" },
    { id: "REP-875", postUrl: "#", reason: "Copyright", reporter: "@aungthuhein99", status: "Resolved" },
    { id: "REP-870", postUrl: "#", reason: "Hate Speech", reporter: "@aungthuhein99", status: "No Action" },
    { id: "REP-864", postUrl: "#", reason: "Misinformation", reporter: "@aungthuhein99", status: "Resolved" },
  ]);

  const [confirmReport, setConfirmReport] = useState(null);

  const confirmResolveStatus = () => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === confirmReport.id ? { ...report, status: "Resolved" } : report
      )
    );
    setConfirmReport(null);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Reported Post Table</h2>
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
              <td><div className="uid">{report.id}</div></td>
              <td>
                <div className="post-link-container">
                  <a 
                    href={report.postUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="view-post-link"
                  >
                    View Post
                  </a>
                </div>
              </td>
              <td><div className="display-name">{report.reason}</div></td>
              <td><div className="reporter-name">{report.reporter}</div></td>
              <td>
                <span className={`status-label ${report.status.replace(/\s+/g, '-').toLowerCase()}`}>
                  <span className="status-dot"></span>
                  {report.status}
                </span>
              </td>
              <td>
                <div className="action-gap">
                  {report.status !== "Resolved" ? (
                    <>
                      <button className="btn-unban" onClick={() => setConfirmReport({ ...report, actionType: "Un Ban" })}>Un Ban</button>
                      <button className="btn-ban" onClick={() => setConfirmReport({ ...report, actionType: "Ban" })}>Ban</button>
                    </>
                  ) : (
                    <span className="resolved-text">Action Completed!</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmReport && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Moderation</h3>
            <p>Are you sure you want to <strong>{confirmReport.actionType}</strong> for report <strong>{confirmReport.id}</strong>?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmReport(null)}>Cancel</button>
              <button className="btn-success" onClick={confirmResolveStatus}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportedTable;