import React, { useEffect, useState, useCallback } from "react";
import calculateNet from "../helpers/calculateNet";
import ClaimsTable from "../components/claims/ClaimsTable";
import ClaimsPageWrapper from "./ClaimsPageWrapper";

const FilterableClaimsTable = () => {
  const [submittedCriteria, setSubmittedCriteria] = useState({});
  const [claims, setClaims] = useState([]);

  const transformClaimsData = (currentClaim, currencies) => {
    const clm = {
      claimNumber: currentClaim.claimNumber,
      patientName: `${currentClaim.patient.firstName} ${currentClaim.patient.lastName}`,
      dateSubmitted: new Date(currentClaim.dateSubmitted),
      status: currentClaim.status,
      currency: {
        code: currentClaim.currency,
        symbol: currencies.find(
          (element) => element.code === currentClaim.currency
        ).symbol,
      },
      claimedAmount: currentClaim.items
        .map((item) => calculateNet(item.requested))
        .reduce((prev, current) => prev + current),

      approvedAmount:
        currentClaim.status === "pending"
          ? null
          : currentClaim.items
              .map((item) => calculateNet(item.approved))
              .reduce((prev, current) => prev + current),
    };
    return clm;
  };

  const filteredClaims = claims.filter((claim) => {
    /*
    The filter criteria entered by the user will be stored as key value pairs in the submittedCriteria state
    variable. Accordingly, we are checking that the value of each one of the keys matches the value 
    of its corresponding property of the claim.
    */
    return Object.keys(submittedCriteria).every((key) => {
      let result = false;
      switch (key) {
        case "claimNumber":
          result = claim[key] === Number(submittedCriteria[key]);
          break;
        case "patient":
          const fullName = claim.patientName;
          const transformedfullName = fullName.trim().toLowerCase();
          const transformedSubmittedPatient = submittedCriteria[key]
            .trim()
            .toLowerCase();
          result = transformedfullName.includes(transformedSubmittedPatient);
          break;
        case "startDate":
          const startDate = new Date(submittedCriteria[key]);
          result = claim.dateSubmitted >= startDate;
          break;
        case "endDate":
          const endDate = new Date(submittedCriteria[key]);
          result = claim.dateSubmitted <= endDate;
          break;
        case "status":
          result = claim[key] === submittedCriteria[key];
          break;
        default:
          result = false;
      }

      return result;
    });
  });

  const handleFilter = (criteria) => {
    setSubmittedCriteria(criteria);
  };

  const showContent = filteredClaims.length > 0;

  return (
    <ClaimsPageWrapper
      className="flex-layout"
      claims={claims}
      showContent={showContent}
      transformClaimsData={transformClaimsData}
      onTransform={(claims) => setClaims(claims)}
    >
      <ClaimsTable onFilter={handleFilter} filteredClaims={filteredClaims} />
    </ClaimsPageWrapper>
  );
};

export default FilterableClaimsTable;
