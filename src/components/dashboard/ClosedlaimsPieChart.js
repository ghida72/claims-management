import React from "react";
import { PieChart, Pie } from "recharts";

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
  let renderLabel = function (entry) {
    return entry.status;
  };
  return (
    <PieChart width={730} height={250}>
      <Pie
        data={statusArray}
        dataKey="statusCount"
        nameKey="status"
        cx="50%"
        cy="50%"
        outerRadius={50}
        fill="#8884d8"
        label={renderLabel}
      />
    </PieChart>
  );
};

export default ClosedClaimsPieChart;
