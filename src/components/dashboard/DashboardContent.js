import React, { useEffect, useState, useCallback } from "react";
import useLoader from "../../hooks/useLoader";
import httpClient from "../../services/httpClient";
import lookupStore from "../../services/lookupStore";
import calculateNet from "../../helpers/calculateNet";
import YearlyClaimsChart from "./YearlyClaimsChart";
import ClosedClaimsPieChart from "./ClosedClaimsPieChart";
import ClaimAmountsChart from "./ClaimAmountsChart";
import DashboardCard from "./DashboardCard";
import amountsCalculator from "../../helpers/amountsCalculator";

/*In a real world case, the data relevant to constructing charts is better handled and processed by the back-end server, 
and then fetched to the UI. Since we're using a dummy back-end here, the claims data will be fetched 
and processed on the front-end in order to contruct the charts  */

const DashboardContent = ({ claims }) => {
  const closedClaims = claims.filter((claim) => claim.status !== "pending");
  /*Number of open claims*/
  const openClaimsCount = claims.filter(
    (claim) => claim.status === "pending"
  ).length;

  const amountsArray = amountsCalculator(closedClaims);

  /*Total Paid Amount (across all years)*/
  const totalPaid = amountsArray
    .map((item) => item.approvedAmount)
    .reduce((prev, current) => prev + current);

  /*Total Rejected Amount (across all years)*/
  const totalRejected = amountsArray
    .map((item) => item.rejectedAmount)
    .reduce((prev, current) => prev + current);

  const infoArray = [
    {
      title: "Pending Claims",
      value: parseInt(openClaimsCount),
      note: "as of today",
    },
    {
      title: "Total Paid",
      value: totalPaid.toFixed(2),
      unit: "$",
      note: "across all years",
      style: "paid",
    },
    {
      title: "Total Savings",
      value: totalRejected.toFixed(2),
      unit: "$",
      note: "across all years",
      style: "saved",
    },
  ];

  return (
    <>
      {infoArray.map((info) => (
        <DashboardCard key={info.title} {...info} />
      ))}
      <ClosedClaimsPieChart closedClaims={closedClaims} />

      <ClaimAmountsChart closedClaims={closedClaims} />
      <YearlyClaimsChart claims={claims} />
    </>
  );
};

export default DashboardContent;
