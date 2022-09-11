import classes from "./AlertMessage.module.css";
import { IonIcon } from "@ionic/react";
import {
  checkmarkCircleOutline,
  alertCircleOutline,
  closeOutline,
} from "ionicons/icons";

const AlertMessage = ({ type, message, onCloseAlert }) => {
  if (type !== "success" && type !== "error") {
    throw new Error(
      "Invalid type passed to alert component. Only 'success' and 'error' are allowed."
    );
  }
  let alertClasses = classes.alertMessageBox;
  alertClasses += " " + classes[type];

  const iconMap = {
    success: checkmarkCircleOutline,
    error: alertCircleOutline,
  };

  const closeAlertHandler = (e) => {
    e.preventDefault();
    onCloseAlert();
  };

  return (
    <div className={alertClasses}>
      <IonIcon icon={iconMap[type]} className={classes.alertIcon} />
      <p>{message}</p>
      <IonIcon
        className={classes.closeButton}
        icon={closeOutline}
        onClick={closeAlertHandler}
      />
    </div>
  );
};

export default AlertMessage;
