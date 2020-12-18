const formatDate = (date) => {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const monthToNumberMapping = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

const numberToMonthMapping = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};

const stringToDate = (dateString) => {
  const parts = dateString.split("-");
  const date = +parts[0];
  const month = monthToNumberMapping[parts[1]];
  const year = +parts[2];
  return new Date(year, month, date);
};

const dateToString = (date) => {
  return `${date.getDate()}-${
    numberToMonthMapping[date.getMonth()]
  }-${date.getFullYear()}`;
};

module.exports = {
  formatDate,
  stringToDate,
  dateToString,
  monthToNumberMapping,
  numberToMonthMapping,
};
