"use client";

import dynamic from "next/dynamic";


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      {/* TOP CARDS */}
      <div className="dashboard-cards">
        <Card title="Total Users" value="1,250" />
        <Card title="Daily Users" value="820" />
        <Card title="Average Users" value="450" />
      </div>

      {/* CHARTS */}
      <div className="charts">
        <ChartBox title="Bar Chart" type="bar" />
        <ChartBox title="Area Chart" type="area" />
        <ChartBox title="Line Chart" type="line" />
        <PieChartBox title="Pie Chart" />
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

function ChartBox({ title, type }) {
  const options = {
    chart: { toolbar: { show: false } },
    stroke: { curve: "smooth" },
    theme: { mode: "dark" },
    xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  };

  const series = [
    {
      name: "Data",
      data: [10, 30, 20, 40, 35],
    },
  ];

  return (
    <div className="chart-box">
      <h4>{title}</h4>
      <Chart type={type} options={options} series={series} height={250} />
    </div>
  );
}

function PieChartBox({ title }) {
  const options = {
    labels: ["Facebook", "Google", "Direct", "Email"],
    theme: { mode: "dark" },
    legend: { position: "bottom" },
  };

  const series = [44, 30, 16, 10];

  return (
    <div className="chart-box">
      <h4>{title}</h4>
      <Chart type="pie" options={options} series={series} height={250} />
    </div>
  );
}
