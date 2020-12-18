const cheerio = require("cheerio");
const stringToDate = require("./formatDate").stringToDate;

const parseHTML = (html) => {
  const dateLastPrice = {};
  const $ = cheerio.load(html);
  const rows = $("tbody > tr").slice(1);
  rows.each((index, ele) => {
    const row = $(ele);
    let date = row.find(".date").text();
    let lastPrice = row.find(".number").slice(4, 5).text();
    lastPrice = lastPrice.replace(/,/g, "");
    lastPrice = parseFloat(lastPrice);
    let quantity = row.find(".number").slice(7, 8).text();
    quantity = +quantity.replace(/,/g, "");
    if (date in dateLastPrice) {
      if (quantity > dateLastPrice[date].quantity)
        dateLastPrice[date] = { lastPrice, quantity };
    } else dateLastPrice[date] = { lastPrice, quantity };
  });
  const data = [];
  Object.keys(dateLastPrice).forEach((ele) => {
    let obj = { date: stringToDate(ele), price: dateLastPrice[ele].lastPrice };
    data.push(obj);
  });
  return data;
};

module.exports = parseHTML;
