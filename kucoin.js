// github https://github.com/Kucoin/kucoin-node-sdk
// yt https://www.youtube.com/watch?v=BX432P8eq8o
// guida https://docs.kucoin.com/#general

/** Require SDK */
const API = require('kucoin-node-sdk');

/** Init Configure */
let cnf = require('./config');
console.log(cnf); 
API.init(cnf);

/** API use */
const main = async () => {
  const getTimestampRl = await API.rest.Others.getTimestamp();
  //console.log(getTimestampRl.data);
  return new Date(getTimestampRl.data).toLocaleTimeString('it-IT');
};


module.exports = main;

/** Run Demo */
//main();