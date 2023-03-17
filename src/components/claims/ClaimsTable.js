import React, { Fragment, useEffect } from "react";
import FilterBar from "./FilterBar";
import classes from "./ClaimsTable.module.css";
import ClaimRow from "./ClaimRow";
import useSortableData from "../../hooks/useSortableData";
import { useNavigate, useLocation } from "react-router-dom";

const ClaimsTable = ({ filteredClaims, onFilter }) => {
  const location = useLocation();
  const navigate = useNavigate();

  //Sorting was implemented on the frontend to showcase the logic of sorting through a hook
  //that can be reused elsewhere. In real life projects with thousands or millions of claims,
  //sorting of the claims would be done on the server.
  const { sortedItems, requestSort, sortConfig } =
    useSortableData(filteredClaims);

  const queryParams = new URLSearchParams(location.search);
  const sortBy = queryParams.get("sort");
  const sortDirection = queryParams.get("dir");

  const toggleSortDirection = () => {
    if (sortDirection === "asc") return "desc";
    return "asc";
  };

  //The keys are the property names in submittedCriteria, and the values are the th values
  const headersMap = {
    claimNumber: "Claim Number",
    patientName: "Patient Name",
    dateSubmitted: "Date Submitted",
    claimedAmount: "Claimed Amount",
    approvedAmount: "Approved Amount",
    status: "Status",
  };

  useEffect(() => {
    if (location.search) {
      requestSort(sortBy, sortDirection);
    }
  }, [location.search, requestSort, sortBy, sortDirection]);

  const getClassNameFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  //prepares the table headers by using the headersMap object to populate an array of th elements
  const getHeadersMapContent = (headersMap) => {
    let content = [];
    for (let key in headersMap) {
      content.push(
        <th>
          <button
            onClick={() =>
              navigate(`/claims?sort=${key}&dir=${toggleSortDirection()}`)
            }
            className={`btn btn--small ${classes[getClassNameFor(key)]}`}
          >
            {headersMap[key]}
          </button>
        </th>
      );
    }
    return content;
  };

  return (
    <Fragment>
      <FilterBar onFilter={onFilter} />
      <table className={`table ${classes["claims-table"]}`}>
        <thead>
          <tr>{getHeadersMapContent(headersMap)}</tr>
        </thead>
        <tbody>
          {sortedItems.map((claim) => (
            <ClaimRow key={claim.claimNumber} claim={claim} />
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ClaimsTable;
