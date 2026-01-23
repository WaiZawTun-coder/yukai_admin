"use client";
import React, { useState } from "react";

const ReportedTable = () => {
  const [reports, setReports] = useState([
    { id: "REP-882", content: "Look at how ugly @user is in this photo, everyone needs to see this fail.", reason: "Bullying", reporter: "@aungthuhein99", status: "No Action" },
    { id: "REP-879", content: "I made $3000 today working from home, ask me how! Just visit our site.", reason: "Financial Scam", reporter: "@aungthuhein99", status: "No Action" },
    { id: "REP-875", content: "This is my artwork, you just put a filter on it and claimed it was yours.", reason: "Copyright", reporter: "@aungthuhein99", status: "Resolved" },
    { id: "REP-870", content: "The election was hacked by aliens, I have the proof right here.", reason: "False Information", reporter: "@aungthuhein99", status: "No Action" },
    { id: "REP-864", content: "Drinking [Household Chemical] will actually cure the virus instantly.", reason: "Misinformation", reporter: "@aungthuhein99", status: "Resolved" },
  ]);

  const [confirmReport, setConfirmReport] = useState(null);
  const [viewComment, setViewComment] = useState(null);

  const confirmResolveStatus = () => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === confirmReport.id ? { ...report, status: "Resolved" } : report
      )
    );
    setConfirmReport(null);
  };

  const truncateText = (text, limit = 20) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Reported Comment Table</h2>
      </div>

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
              <td><div className="uid">{report.id}</div></td>
              <td>
                <div className="narrow-content-box">
                  <span className="report-preview" title={report.content}>
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

      {viewComment && (
        <div className="modal-overlay">
          <div className="modal comment-modal">
            <h3>Full Reported Content</h3>
            <div className="full-comment-box">
              <p>"{viewComment.content}"</p>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setViewComment(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

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