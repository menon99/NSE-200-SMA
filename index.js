const getStocksList = require("./utils/csvUtils").getStocksList;
const addStock = require("./utils/addStock");
const writeRecordToAvgCSV = require("./utils/csvUtils").writeRecordToAvgCsv;

const main = async () => {
  let stocksList = await getStocksList();
  const promises = stocksList.map(({ STOCK }) => addStock(STOCK.trim()));
  const records = (await Promise.all(promises)).filter(
    (ele) => Object.keys(ele).length > 0
  );
  await writeRecordToAvgCSV(records);
  console.log("Stocks written.");
  process.exit(0);
};

main();
