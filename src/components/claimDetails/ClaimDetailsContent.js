import { Fragment } from "react";
import classes from "./ClaimDetailsContent.module.css";
import getDisplayDate from "../../helpers/getDisplayDate";
import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { linkOutline } from "ionicons/icons";

const ClaimDetailsContent = ({
  claim,
  CPTs,
  ICDs,
  onSaveClaim,
  onConfirmClaim,
}) => {
  const dateSubmitted = getDisplayDate(claim.dateSubmitted);
  const dateProcessed = claim.dateClosed
    ? getDisplayDate(claim.dateClosed)
    : "-";
  const dateOfBirth = getDisplayDate(claim.patient.dateOfBirth);

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

  return (
    <Fragment>
      <div className={`${classes.claimInfo} ${classes["grid-container"]}`}>
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
                : `${classes["action-buttons"]} ${classes.hidden}`
            }
          >
            <button className="btn btn--large" onClick={onSaveClaim}>
              Save
            </button>
            <button className="btn btn--large" onClick={onConfirmClaim}>
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className={`${classes.personInfo} ${classes["grid-container"]}`}>
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
      <div className={`${classes.ICDInfo} ${classes["grid-container"]}`}>
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
        className={`
          table ${classes.CPTTable} ${classes["grid-container"]}`}
      >
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Type</th>
            <th>Requested</th>
            <th>Approved</th>
          </tr>
        </thead>
        <tbody>
          {claim.items.map((item) => (
            <tr key={item.CPT}>
              <td>
                <Link to={`/claims/${claim.claimNumber}/${item.CPT}`}>
                  {item.CPT}
                  <IonIcon className={classes.icon} icon={linkOutline} />
                </Link>
              </td>
              <td>{CPTs && getCPT(item) ? getCPT(item).description : "N/A"}</td>
              <td>{CPTs && getCPT(item) ? getCPT(item).type : "N/A"}</td>
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
    </Fragment>
  );
};

export default ClaimDetailsContent;
