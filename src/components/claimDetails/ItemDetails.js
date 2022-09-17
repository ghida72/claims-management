import React, { useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import classes from "./ItemDetails.module.css";
import { TAX_PERCENT, CPT_PROMPT_MESSAGE, ALERT_TYPES } from "../../constants";
import calculateNet from "../../helpers/calculateNet";
import DrawerContext from "../../store/DrawerContext";
import { IonIcon } from "@ionic/react";
import { chevronBackOutline, chevronForwardOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";
import prompt from "../../helpers/promptHelper";
import AlertMessage from "../UI/AlertMessage";

const ItemDetails = () => {
  const [alert, setAlert] = useState(null);
  const [claim, setClaim, CPTs] = useOutletContext();
  const { tryCloseDrawer, showPrompt, setShowPrompt } =
    useContext(DrawerContext);

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
    enteredQuantity && quantity >= 0 && quantity <= item.requested.quantity;
  const unitPriceIsValid =
    enteredUnitPrice && unitPrice >= 0 && unitPrice <= item.requested.unitPrice;
  const formIsValid = quantityIsValid && unitPriceIsValid;

  const onEnteredQtyChange = (newValue) => {
    setAlert(null);
    setEnteredQuantity(newValue);
    setEnteredUnitPrice(item.requested.unitPrice);
    const formIsDirty =
      parseFloat(newValue) !== initialQuantity ||
      unitPrice !== initialUnitPrice;
    setShowPrompt(formIsDirty);
  };

  const onEnteredUnitPriceChange = (newValue) => {
    setAlert(null);
    setEnteredUnitPrice(newValue);
    const formIsDirty =
      quantity !== initialQuantity || parseFloat(newValue) !== initialUnitPrice;
    setShowPrompt(formIsDirty);
  };

  const saveItemHandler = (e) => {
    e.preventDefault();
    if (claim.status === "pending") {
      setShowPrompt(false);
      if (formIsValid) {
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
        setAlert({ type: ALERT_TYPES.success, msg: "Item saved successfully" });
      } else {
        setAlert({ type: ALERT_TYPES.error, msg: "Please enter valid values" });
      }
    }
  };

  const closeItemHandler = (e) => {
    e.preventDefault();
    tryCloseDrawer();
  };

  const navigateToCpt = (i, e) => {
    e.preventDefault();
    const executeNavigate = () => {
      setShowPrompt(false);
      navigate(`/claims/${claim.claimNumber}/${i.CPT}`);
    };
    if (showPrompt) {
      prompt(CPT_PROMPT_MESSAGE, executeNavigate);
    } else {
      executeNavigate();
    }
  };

  const handlePrev = (e) => {
    navigateToCpt(prevItem, e);
  };

  const handleNext = (e) => {
    navigateToCpt(nextItem, e);
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
        <button disabled={!prevItem} onClick={handlePrev}>
          <IonIcon icon={chevronBackOutline} />
        </button>
        <button disabled={!nextItem} onClick={handleNext}>
          <IonIcon icon={chevronForwardOutline} />
        </button>
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
      <form className={classes["lineItemForm"]}>
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
              onChange={(e) => onEnteredQtyChange(e.target.value)}
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
              onChange={(e) => onEnteredUnitPriceChange(e.target.value)}
              type="number"
              id="unitPrice"
              name="unitPrice"
              value={enteredUnitPrice}
            ></input>
          </div>
          <span className={classes.heading}>Tax({TAX_PERCENT}%)</span>
          <span>
            {(
              (TAX_PERCENT / 100) *
              item.requested.quantity *
              item.requested.unitPrice
            ).toFixed(2)}
          </span>
          <div>
            <label htmlFor="tax">Tax({TAX_PERCENT}%)</label>
            <input
              disabled
              type="number"
              id="tax"
              name="tax"
              value={
                enteredQuantity &&
                enteredUnitPrice &&
                (
                  (TAX_PERCENT / 100) *
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
        {alert && (
          <AlertMessage
            type={alert.type}
            message={alert.msg}
            onCloseAlert={() => {
              setAlert(null);
            }}
          />
        )}
        <div className={classes["action-buttons"]}>
          {claim.status === "pending" && (
            <button
              disabled={!showPrompt || !enteredQuantity || !enteredUnitPrice}
              className="btn btn--large"
              onClick={saveItemHandler}
            >
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
