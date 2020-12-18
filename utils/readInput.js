const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getStockName = () => {
  return new Promise((resolve) => {
    rl.question("Enter name of stock: ", (answer) => {
      rl.close();
      resolve(answer.toUpperCase().trim());
    });
  });
};

module.exports = getStockName;
