import React, { useEffect, useState, useCallback } from "react";
import httpClient from "../services/httpClient";
import lookupStore from "../services/lookupStore";
import useLoader from "../hooks/useLoader";
import calculateNet from "../helpers/calculateNet";
import FilterBar from "../components/claims/FilterBar";
import ClaimsTable from "../components/claims/ClaimsTable";
import LoadingSpinner from "../components/layout/LoadingSpinner";

const FilterableClaimsTable = () => {
  const { isLoading, error, execute: getAllClaims } = useLoader();
  const [submittedCriteria, setSubmittedCriteria] = useState({});
  const [claims, setClaims] = useState([]);

  const buildPromise = useCallback(() => {
    return Promise.all([
      httpClient.get(`newClaims.json`),
      lookupStore.getCurrencies(),
    ]);
  }, []);

  const onResolved = useCallback((data) => {
    const [claims, currencies] = data;
    const loadedClaims = [];

    for (const key in claims) {
      const currentClaim = claims[key];
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

      loadedClaims.push(clm);
    }
    setClaims(loadedClaims);
  }, []);

  useEffect(() => {
    getAllClaims(buildPromise, onResolved);
  }, [getAllClaims, buildPromise, onResolved]);

  const filteredClaims = claims.filter((claim) => {
    return Object.keys(submittedCriteria).every((key) => {
      let result = false;
      const dateSubmitted = claim.dateSubmitted;
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
          result = dateSubmitted >= startDate;
          break;
        case "endDate":
          const endDate = new Date(submittedCriteria[key]);
          result = dateSubmitted <= endDate;
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

  let claimsTableContent = <p>No claims found matching these criteria</p>;
  if (filteredClaims.length > 0) {
    claimsTableContent = <ClaimsTable filteredClaims={filteredClaims} />;
  }
  if (error) {
    claimsTableContent = <p>{error}</p>;
  }
  if (isLoading) {
    claimsTableContent = <LoadingSpinner />;
  }
  return (
    <main className="flex-layout">
      <FilterBar onFilter={handleFilter} />
      {claimsTableContent}
    </main>
  );
};

export default FilterableClaimsTable;
