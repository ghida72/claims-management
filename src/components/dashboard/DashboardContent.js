import React, { useEffect, useState, useCallback } from "react";
import useLoader from "../../hooks/useLoader";
import httpClient from "../../services/httpClient";
import lookupStore from "../../services/lookupStore";
import calculateNet from "../../helpers/calculateNet";
import {
  BarChart,
  PieChart,
  Pie,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/*In a real world case, the data relevant to constructing charts is better handled and processed by the back-end server, and then fetched to the UI. Since we're using a dummy back-end here, the claims data will be fetched and processed on the front-end in order to contruct the charts  */

const DashboardContent = ({ claims }) => {
  /*Number of open claims*/
  const openClaimsCount = claims.filter(
    (claim) => claim.status === "pending"
  ).length;

  /*Bar Chart Data */
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

  /* Pie Chart Data */
  const statusArray = [];
  claims
    .filter((claim) => claim.status !== "pending")
    .forEach((claim) => {
      const status = claim.status;
      const foundElement = statusArray.find((x) => x.status === status);
      if (foundElement) {
        foundElement.statusCount++;
      } else {
        const c = { status: status, statusCount: 1 };
        statusArray.push(c);
      }
    });
  // let renderLabel = statusArray.forEach((entry) => entry.status);
  let renderLabel = function (entry) {
    return entry.status;
  };

  /* Double Bar Graph Data */
  const amountsArray = [];
  claims
    .filter((claim) => claim.status !== "pending")
    .forEach((claim) => {
      const year = claim.dateSubmitted.getFullYear();
      const convertedApprovedAmount =
        claim.approvedAmount * claim.currency.conversion;
      const convertedRejectedAmount =
        (claim.claimedAmount - claim.approvedAmount) *
        claim.currency.conversion;

      const foundElement = amountsArray.find((x) => x.year === year);
      if (foundElement) {
        foundElement.approvedAmount =
          foundElement.approvedAmount + convertedApprovedAmount;
        foundElement.rejectedAmount =
          foundElement.rejectedAmount + convertedRejectedAmount;
      } else {
        const rejectedAmount = claim.claimedAmount - claim.approvedAmount;
        const c = {
          year: year,
          approvedAmount: convertedApprovedAmount,
          rejectedAmount: convertedRejectedAmount,
        };
        amountsArray.push(c);
      }
    });

  /*Total Paid Amount (across all years)*/
  const totalPaid = amountsArray
    .map((item) => item.approvedAmount)
    .reduce((prev, current) => prev + current);

  /*Total Rejected Amount (across all years)*/
  const totalRejected = amountsArray
    .map((item) => item.rejectedAmount)
    .reduce((prev, current) => prev + current);

  return (
    <div>
      <h1>{openClaimsCount}</h1>
      <h2>{totalPaid}</h2>
      <h3>{totalRejected}</h3>
      <BarChart width={730} height={250} data={dateSubmittedArray}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="claimsCount" fill="#82ca9d" />
      </BarChart>
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
      <BarChart width={730} height={250} data={amountsArray}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="approvedAmount" fill="#8884d8" />
        <Bar dataKey="rejectedAmount" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default DashboardContent;
