import React, { useState } from "react";
import classes from "./FilterBar.module.css";
import getISODate from "../../helpers/getISODate";

const today = getISODate();

const FilterBar = ({ onFilter }) => {
  /*The userCriteria maintains the internal state of the component until the user clicks the filter button 
  which then shares it with the parent component and consequently results in filtering the claims.
  This way the claims are only filtered once the user clicks the filter button rather than filtering on every 
  input change*/
  const [userCriteria, setUserCriteria] = useState({});
  const handleInputChange = (e) =>
    setUserCriteria((prev) => {
      const result = { ...prev, [e.target.name]: e.target.value };
      //clean up to avoid comparing with an empty value and resuling in no claims matching the criteria
      if (e.target.value === "") {
        delete result[e.target.name];
      }
      return result;
    });
  return (
    <form className={classes.filterForm}>
      <div className={classes["no-spinner"]}>
        <label htmlFor="claim-number"> Claim Number </label>
        <input
          type="number"
          placeholder="Claim Number"
          id="claim-number"
          name="claimNumber"
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="patient"> Patient </label>
        <input
          type="text"
          placeholder="Patient"
          id="patient"
          name="patient"
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="start-date"> From </label>
        <input
          type="date"
          id="start-date"
          name="startDate"
          min="2018-01-01"
          max={today}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="end-date"> To </label>
        <input
          type="date"
          id="end-date"
          name="endDate"
          min="2018-01-01"
          max={today}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="status"> Status </label>
        <select name="status" id="status" onChange={handleInputChange}>
          <option value="">-- select --</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="partially approved">Partially Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <button
        className="btn btn--large"
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          onFilter(userCriteria);
        }}
      >
        Filter
      </button>
    </form>
  );
};

export default FilterBar;
