import React from "react";
import classes from "./DashboardCard.module.css";

const DashboardCard = ({ title, value, unit, note, style }) => {
  const clName = style ? ` ${classes.value} ${classes[style]}` : classes.value;

  return (
    <div className={`dashboard-grid-cell ${classes.dashboardCard}`}>
      <p className={classes.title}>{title}</p>
      <p className={clName}>
        {unit && <span> {`${unit} `}</span>}
        {value}
      </p>

      <p className={classes.note}>{note}</p>
    </div>
  );
};

export default DashboardCard;
