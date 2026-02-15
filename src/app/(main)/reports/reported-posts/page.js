"use client";
import React, { useCallback, useEffect, useState } from "react";
import ReportsNav from "../ReportsNav";
import { useApi } from "../../../../utilities/api";

const ReportedTable = () => {
  const apiFetch = useApi();
  const [reports, setReports] = useState([]);
  const [isFetchingReports, setIsFetchingReports] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [confirmAction, setConfirmAction] = useState({
    reportId: null,
    nextStage: null,
    label: "",
  });

  const resetConfirm = () => {
    setConfirmAction({ reportId: null, nextStage: null, label: "" });
  };

  const fetchReports = useCallback(
    async (page = 1) => {
      try {
        setIsFetchingReports(true);

        const res = await apiFetch(
          `/api/get-reported-posts?page=${page}&limit=5`,
        );

        if (!res?.status) return;

        const formatted = res.data.map((r) => ({
          id: r.id,
          postUrl: `https://yukai-social.vercel.app/post?post_id=${r.post_id}`,
          reason: r.type,
          reporter: `User #${r.reporter_user_id}`,
          status: r.status,
          actionStage: r.status,
        }));

        setReports(formatted);
        setCurrentPage(res.current_page || page);
        setTotalPages(res.total_pages || 1);
      } catch (err) {
        console.error("Failed to fetch reports: ", err);
      } finally {
        setIsFetchingReports(false);
      }
    },
    [apiFetch],
  );

  useEffect(() => {
    fetchReports(currentPage);
  }, [fetchReports, currentPage]);

  const applyAction = async () => {
    try {
      const res = await apiFetch("/api/update-post-report-status", {
        method: "POST",
        body: {
          report_id: confirmAction.reportId,
          status: confirmAction.nextStage,
        },
      });

      if (!res?.status) return;

      // optimistic UI update
      setReports((prev) =>
        prev.map((r) =>
          r.id === confirmAction.reportId
            ? {
                ...r,
                status: confirmAction.nextStage,
                actionStage: confirmAction.nextStage,
              }
            : r,
        ),
      );

      resetConfirm();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="table-main-area">
      <div className="table-container">
        <ReportsNav />

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
            {isFetchingReports && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Loading reports...
                </td>
              </tr>
            )}
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
                  <span className={`status-label ${report.status}`}>
                    <span className="status-dot" />
                    {report.status.charAt(0).toUpperCase() +
                      report.status.slice(1)}
                  </span>
                </td>

                <td>
                  <div className="action-gap">
                    {report.actionStage === "pending" && (
                      <>
                        <button
                          className="btn-review"
                          onClick={() =>
                            setConfirmAction({
                              reportId: report.id,
                              nextStage: "reviewed",
                              label: "Review",
                            })
                          }
                        >
                          Review
                        </button>

                        <button
                          className="btn-danger"
                          onClick={() =>
                            setConfirmAction({
                              reportId: report.id,
                              nextStage: "removed",
                              label: "Remove",
                            })
                          }
                        >
                          Remove
                        </button>
                      </>
                    )}

                    {report.actionStage === "reviewed" && (
                      <button
                        className="btn-danger"
                        onClick={() =>
                          setConfirmAction({
                            reportId: report.id,
                            nextStage: "removed",
                            label: "Remove",
                          })
                        }
                      >
                        Remove
                      </button>
                    )}

                    {report.actionStage === "removed" && (
                      <button
                        className="btn-success"
                        onClick={() =>
                          setConfirmAction({
                            reportId: report.id,
                            nextStage: "reviewed",
                            label: "Restore",
                          })
                        }
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button
            disabled={currentPage === 1 || isFetchingReports}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages || isFetchingReports}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirmAction.label && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to <strong>{confirmAction.label}</strong>{" "}
              this post?
            </p>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={resetConfirm}>
                Cancel
              </button>
              <button
                className={
                  confirmAction.label === "Ban" ? "btn-danger" : "btn-success"
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
