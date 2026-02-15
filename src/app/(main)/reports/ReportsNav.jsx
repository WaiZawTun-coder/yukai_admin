"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";

const ReportNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { label: "Accounts", path: "/reports/reported-accounts" },
    { label: "Posts", path: "/reports/reported-posts" },
    // { label: "Comments", path: "/reports/reported-comments" },
  ];

  return (
    <div className="report-header">
      <h2 className="report-title ">Report Overview</h2>

      <div className="report-nav">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            className={`report-tab ${pathname === tab.path ? "active" : ""}`}
            onClick={() => router.push(tab.path)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportNav;
