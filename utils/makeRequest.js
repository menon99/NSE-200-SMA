const axios = require("axios").default;

const BASE_URL =
  "https://www1.nseindia.com/emerge/trading/content/productsSymbolMapping.jsp";

const instance = axios.create({
  baseURL: BASE_URL,
  params: {
    segmentLink: 3,
    symbolCount: 2,
    series: "ALL",
    dateRange: "+",
  },
});

const getHtml = (symbol, fromDate, toDate) => {
  return instance.get("", {
    params: {
      symbol,
      fromDate,
      toDate,
    },
  });
};

module.exports = getHtml;
