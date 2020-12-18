// updates all existing stocks.
// Updates individual stock csv. Also updates global mov avg csv.

const getRollingAvgCSV = require("./utils/csvUtils").getRollingAvgCSV;
const getStockCSVFile = require("./utils/csvUtils").getStockCSVFile;
const writeStockDataToCSV = require("./utils/csvUtils").writeNewStockDataToCSV;
const writeRecordToAvgCSV = require("./utils/csvUtils").writeRecordToAvgCsv;
const getAvgRecord = require("./utils/arrayUtils").getAvgRecord;
const sortResult = require("./utils/arrayUtils").sortResult;
const getHtml = require("./utils/makeRequest");
const formatDate = require("./utils/formatDate").formatDate;
const stringToDate = require("./utils/formatDate").stringToDate;
const dateToString = require("./utils/formatDate").dateToString;
const parseHTML = require("./utils/parseHTML");

const getUpdatedStockData = ({ StockName, LastUpdated }) => {
  const toDate = formatDate(new Date());

  const t1 = stringToDate(LastUpdated);
  t1.setDate(t1.getDate() + 1);
  const fromDate = formatDate(t1);

  return getHtml(StockName, fromDate, toDate);
};

const updateStocks = async () => {
  const stockList = await getRollingAvgCSV();
  const requestPromises = [];
  const filePromises = [];

  stockList.forEach((ele) => {
    requestPromises.push(getUpdatedStockData(ele));
    filePromises.push(getStockCSVFile(ele.StockName));
  });

  const filesResolved = await Promise.all(filePromises);
  const requestsResolved = await Promise.all(requestPromises);

  const results = [];

  requestsResolved.forEach((ele) => results.push(parseHTML(ele.data)));

  const records = [];

  const combinedResult = results.map((ele, index) => {
    let l = ele.length;

    sortResult(ele);
    ele = ele.map(({ date, price }) => {
      return { date: dateToString(date), price };
    });

    let arr = [...filesResolved[index].slice(l), ...ele];
    records.push(getAvgRecord(stockList[index].StockName, arr));

    return arr;
  });

  const fileWritePromises = [];
  combinedResult.forEach((ele, index) =>
    fileWritePromises.push(writeStockDataToCSV(stockList[index].StockName, ele))
  );

  await writeRecordToAvgCSV(records, true);
  await Promise.all(fileWritePromises);
  console.log("Updated.");
};

updateStocks();
