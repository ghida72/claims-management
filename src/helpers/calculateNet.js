import { taxPercent } from "../claims";

const calculateNet = (amounts) => {
  if (amounts) {
    return amounts.quantity * amounts.unitPrice * (1 - taxPercent / 100);
  } else {
    return null;
  }
};

export default calculateNet;
