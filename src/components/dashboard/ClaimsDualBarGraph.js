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
import amountsCalculator from "../../helpers/amountsCalculator";

const ClaimsDualBarGraph = ({ closedClaims }) => {
  const amountsArray = amountsCalculator(closedClaims);
  return (
    <BarChart width={730} height={250} data={amountsArray}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="approvedAmount" fill="#8884d8" />
      <Bar dataKey="rejectedAmount" fill="#82ca9d" />
    </BarChart>
  );
};

export default ClaimsDualBarGraph;
