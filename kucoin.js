// github https://github.com/Kucoin/kucoin-node-sdk
// yt https://www.youtube.com/watch?v=BX432P8eq8o
// guida https://docs.kucoin.com/#general

/** Require SDK */
const API = require('kucoin-node-sdk');

/** Init Configure */
let cnf = require('./config');
API.init(cnf);

/** API use */
const test = async () => {
  const getTimestampRl = await API.rest.Others.getTimestamp();
  //console.log(getTimestampRl.data);
  return new Date(getTimestampRl.data).toLocaleTimeString('it-IT');
};

const get_symbol = async (symbol) => {
  const response = await API.rest.Market.Symbols.getTicker(symbol);
  console.log(response);
  return response;
}


module.exports = {
  test,
  get_symbol
}

/** Run Demo */
//get_symbol('XLM-USDT');