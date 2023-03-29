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
  Label,
} from "recharts";
import amountsCalculator from "../../helpers/amountsCalculator";
import classes from "./ClaimAmountsChart.module.css";

const ClaimAmountsChart = ({ closedClaims }) => {
  const amountsArray = amountsCalculator(closedClaims);
  return (
    <ResponsiveContainer
      className={`dashboard-grid-cell ${classes.claimAmountsChart}`}
      aspect={2}
    >
      <BarChart
        data={amountsArray.sort((a, b) => a.year - b.year)}
        barGap="0"
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
          formatter={(value, name, props) => {
            let formattedName = "Approved Amount";
            if (props.dataKey === "rejectedAmount") {
              formattedName = "Rejected Amount";
            }
            return [`$ ${value.toFixed(2)}`, formattedName];
          }}
        />
        <Legend
          payload={[
            { value: "Approved Amount", type: "rect", color: "#008FB0" },
            { value: "Rejected Amount", type: "rect", color: "#E49D22" },
          ]}
        />
        <Bar dataKey="approvedAmount" fill="#008FB0" />
        <Bar dataKey="rejectedAmount" fill="#E49D22" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ClaimAmountsChart;
