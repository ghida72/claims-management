import React, { useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import classes from "./ItemDetails.module.css";
import { taxPercent } from "../../claims";
import calculateNet from "../../helpers/calculateNet";
import DrawerContext from "../../store/DrawerContext";
import { IonIcon } from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";

const ItemDetails = () => {
  const [claim, setClaim, CPTs] = useOutletContext();
  const { hideDrawerHandler } = useContext(DrawerContext);

  const params = useParams();

  const { itemCPT } = params;
  const navigate = useNavigate();

  const claimNotPending = claim.status !== "pending";
  const item = claim.items.find((item) => item.CPT === itemCPT);
  const getCPT = (item) => CPTs.find((CPT) => CPT.code === item.CPT);
  const initialQuantity = item && item.approved ? item.approved.quantity : "";
  const initialUnitPrice = item && item.approved ? item.approved.unitPrice : "";

  const [enteredQuantity, setEnteredQuantity] = useState(initialQuantity);
  const [enteredUnitPrice, setEnteredUnitPrice] = useState(initialUnitPrice);
  const quantity = parseFloat(enteredQuantity);
  const unitPrice = parseFloat(enteredUnitPrice);

  const quantityIsValid =
    quantity && quantity > 0 && quantity <= item.requested.quantity;
  const unitPriceIsValid =
    unitPrice && unitPrice > 0 && unitPrice <= item.requested.unitPrice;
  const formIsValid = quantityIsValid && unitPriceIsValid;

  const saveItemHandler = (e) => {
    e.preventDefault();
    formIsValid &&
      setClaim({
        ...claim,
        items: claim.items.map((item) => {
          const updatedItem = { ...item };
          if (item.CPT === itemCPT) {
            updatedItem.approved = {
              quantity: quantity,
              unitPrice: unitPrice,
              net: calculateNet({ quantity, unitPrice }),
            };
          }
          return updatedItem;
        }),
      });
  };

  const formIsDirty =
    enteredQuantity !== initialQuantity ||
    enteredUnitPrice !== initialUnitPrice;

  const closeItemHandler = (e) => {
    e.preventDefault();
    if (formIsDirty) {
      if (
        window.confirm(
          "Are you sure you want to close without saving your changes?"
        )
      ) {
        hideDrawerHandler();
      }
    } else {
      hideDrawerHandler();
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    if (formIsDirty) {
      if (
        window.confirm(
          "Are you sure you want to navigate to another item without saving your changes?"
        )
      ) {
        navigate(`/claims/${claim.claimNumber}/${prevItem.CPT}`);
      }
    } else {
      navigate(`/claims/${claim.claimNumber}/${prevItem.CPT}`);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (formIsDirty) {
      if (
        window.confirm(
          "Are you sure you want to navigate to another item without saving your changes?"
        )
      ) {
        navigate(`/claims/${claim.claimNumber}/${nextItem.CPT}`);
      }
    } else {
      navigate(`/claims/${claim.claimNumber}/${nextItem.CPT}`);
    }
  };

  const currentItemIndex = claim.items.indexOf(item);
  const prevItem = claim.items[currentItemIndex - 1];
  const nextItem = claim.items[currentItemIndex + 1];

  if (!item) {
    return <p> The item you selected cannot be found. </p>;
  }

  return (
    <div className={classes["item-details"]}>
      <div className={classes["navigate-buttons"]}>
        {/* {prevItem ? (
          <button onClick={handlePrev}>
            <IonIcon icon={chevronBackOutline} />
          </button>
        ) : (
          <IonIcon className={classes.icon} icon={chevronBackOutline} />
        )} */}
        <button disabled={!prevItem} onClick={handlePrev}>
          <IonIcon icon={chevronBackOutline} />
        </button>
        <button disabled={!nextItem} onClick={handleNext}>
          <IonIcon icon={chevronForwardOutline} />
        </button>

        {/* {nextItem ? (
          <a href="#" onClick={handleNext}>
            <IonIcon icon={chevronForwardOutline} />
          </a>
        ) : (
          <IonIcon className={classes.icon} icon={chevronForwardOutline} />
        )} */}
      </div>
      <div className={classes.CPTGeneral}>
        <div>
          <span className={classes.label}>Type</span>
          <span> {CPTs && getCPT(item) ? getCPT(item).type : "N/A"}</span>
        </div>
        <div>
          <span className={classes.label}>Code</span>
          <span> {item.CPT}</span>
        </div>
        <div>
          <span className={classes.label}>Description</span>
          <span>
            {" "}
            {CPTs && getCPT(item) ? getCPT(item).description : "N/A"}
          </span>
        </div>
      </div>
      <form>
        <div className={classes.CPTDetails}>
          <span className={classes.start + " " + classes.heading}>
            Requested
          </span>
          <span className={classes.heading}>Approved</span>
          <span className={classes.heading}>Quantity</span>
          <span>{item.requested.quantity}</span>
          <div>
            <label htmlFor="quantity">Quantity</label>
            <input
              disabled={claimNotPending}
              onChange={(e) => {
                setEnteredQuantity(e.target.value);
                setEnteredUnitPrice(item.requested.unitPrice);
              }}
              type="number"
              id="quantity"
              name="quantity"
              value={enteredQuantity}
            ></input>
          </div>
          <span className={classes.heading}>Unit Price</span>
          <span>{item.requested.unitPrice}</span>
          <div>
            <label htmlFor="unitPrice">Unit Price</label>
            <input
              disabled={claimNotPending}
              onChange={(e) => setEnteredUnitPrice(e.target.value)}
              type="number"
              id="unitPrice"
              name="unitPrice"
              value={enteredUnitPrice}
            ></input>
          </div>
          <span className={classes.heading}>Tax({taxPercent}%)</span>
          <span>
            {(
              (taxPercent / 100) *
              item.requested.quantity *
              item.requested.unitPrice
            ).toFixed(2)}
          </span>
          <div>
            <label htmlFor="tax">Tax({taxPercent}%)</label>
            <input
              disabled
              type="number"
              id="tax"
              name="tax"
              value={
                enteredQuantity &&
                enteredUnitPrice &&
                (
                  (taxPercent / 100) *
                  parseFloat(enteredQuantity) *
                  parseFloat(enteredUnitPrice)
                ).toFixed(2)
              }
            ></input>
          </div>
          <span className={classes.heading}>Net Amount</span>
          <span>{item.requested.net.toFixed(2)}</span>
          <div>
            <label htmlFor="netAmount">Net Amount</label>
            <input
              disabled
              type="number"
              id="netAmount"
              name="netAmount"
              value={
                enteredQuantity &&
                enteredUnitPrice &&
                calculateNet({
                  quantity: parseFloat(enteredQuantity),
                  unitPrice: parseFloat(enteredUnitPrice),
                }).toFixed(2)
              }
            ></input>
          </div>
        </div>

        <div className={classes["action-buttons"]}>
          {claim.status === "pending" && (
            <button className="btn btn--large" onClick={saveItemHandler}>
              Save
            </button>
          )}
          <button className="btn btn--large" onClick={closeItemHandler}>
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemDetails;
