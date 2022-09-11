import { Fragment, useState, useEffect } from "react";
import classes from "./ClaimDetailsContent.module.css";
import stringifyDate from "../../helpers/stringifyDate";
import getToday from "../../helpers/getToday";
import { Link } from "react-router-dom";
import httpClient from "../../services/httpClient";
import { IonIcon } from "@ionic/react";
import { linkOutline } from "ionicons/icons";
import AlertMessage from "../UI/AlertMessage";
import prompt from "../../helpers/promptHelper";
import { CLAIM_PROMPT_MESSAGE, ALERT_TYPES } from "../../constants";

const ClaimDetailsContent = ({
  claim,
  CPTs,
  ICDs,
  onReloadClaim,
  onToggle,
}) => {
  const [alert, setAlert] = useState(null);
  const ALERT_KEY = "alert";

  useEffect(() => {
    const stringAlert = window.sessionStorage.getItem(ALERT_KEY);
    if (stringAlert) {
      const alertValue = JSON.parse(stringAlert);
      setAlert(alertValue);
      window.sessionStorage.removeItem(ALERT_KEY);
    }
  }, []);

  const dateSubmitted = stringifyDate(claim.dateSubmitted);
  const dateProcessed = claim.dateClosed
    ? stringifyDate(claim.dateClosed)
    : "-";
  const dateOfBirth = stringifyDate(claim.patient.dateOfBirth);

  const claimedTotal = claim.items
    .map((item) => item.requested.net)
    .reduce((prev, current) => prev + current);

  const approvedTotal =
    claim.status === "pending"
      ? null
      : claim.items
          .map((item) => item.approved.net)
          .reduce((prev, current) => prev + current);
  const getCPT = (item) => CPTs.find((CPT) => CPT.code === item.CPT);
  const getDiagnosisICD = () =>
    ICDs.find((ICD) => ICD.code === claim.diagnosis.ICD);

  const revertDate = (date) => {
    const newDate = date.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    return newDate;
  };

  const mapClaimToBackendModel = () => {
    const updatedClaim = {
      claimNumber: claim.claimNumber,
      currency: claim.currency.code,
      patient: {
        firstName: claim.patient.firstName,
        lastName: claim.patient.lastName,
        dateOfBirth: revertDate(claim.patient.dateOfBirth),
        sexAtBirth: claim.patient.sexAtBirth,
      },
      dateSubmitted: revertDate(claim.dateSubmitted),
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

  const putClaim = (updatedClaim, callback) => {
    httpClient
      .put(`newClaims/${claim.claimNumber}.json`, updatedClaim)
      .then(() => {
        callback();
      });
  };

  const storeAlert = (type, msg) => {
    //Set a session variable that will be read upon reloading the content of the page
    //the reason we need to do this is because the reload calls a method on the parent
    //which sets a state variable and reloads the parent. This causes this component to be removed
    //from the DOM and re-rendered. The session value will then be read in the useEffect() hook to
    //display the alert accordingly.
    const alertString = JSON.stringify({ type, msg });
    window.sessionStorage.setItem(ALERT_KEY, alertString);
    onReloadClaim();
  };
  const saveClaimHandler = () => {
    if (claim.status === "pending") {
      const updatedClaim = mapClaimToBackendModel();
      putClaim(updatedClaim, () => {
        storeAlert(ALERT_TYPES.success, "Claim saved successfully");
      });
    }
  };

  const confirmClaimHandler = () => {
    if (claim.status === "pending") {
      const isValid = claim.items.every((item) => item.approved);
      if (isValid) {
        const updatedClaim = mapClaimToBackendModel();

        const today = getToday();

        const isApproved = claim.items.every(
          (item) => item.requested.net === item.approved.net
        );
        const isRejected = claim.items.every((item) => item.approved.net === 0);

        updatedClaim.status = isApproved
          ? "approved"
          : isRejected
          ? "rejected"
          : "partially approved";
        updatedClaim.dateClosed = today;
        prompt(CLAIM_PROMPT_MESSAGE, () => {
          putClaim(updatedClaim, () => {
            storeAlert(ALERT_TYPES.success, "Claim processed successfully");
          });
        });
      } else {
        storeAlert(
          ALERT_TYPES.error,
          "Please process all line items before submitting"
        );
      }
    }
  };

  return (
    <Fragment>
      <div className={classes.claimInfo + " " + classes["grid-container"]}>
        <div>
          <span className={classes.label}>Claim Number</span>
          <span>{claim.claimNumber}</span>
        </div>
        <div>
          <span className={classes.label}>Date Submitted </span>
          <span>{dateSubmitted}</span>
        </div>
        <div>
          <span className={classes.label}>Date Processed </span>
          <span>{dateProcessed}</span>
        </div>
        <div>
          <span className={classes.label}>Total Requested </span>
          <span>{`${claim.currency.symbol}${claimedTotal.toFixed(2)}`}</span>
        </div>
        <div>
          <span className={classes.label}>Total Approved </span>
          <span>
            {!approvedTotal && approvedTotal !== 0
              ? "-"
              : `${claim.currency.symbol}${approvedTotal.toFixed(2)}`}
          </span>
        </div>
        <div>
          <span className={classes.label}>Status </span>
          <span>{claim.status}</span>
        </div>
        <div>
          <div
            className={
              claim.status === "pending"
                ? classes["action-buttons"]
                : classes["action-buttons"] + " " + classes.hidden
            }
          >
            <button className="btn btn--large" onClick={saveClaimHandler}>
              Save
            </button>
            <button className="btn btn--large" onClick={confirmClaimHandler}>
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className={classes.personInfo + " " + classes["grid-container"]}>
        <div>
          <span className={classes.label}>First Name</span>
          <span>{claim.patient.firstName}</span>
        </div>
        <div>
          <span className={classes.label}>Last Name</span>
          <span>{claim.patient.lastName}</span>
        </div>
        <div>
          <span className={classes.label}>Sex at Birth</span>
          <span>{claim.patient.sexAtBirth}</span>
        </div>
        <div>
          <span className={classes.label}> Date of Birth</span>
          <span>{dateOfBirth}</span>
        </div>
      </div>
      <div className={classes.ICDInfo + " " + classes["grid-container"]}>
        <div>
          <span className={classes.label}>ICD</span>
          <span>{`${claim.diagnosis.ICD}-${
            ICDs && getDiagnosisICD() ? getDiagnosisICD().description : "N/A"
          }`}</span>
        </div>
        <div>
          <span className={classes.label}>Symptoms</span>
          <span>{claim.diagnosis.symptoms}</span>
        </div>
      </div>
      <table
        className={
          "table " + classes.CPTTable + " " + classes["grid-container"]
        }
      >
        <thead>
          <tr>
            <th>Type</th>
            <th>Code</th>
            <th>Description</th>
            <th>Requested</th>
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>
          {claim.items.map((item) => (
            <tr key={item.CPT}>
              <td>
                <Link to={`/claims/${claim.claimNumber}/${item.CPT}`}>
                  {CPTs && getCPT(item) ? getCPT(item).type : "N/A"}
                  <IonIcon className={classes.icon} icon={linkOutline} />
                </Link>
              </td>
              <td>{item.CPT}</td>
              <td>{CPTs && getCPT(item) ? getCPT(item).description : "N/A"}</td>
              <td>
                {`${claim.currency.symbol}${item.requested.net.toFixed(2)}`}
              </td>
              <td>
                {!item.approved
                  ? "-"
                  : `${claim.currency.symbol}${item.approved.net.toFixed(2)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {alert && (
        <div className={classes.alert}>
          <AlertMessage
            type={alert.type}
            message={alert.msg}
            onCloseAlert={() => setAlert(null)}
          />
        </div>
      )}
    </Fragment>
  );
};

export default ClaimDetailsContent;
