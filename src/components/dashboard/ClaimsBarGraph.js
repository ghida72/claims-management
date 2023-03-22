import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const ClaimsBarGraph = ({ claims }) => {
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
    <BarChart width={730} height={250} data={dateSubmittedArray}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="claimsCount" fill="#82ca9d" />
    </BarChart>
  );
};

export default ClaimsBarGraph;
