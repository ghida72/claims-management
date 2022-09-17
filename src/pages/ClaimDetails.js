import React, { useState, useEffect, useCallback } from "react";
import { Outlet, useParams } from "react-router-dom";
import calculateNet from "../helpers/calculateNet";
import ClaimDetailsContent from "../components/claimDetails/ClaimDetailsContent";
import httpClient from "../services/httpClient";
import lookupStore from "../services/lookupStore";
import useLoader from "../hooks/useLoader";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import prompt from "../helpers/promptHelper";
import getISODate from "../helpers/getISODate";
import { CLAIM_PROMPT_MESSAGE, ALERT_TYPES } from "../constants";
import AlertMessage from "../components/UI/AlertMessage";
import classes from "./ClaimDetails.module.css";

const ClaimDetails = () => {
  const [claim, setClaim] = useState(null);
  const [ICDs, setICDs] = useState(null);
  const [CPTs, setCPTs] = useState(null);
  const { isLoading, error, execute: getSingleClaim } = useLoader();

  const [alert, setAlert] = useState(null);

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

  useEffect(() => {
    getSingleClaim(buildAggregatePromise, onResolved);
  }, [getSingleClaim, buildAggregatePromise, onResolved]);

  const mapClaimToBackendModel = () => {
    const updatedClaim = {
      claimNumber: claim.claimNumber,
      currency: claim.currency.code,
      patient: {
        firstName: claim.patient.firstName,
        lastName: claim.patient.lastName,
        dateOfBirth: getISODate(claim.patient.dateOfBirth),
        sexAtBirth: claim.patient.sexAtBirth,
      },
      dateSubmitted: getISODate(claim.dateSubmitted),
      status: claim.status,
      diagnosis: claim.diagnosis,
      items: claim.items.map((item) => {
        return {
          CPT: item.CPT,
          requested: {
            quantity: item.requested.quantity,
            unitPrice: item.requested.unitPrice,
          },
          approved: item.approved
            ? {
                quantity: item.approved.quantity,
                unitPrice: item.approved.unitPrice,
              }
            : null,
        };
      }),
    };
    return updatedClaim;
  };

  const putClaim = (updatedClaim, onSuccess) => {
    httpClient
      .put(`claims/${claim.claimNumber}.json`, updatedClaim)
      .then(() => {
        onSuccess();
      })
      .catch((error) => {
        setAlert({
          type: ALERT_TYPES.error,
          msg: "An error has occurred. Please contact the administrator.",
        });
      });
  };

  const onClaimSaved = (msg) => {
    setAlert({ type: ALERT_TYPES.success, msg });
    getSingleClaim(buildAggregatePromise, onResolved);
  };

  const saveClaimHandler = () => {
    if (claim.status === "pending") {
      const updatedClaim = mapClaimToBackendModel();
      putClaim(updatedClaim, () => {
        onClaimSaved("Claim saved successfully");
      });
    }
  };

  const confirmClaimHandler = () => {
    if (claim.status === "pending") {
      const isValid = claim.items.every((item) => item.approved);
      if (isValid) {
        const updatedClaim = mapClaimToBackendModel();

        const isApproved = claim.items.every(
          (item) => item.requested.net === item.approved.net
        );
        const isRejected = claim.items.every((item) => item.approved.net === 0);

        updatedClaim.status = isApproved
          ? "approved"
          : isRejected
          ? "rejected"
          : "partially approved";
        updatedClaim.dateClosed = getISODate();

        prompt(CLAIM_PROMPT_MESSAGE, () => {
          putClaim(updatedClaim, () => {
            onClaimSaved("Claim processed successfully");
          });
        });
      } else {
        setAlert({
          type: ALERT_TYPES.error,
          msg: "Please process all line items before submitting",
        });
      }
    }
  };

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
          onSaveClaim={saveClaimHandler}
          onConfirmClaim={confirmClaimHandler}
        />
        <Outlet context={[claim, setClaim, CPTs]} />

        {alert && (
          <div className={classes.alert}>
            <AlertMessage
              type={alert.type}
              message={alert.msg}
              onCloseAlert={() => setAlert(null)}
            />
          </div>
        )}
      </main>
    );
  }
};

export default ClaimDetails;
