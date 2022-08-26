import React, { useState, useEffect, useCallback, Fragment } from "react";
import { Outlet, useParams } from "react-router-dom";
import calculateNet from "../helpers/calculateNet";
import ClaimDetailsContent from "../components/claimDetails/ClaimDetailsContent";
import httpClient from "../services/httpClient";
import lookupStore from "../services/lookupStore";
import useLoader from "../hooks/useLoader";
import LoadingSpinner from "../components/layout/LoadingSpinner";

const ClaimDetails = () => {
  const [claim, setClaim] = useState(null);
  const [value, setValue] = useState(false);
  const [ICDs, setICDs] = useState(null);
  const [CPTs, setCPTs] = useState(null);
  const { isLoading, error, execute: getSingleClaim } = useLoader();

  const params = useParams();
  const { claimNb } = params;

  const buildGetClaimPromise = useCallback(() => {
    return httpClient.get(
      `https://claims-management-adb8a-default-rtdb.europe-west1.firebasedatabase.app/newClaims/${claimNb}.json`
    );
  }, [claimNb]);

  const buildPromise = useCallback(() => {
    return Promise.all([
      lookupStore.getCurrencies(),
      lookupStore.getICDs(),
      lookupStore.getCPTs(),
      buildGetClaimPromise(),
    ]);
  }, [buildGetClaimPromise]);

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

  const reloadClaim = () => {
    setValue(!value);
  };

  useEffect(() => {
    getSingleClaim(buildPromise, onResolved);
  }, [getSingleClaim, buildPromise, onResolved, value]);

  if (error) {
    return <p>{error}</p>;
  }

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  if (!isLoading && !claim) {
    return <p>The claim you selected cannot be found</p>;
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
