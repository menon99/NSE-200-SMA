const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const readFromStream = (path) => {
  const dataArray = [];
  return new Promise((resolve) => {
    fs.createReadStream(path)
      .pipe(csv())
      .on("data", (data) => dataArray.push(data))
      .on("end", () => resolve(dataArray));
  });
};

const getStocksList = async () => {
  const stocksFilePath = path.join(__dirname, "..", "csv", "stocks.csv");
  return await readFromStream(stocksFilePath);
};

const getRollingAvgCSV = async () => {
  const rollingAvgFilePath = path.join(
    __dirname,
    "..",
    "csv",
    "RollingAvg.csv"
  );
  return await readFromStream(rollingAvgFilePath);
};

const getStockCSVFile = async (stockName) => {
  const stockCSVFilePath = path.join(
    __dirname,
    "..",
    "csv",
    stockName + ".csv"
  );
  return await readFromStream(stockCSVFilePath);
};

const writeNewStockDataToCSV = async (stockName, data) => {
  const csvPath = path.join(__dirname, "..", "csv", stockName + ".csv");

  const csvWriter = createCsvWriter({
    path: csvPath,
    header: [
      { id: "date", title: "date" },
      { id: "price", title: "price" },
    ],
  });

  return new Promise((resolve) => {
    fs.writeFile(csvPath, "", async (err) => {
      if (err) throw err;
      await csvWriter.writeRecords(data);
    });
    resolve();
  });
};

const writeRecordToAvgCsv = async (records, rewrite = false) => {
  const csvPath = path.join(__dirname, "..", "csv", "RollingAvg.csv");

  const options = {
    path: csvPath,
    header: [
      { id: "stockName", title: "StockName" },
      { id: "date", title: "LastUpdated" },
      { id: "avg", title: "RollingAvg" },
    ],
  };

  if (fs.existsSync(csvPath) && !rewrite) {
    options.append = true;
    return await createCsvWriter(options).writeRecords(records);
  }

  return new Promise((resolve) => {
    fs.writeFile(csvPath, "", async (err) => {
      if (err) throw err;
      await createCsvWriter(options).writeRecords(records);
    });
    resolve();
  });
};

module.exports = {
  getStocksList,
  writeNewStockDataToCSV,
  writeRecordToAvgCsv,
  getRollingAvgCSV,
  getStockCSVFile,
};
