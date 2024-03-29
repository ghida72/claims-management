import React from "react";
import { Link } from "react-router-dom";
import getDisplayDate from "../../helpers/getDisplayDate";
import { IonIcon } from "@ionic/react";
import { linkOutline } from "ionicons/icons";

const ClaimRow = ({ claim }) => {
  const approvedAmount =
    !claim.approvedAmount && claim.approvedAmount !== 0
      ? "-"
      : `${claim.currency.symbol}${claim.approvedAmount.toFixed(2)}`;

  const dateSubmitted = getDisplayDate(claim.dateSubmitted);

  return (
    <tr>
      <td>
        <Link to={`/claims/${claim.claimNumber}`}>
          {claim.claimNumber}
          <IonIcon icon={linkOutline} />
        </Link>
      </td>
      <td>{claim.patientName}</td>
      <td>{dateSubmitted}</td>
      <td>{`${claim.currency.symbol}${claim.claimedAmount.toFixed(2)}`}</td>
      <td>{approvedAmount}</td>
      <td>{claim.status}</td>
    </tr>
  );
};

export default ClaimRow;
