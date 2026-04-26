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

  // 🔥 Responsive sizing based on viewport
  const getChartDimensions = () => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;
    const isMobile = width < 768;
    const isTablet = width < 1024;
    
    return {
      height: isMobile ? 400 : isTablet ? 350 : 300,
      chartMargin: isMobile ? { top: 10, right: 10, left: -20, bottom: 10 } : { top: 10, right: 10, left: 0, bottom: 10 },
      axisLabelFontSize: isMobile ? 12 : 14,
      pieRadius: isMobile ? 70 : 100,
      containerPadding: isMobile ? "0 -8px" : "0"
    };
  };

  const dimensions = getChartDimensions();

  // 🔥 BAR CHART
  if (chart.type === "bar") {
    return (
      <div style={{
        width: "100%",
        height: dimensions.height,
        padding: dimensions.containerPadding,
        margin: "8px 0"
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={dimensions.chartMargin}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: dimensions.axisLabelFontSize }}
              angle={dimensions.axisLabelFontSize === 12 ? -45 : 0}
              textAnchor={dimensions.axisLabelFontSize === 12 ? "end" : "middle"}
              height={dimensions.axisLabelFontSize === 12 ? 80 : 60}
            />
            <YAxis tick={{ fontSize: dimensions.axisLabelFontSize }} />
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
      <div style={{
        width: "100%",
        height: dimensions.height,
        padding: dimensions.containerPadding,
        margin: "8px 0"
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={dimensions.chartMargin}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: dimensions.axisLabelFontSize }}
              angle={dimensions.axisLabelFontSize === 12 ? -45 : 0}
              textAnchor={dimensions.axisLabelFontSize === 12 ? "end" : "middle"}
              height={dimensions.axisLabelFontSize === 12 ? 80 : 60}
            />
            <YAxis tick={{ fontSize: dimensions.axisLabelFontSize }} />
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
      <div style={{
        width: "100%",
        height: dimensions.height,
        padding: dimensions.containerPadding,
        margin: "8px 0"
      }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={dimensions.pieRadius}
                label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={dimensions.pieRadius === 70 ? false : true}
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
            <Legend wrapperStyle={{ paddingTop: "10px", fontSize: dimensions.axisLabelFontSize }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // 🔥 FALLBACK
  return null;
};

export default ChartComponent;