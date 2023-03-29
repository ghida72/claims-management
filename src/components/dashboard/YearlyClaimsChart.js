import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import classes from "./YearlyClaimsChart.module.css";

const YearlyClaimsChart = ({ claims }) => {
  const dateSubmittedArray = [];
  claims.forEach((claim) => {
    const year = claim.dateSubmitted.getFullYear();

    const foundElement = dateSubmittedArray.find((x) => x.year === year);
    if (foundElement) {
      foundElement.claimsCount++;
    } else {
      const c = { year: year, claimsCount: 1 };
      dateSubmittedArray.push(c);
    }
  });

  return (
    <ResponsiveContainer
      className={`dashboard-grid-cell ${classes.yearlyClaimsChart}`}
      aspect={2}
    >
      <BarChart
        data={dateSubmittedArray.sort((a, b) => a.year - b.year)}
        barCategoryGap="22.5%"
        margin={{
          top: 40,
          left: 5,
          bottom: 40,
          right: 40,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip
          formatter={(value, name, props) => [value, "Number of Claims"]}
        />
        <Legend
          payload={[
            { value: "Number of Claims", type: "rect", color: "#008A5C" },
          ]}
        />

        <Bar dataKey="claimsCount" fill="#008A5C" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default YearlyClaimsChart;
