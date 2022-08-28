import { TAX_PERCENT } from "../constants";

const calculateNet = (amounts) => {
  if (amounts) {
    return amounts.quantity * amounts.unitPrice * (1 - TAX_PERCENT / 100);
  } else {
    return null;
  }
};

export default calculateNet;
