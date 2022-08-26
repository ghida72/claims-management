const stringifyDate = (date) => {
  const stringifiedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  return stringifiedDate;
};

export default stringifyDate;
