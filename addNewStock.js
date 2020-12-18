const addStock = require("./utils/addStock");
const writeRecordToAvgCSV = require("./utils/csvUtils").writeRecordToAvgCsv;

(async () => {
  const record = await addStock();
  if (Object.keys(record).length) writeRecordToAvgCSV([record]);
})();
