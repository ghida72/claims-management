import React, { Fragment, useEffect, useCallback } from "react";
import httpClient from "../services/httpClient";
import lookupStore from "../services/lookupStore";
import useLoader from "../hooks/useLoader";
import LoadingSpinner from "../components/layout/LoadingSpinner";

const ClaimsPageWrapper = ({
  showContent,
  transformClaimsData,
  onTransform,
  className,
  children,
}) => {
  const { isLoading, error, execute: getAllClaims } = useLoader();

  const buildAggregatePromise = useCallback(() => {
    /*The execute method of the useLoader hook expects a single promise, but we need to fetch 
    data from two APIs.*/
    return Promise.all([
      httpClient.get(`claims.json`),
      lookupStore.getCurrencies(),
    ]);
  }, []);

  const onPromisesResolved = useCallback((data) => {
    const [claims, currencies] = data;
    const loadedClaims = [];

    for (const key in claims) {
      //Map from claim backend model to view model
      const currentClaim = claims[key];
      const clm = transformClaimsData(currentClaim, currencies);

      loadedClaims.push(clm);
    }
    onTransform(loadedClaims);
  }, []);

  useEffect(() => {
    getAllClaims(buildAggregatePromise, onPromisesResolved);
  }, [getAllClaims, buildAggregatePromise, onPromisesResolved]);

  let content = <p>No claims found. </p>;
  let clName = "flex-layout";
  if (showContent) {
    content = <Fragment>{children}</Fragment>;
    clName = className;
  }

  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <LoadingSpinner />;
  }

  return <main className={clName}>{content}</main>;
};

export default ClaimsPageWrapper;
