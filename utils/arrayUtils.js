const sortResult = (data) => {
  data.sort((e1, e2) => {
    if (e1.date < e2.date) return -1;
    else if (e1.date > e2.date) return 1;
    return 0;
  });
};

const getAvgRecord = (stockName, stockData) => {
  const avg = parseFloat(
    (
      stockData.reduce((initial, ele) => initial + parseFloat(ele.price), 0) /
      200
    ).toFixed(2)
  );

  const record = {
    stockName,
    date: stockData[stockData.length - 1].date,
    avg,
  };

  return record;
};

module.exports = { sortResult, getAvgRecord };
