"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useApi } from "../../utilities/api";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiFetch = useApi();

  useEffect(() => {
    apiFetch("/api/admin/dashboard")
      .then((result) => {
        if (result.status) {
          setData(result.data);
        }
      })
      .finally(() => setLoading(false));
  }, [apiFetch]);

  if (loading) return <p>Loading dashboard...</p>;
  if (!data) return <p>Failed to load dashboard</p>;

  return (
    <div className="dashboard-page">
      {/* TOP CARDS */}
      <div className="dashboard-cards">
        <Card title="Total Users" value={data.cards.totalUsers} />
        <Card title="Daily Users" value={data.cards.dailyUsers} />
        <Card title="Average Users" value={data.cards.averageUsers} />
        <Card title="Total Posts" value={data.cards.totalPosts} />
        <Card title="Total Reports" value={data.cards.totalReports} />
        <Card title="Pending Reports" value={data.cards.pendingReports} />
      </div>

      {/* CHARTS */}
      <div className="charts">
        <ChartBox
          title="User Growth"
          type="line"
          categories={data.userGrowth.map((i) => i.date)}
          values={data.userGrowth.map((i) => Number(i.count))}
        />

        <ChartBox
          title="Posts Created"
          type="bar"
          categories={data.postsCreated.map((i) => i.date)}
          values={data.postsCreated.map((i) => Number(i.count))}
        />

        <ChartBox
          title="Images Uploaded"
          type="area"
          categories={data.imagesUploaded.map((i) => i.date)}
          values={data.imagesUploaded.map((i) => Number(i.count))}
        />

        <ChartBox
          title="Reports Trend"
          type="area"
          categories={data.reportsTrend.map((i) => i.date)}
          values={data.reportsTrend.map((i) => Number(i.count))}
        />

        <PieChartBox
          title="Reaction Distribution"
          labels={data.reactionDistribution.map((i) => i.reaction)}
          values={data.reactionDistribution.map((i) => Number(i.percentage))}
        />
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Card({ title, value }) {
  return (
    <div className="dashboard-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function ChartBox({ title, type, categories = [], values = [] }) {
  const options = {
    chart: { toolbar: { show: false } },
    stroke: { curve: "smooth" },
    theme: { mode: "dark" },
    xaxis: { categories },
  };

  const series = [
    {
      name: title,
      data: values,
    },
  ];

  return (
    <div className="chart-box">
      <h4>{title}</h4>
      <Chart type={type} options={options} series={series} height={250} />
    </div>
  );
}

function PieChartBox({ title, labels = [], values = [] }) {
  const options = {
    labels,
    theme: { mode: "dark" },
    legend: { position: "bottom" },
  };

  return (
    <div className="chart-box">
      <h4>{title}</h4>
      <Chart type="pie" options={options} series={values} height={250} />
    </div>
  );
}
