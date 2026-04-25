import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = ["#1976d2", "#ef5350", "#66bb6a", "#ffa726", "#ab47bc"];

const ChartComponent = ({ chart }) => {
  if (!chart || !chart.labels || !chart.values) return null;

  // Ensure arrays have matching lengths
  const minLength = Math.min(chart.labels.length, chart.values.length);

  // 🔥 Convert to recharts format with null safety
  const data = chart.labels
    .slice(0, minLength) // Only process matching pairs
    .map((label, i) => {
      const val = chart.values[i];

      // Skip null/undefined values
      if (val === null || val === undefined) return null;

      return {
        name: label,
        value: typeof val === "object" && val !== null ? val.value : val,
        percentage: typeof val === "object" && val !== null ? val.percentage : null
      };
    })
    .filter(item => item !== null); // Remove null entries

  // If no valid data, don't render
  if (data.length === 0) return null;

  // 🔥 BAR CHART
  if (chart.type === "bar") {
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 🔥 LINE CHART
  if (chart.type === "line") {
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 🔥 PIE CHART
  if (chart.type === "pie") {
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(1)}%`
                }
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
                formatter={(value, name, props) => {
                    const p = props.payload.percentage;
                    return p
                    ? [`${value} (${p}%)`, name]
                    : [value, name];
                }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 🔥 FALLBACK
  return null;
};

export default ChartComponent;