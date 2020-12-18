// Adds a new stock. Generates csv for that stock.
// Adds a new row to mov avg csv.

// 50 days buffer in each request.

const getHtml = require("./makeRequest");
const formatDate = require("./formatDate").formatDate;
const dateToString = require("./formatDate").dateToString;
const parseHTML = require("./parseHTML");
const getStockName = require("./readInput");
const sortResult = require("./arrayUtils").sortResult;
const getAvgRecord = require("./arrayUtils").getAvgRecord;
const writeStockDataToCSV = require("./csvUtils").writeNewStockDataToCSV;
const writeRecordToAvgCSV = require("./csvUtils").writeRecordToAvgCsv;

const DAY_BUFFER = 50;

const getStockRequestPromises = (stock) => {
  const startDate = new Date();

  const t1 = new Date();
  t1.setDate(t1.getDate() - DAY_BUFFER);

  const t2 = new Date();

  const promises = [];

  while (
    !(
      t1.getFullYear() === startDate.getFullYear() - 1 &&
      t1.getMonth() <= startDate.getMonth() &&
      t1.getDate() <= startDate.getDate()
    )
  ) {
    let fromDate = formatDate(t1);
    let toDate = formatDate(t2);
    let html = getHtml(stock, fromDate, toDate);

    promises.push(html);
    t1.setDate(t1.getDate() - DAY_BUFFER);
    t2.setDate(t2.getDate() - DAY_BUFFER);
  }

  return promises;
};

const getStockData = (resolved) => {
  let stockData = [];
  resolved.forEach((ele) => stockData.push(...parseHTML(ele.data)));
  sortResult(stockData);
  stockData = stockData.slice(stockData.length - 200).map(({ date, price }) => {
    return { date: dateToString(date), price };
  });
  return stockData;
};

const addStock = (name) => {
  return new Promise(async (resolve) => {
    const stockName = name || (await getStockName());
    console.log(`Processing ${stockName}.`);

    let promises = getStockRequestPromises(stockName);
    const resolved = await Promise.all(promises);

    let stockData = getStockData(resolved);
    if (!stockData.length) {
      console.log(`No data for ${stockName}`);
      resolve();
      return;
    }
    const record = getAvgRecord(stockName, stockData);

    await writeStockDataToCSV(stockName, stockData);
    await writeRecordToAvgCSV([record]);

    console.log(`${stockName} data written.`);
    resolve();
  });
};

module.exports = addStock;
