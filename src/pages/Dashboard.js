import React, { useEffect, useState, useCallback } from "react";
import calculateNet from "../helpers/calculateNet";
import DashboardContent from "../components/dashboard/DashboardContent";
import ClaimsPageWrapper from "./ClaimsPageWrapper";

const Dashboard = () => {
  const [claims, setClaims] = useState([]);

  const transformClaimsData = (currentClaim, currencies) => {
    const claimCurrency = currencies.find(
      (element) => element.code === currentClaim.currency
    );
    const clm = {
      claimNumber: currentClaim.claimNumber,
      patientName: `${currentClaim.patient.firstName} ${currentClaim.patient.lastName}`,
      dateSubmitted: new Date(currentClaim.dateSubmitted),
      status: currentClaim.status,
      currency: {
        code: currentClaim.currency,
        symbol: claimCurrency.symbol,
        conversion: claimCurrency.conversion,
      },
      claimedAmount:
        currentClaim.items
          .map((item) => calculateNet(item.requested))
          .reduce((prev, current) => prev + current) * claimCurrency.conversion,
      approvedAmount:
        currentClaim.status === "pending"
          ? null
          : currentClaim.items
              .map((item) => calculateNet(item.approved))
              .reduce((prev, current) => prev + current) *
            claimCurrency.conversion,
    };
    return clm;
  };

  const showContent = claims.length > 0;

  return (
    <ClaimsPageWrapper
      className="flex-layout"
      claims={claims}
      showContent={showContent}
      transformClaimsData={transformClaimsData}
      onTransform={(claims) => setClaims(claims)}
    >
      <DashboardContent claims={claims}></DashboardContent>
    </ClaimsPageWrapper>
  );
};

export default Dashboard;
