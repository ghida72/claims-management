import React from "react";

const DashboardCard = ({ title, value, unit, note }) => {
  return (
    <div>
      <p>{title}</p>
      <p>
        {value}
        <span> {unit}</span>
      </p>

      <p>{note}</p>
    </div>
  );
};

export default DashboardCard;
