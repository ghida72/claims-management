import React, { useEffect, useState, useCallback } from "react";
import useLoader from "../../hooks/useLoader";
import httpClient from "../../services/httpClient";
import lookupStore from "../../services/lookupStore";
import calculateNet from "../../helpers/calculateNet";
import ClaimsBarGraph from "../../components/dashboard/ClaimsBarGraph";
import ClosedClaimsPieChart from "./ClosedlaimsPieChart";
import ClaimsDualBarGraph from "./ClaimsDualBarGraph";
import DashboardCard from "./DashboardCard";
import amountsCalculator from "../../helpers/amountsCalculator";

/*In a real world case, the data relevant to constructing charts is better handled and processed by the back-end server, and then fetched to the UI. Since we're using a dummy back-end here, the claims data will be fetched and processed on the front-end in order to contruct the charts  */

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
      value: openClaimsCount,
      unit: "",
      note: "as of today",
    },
    {
      title: "Total Paid",
      value: totalPaid,
      unit: "$",
      note: "across all years",
    },
    {
      title: "Total Savings",
      value: totalRejected,
      unit: "$",
      note: "across all years",
    },
  ];

  return (
    <>
      {infoArray.map((info) => (
        <DashboardCard {...info} />
      ))}
      <ClosedClaimsPieChart closedClaims={closedClaims} />

      <ClaimsBarGraph claims={claims} />

      <ClaimsDualBarGraph closedClaims={closedClaims} />
    </>
  );
};

export default DashboardContent;
