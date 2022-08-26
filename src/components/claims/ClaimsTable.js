import React, { useEffect } from "react";
import classes from "./ClaimsTable.module.css";
import ClaimRow from "./ClaimRow";
import useSortableData from "../../hooks/useSortableData";
import { useNavigate, useLocation } from "react-router-dom";

const ClaimsTable = ({ filteredClaims }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { sortedItems, requestSort, sortConfig } =
    useSortableData(filteredClaims);

  const queryParams = new URLSearchParams(location.search);
  const sortBy = queryParams.get("sort");
  const sortDirection = queryParams.get("dir");

  const toggleSortDirection = () => {
    if (sortDirection === "asc") return "desc";
    return "asc";
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
  return (
    <table className={"table " + classes["claims-table"]}>
      <thead>
        <tr>
          <th>
            <button
              onClick={() =>
                navigate(
                  `/claims?sort=claimNumber&dir=${toggleSortDirection()}`
                )
              }
              className={
                "btn btn--small " + classes[getClassNameFor("claimNumber")]
              }
            >
              Claim Number
            </button>
          </th>
          <th>
            <button
              onClick={() =>
                navigate(
                  `/claims?sort=patientName&dir=${toggleSortDirection()}`
                )
              }
              className={
                "btn btn--small " + classes[getClassNameFor("patientName")]
              }
            >
              Patient Name
            </button>
          </th>
          <th>
            <button
              onClick={() =>
                navigate(
                  `/claims?sort=dateSubmitted&dir=${toggleSortDirection()}`
                )
              }
              className={
                "btn btn--small " + classes[getClassNameFor("dateSubmitted")]
              }
            >
              Date Submitted
            </button>
          </th>
          <th>
            <button
              onClick={() => {
                navigate(
                  `/claims?sort=claimedAmount&dir=${toggleSortDirection()}`
                );
              }}
              className={
                "btn btn--small " + classes[getClassNameFor("claimedAmount")]
              }
            >
              Claimed Amount
            </button>
          </th>
          <th>
            <button
              onClick={() => {
                navigate(
                  `/claims?sort=approvedAmount&dir=${toggleSortDirection()}`
                );
              }}
              className={
                "btn btn--small " + classes[getClassNameFor("approvedAmount")]
              }
            >
              Approved Amount
            </button>
          </th>
          <th>
            <button
              onClick={() => {
                navigate(`/claims?sort=status&dir=${toggleSortDirection()}`);
              }}
              className={"btn btn--small " + classes[getClassNameFor("status")]}
            >
              Status
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedItems.map((claim) => (
          <ClaimRow key={claim.claimNumber} claim={claim} />
        ))}
      </tbody>
    </table>
  );
};

export default ClaimsTable;
