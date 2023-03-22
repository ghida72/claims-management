const amountsCalculator = (closedClaims) => {
  const amountsArray = [];
  closedClaims.forEach((claim) => {
    const year = claim.dateSubmitted.getFullYear();

    const foundElement = amountsArray.find((x) => x.year === year);
    if (foundElement) {
      foundElement.approvedAmount =
        foundElement.approvedAmount + claim.approvedAmount;
      foundElement.rejectedAmount =
        foundElement.rejectedAmount +
        (claim.claimedAmount - claim.approvedAmount);
    } else {
      const c = {
        year: year,
        approvedAmount: claim.approvedAmount,
        rejectedAmount: claim.claimedAmount - claim.approvedAmount,
      };
      amountsArray.push(c);
    }
  });
  return amountsArray;
};

export default amountsCalculator;
