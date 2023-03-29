import React from "react";
import { PieChart, Pie, Legend, ResponsiveContainer, Cell } from "recharts";

const ClosedClaimsPieChart = ({ closedClaims }) => {
  const statusArray = [];
  closedClaims.forEach((claim) => {
    const status = claim.status;
    const foundElement = statusArray.find((x) => x.status === status);
    if (foundElement) {
      foundElement.statusCount++;
    } else {
      const c = { status: status, statusCount: 1 };
      statusArray.push(c);
    }
  });

  const COLORS = ["#E49D22", "#008FB0", "#008A5C"];

  const RADIAN = Math.PI / 180;

  /*https://recharts.org/en-US/examples/PieChartWithCustomizedLabel*/

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <ResponsiveContainer className="dashboard-grid-cell">
      <PieChart>
        <Legend layout="vertical" verticalAlign="top" align="right" />
        <Pie
          data={statusArray}
          dataKey="statusCount"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius="100%"
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {statusArray.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ClosedClaimsPieChart;
