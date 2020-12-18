const getStocksList = require("./utils/csvUtils").getStocksList;
const addStock = require("./utils/addStock");

const main = async () => {
  let stocksList = await getStocksList();
  stocksList = stocksList.slice(0, 2);
  const promises = stocksList.map(({ STOCK }) => addStock(STOCK));
  await Promise.all(promises);
  console.log("Stocks written.");
  process.exit(0);
};

main();
