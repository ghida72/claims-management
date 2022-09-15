const getISODate = (date) => {
  if (!date) {
    date = new Date();
  }
  return date
    .toISOString() //1993-02-07T12:39:07.000Z
    .split("T")[0]; //1993-02-07
};

export default getISODate;
