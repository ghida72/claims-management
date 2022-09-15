import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useParams } from "react-router-dom";
import calculateNet from "../helpers/calculateNet";
import ClaimDetailsContent from "../components/claimDetails/ClaimDetailsContent";
import httpClient from "../services/httpClient";
import lookupStore from "../services/lookupStore";
import useLoader from "../hooks/useLoader";
import LoadingSpinner from "../components/layout/LoadingSpinner";

const ClaimDetails = () => {
  const [claim, setClaim] = useState(null);
  const [reloadValue, setReloadValue] = useState(false);
  const [ICDs, setICDs] = useState(null);
  const [CPTs, setCPTs] = useState(null);
  const { isLoading, error, execute: getSingleClaim } = useLoader();

  const params = useParams();
  const { claimNb } = params;

  const buildAggregatePromise = useCallback(() => {
    return Promise.all([
      lookupStore.getCurrencies(),
      lookupStore.getICDs(),
      lookupStore.getCPTs(),
      httpClient.get(`claims/${claimNb}.json`),
    ]);
  }, [claimNb]);

  const mapClaimFromBackendModel = useCallback((backendClaim, currencies) => {
    if (backendClaim) {
      const clm = {
        ...backendClaim,
        dateSubmitted: new Date(backendClaim.dateSubmitted),
        dateClosed: backendClaim.dateClosed
          ? new Date(backendClaim.dateClosed)
          : null,
        currency: {
          code: backendClaim.currency,
          symbol: currencies.find(
            (element) => element.code === backendClaim.currency
          ).symbol,
        },
        patient: {
          ...backendClaim.patient,
          dateOfBirth: new Date(backendClaim.patient.dateOfBirth),
        },
      };
      clm.items.forEach((item) => {
        item.requested.net = calculateNet(item.requested);
        if (item.approved) {
          item.approved.net = calculateNet(item.approved);
        }
      });
      setClaim(clm);
    }
  }, []);

  const onResolved = useCallback(
    (data) => {
      const [currencies, ICDs, CPTs, backendClaim] = data;
      mapClaimFromBackendModel(backendClaim, currencies);
      setICDs(ICDs);
      setCPTs(CPTs);
    },
    [mapClaimFromBackendModel]
  );

  /*
  Allows the child component ClaimDetailsContent to reload the claim information from the backend
  by modifying the state variable (reloadValue) which in turn invokes getSingleClaim.
  */
  const reloadClaim = () => {
    setReloadValue(!reloadValue);
  };

  useEffect(() => {
    getSingleClaim(buildAggregatePromise, onResolved);
  }, [getSingleClaim, buildAggregatePromise, onResolved, reloadValue]);

  if (error) {
    return <p>{error}</p>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isLoading && !claim) {
    return <p>The claim cannot be found</p>;
  }

  if (claim) {
    return (
      <main className="grid-layout">
        <ClaimDetailsContent
          claim={claim}
          ICDs={ICDs}
          CPTs={CPTs}
          onReloadClaim={reloadClaim}
        />
        <Outlet context={[claim, setClaim, CPTs]} />
      </main>
    );
  }
};

export default ClaimDetails;
