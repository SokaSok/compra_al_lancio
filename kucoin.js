// github https://github.com/Kucoin/kucoin-node-sdk
// yt https://www.youtube.com/watch?v=BX432P8eq8o
// guida https://docs.kucoin.com/#general
// gateio-crypto-trading-bot https://github.com/CyberPunkMetalHead/gateio-crypto-trading-bot-binance-announcements-new-coins/blob/c82a94fe8ed26f88bd7c95f6aef2523034801350/src/new_listings_scraper.py#L97

const G = require('./generalia.js');

/** Require SDK */
const API = require('kucoin-node-sdk');

/** Init Configure */
let cnf = require('./config');
const { copyFileSync } = require('fs');
API.init(cnf);

/** API use */
const test = async () => {
  const getTimestampRl = await API.rest.Others.getTimestamp();
  //console.log(getTimestampRl.data);
  return new Date(getTimestampRl.data).toLocaleTimeString('it-IT');
};

const get_ticker = async (symbol) => {
  const response = await API.rest.Market.Symbols.getTicker(symbol);
  console.log(response);
  return response;
}

const get_symbols = async () => {
  const response = await API.rest.Market.Symbols.getSymbolsList();
  console.log(response);
  return response;
}

function ascii_letters () { // eslint-disable-line camelcase
  //   original by: Yury Shapkarin (https://shapkarin.me)
  //   example 1: ascii_letters()
  //   returns 1: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const length = 26
  let i = 65
  return [...Array(length + 6 + length)]
    .reduce(function (accumulator) {
      return accumulator + String.fromCharCode(i++)
    }, '')
    .match(/[a-zA-Z]+/g)
    .reverse()
    .join('')
}

function getPromise(options) {
  const https = require('https');

  //console.log('options',options);

	return new Promise((resolve, reject) => {
		https.get(options, (response) => {
			let chunks_of_data = [];

			response.on('data', (fragments) => {
				chunks_of_data.push(fragments);
			});

			response.on('end', () => {
				let response_body = Buffer.concat(chunks_of_data);
				resolve(response_body.toString());
			});

			response.on('error', (error) => {
				reject(error);
			});
		});
	});
}

async function makeSynchronousRequest(options) {
	try {
		let http_promise = getPromise(options);
		let response_body = await http_promise;

		// holds response from server that is passed when Promise is resolved
		//console.log(response_body);
    return response_body;
	}
	catch(error) {
		// Promise rejected
		//console.log(error);
    return error;
	}
}

async function get_announcement() {
    // Retrieves new coin listing announcements from Kucoin
    
    console.log(`Pulling announcement page`);
    // Generate random query/params to help prevent caching
    
    let rand_page_size = Math.floor(Math.random() * 200);
    let letters = ascii_letters();

    let rand_size =  Math.floor(Math.random() * 10 + 10);
    let random_string = '';
    for (let i = 0; i < rand_size; i++) {
      random_string = letters[Math.floor(Math.random() * letters.length)];
    }
    let random_number = Math.floor(Math.random() * 99999999999999999998 + 1);

    let queries = [
      `page=1`, 
      `pageSize=${rand_page_size}`, 
      `category=listing`, 
      `lang=en_US` , 
      `rnd=${(new Date()).toISOString()}`,
      `${random_string}=${random_number}`
    ];
    queries = queries.sort((a, b) => 0.5 - Math.random());
    let request_url = `/_api/cms/articles??${queries[0]}&${queries[1]}&${queries[2]}&${queries[3]}&${queries[4]}&${queries[5]}`;
    
    const options = {
      hostname: 'www.kucoin.com',
      port: 443,
      path: request_url,
      method: 'GET'
    }
    
    let res = await makeSynchronousRequest(options);
    //console.log(res);
    return JSON.parse(res);
}

/**
 * 
 * @param {string} symbol - tipo "BTC-USDT"
 * @param {Date} [start]
 * @param {Date} [end]
 * @returns {{
 *  error : boolean,
 *  message : string,
 *  response : any?
 * } | 
 * {
 *   sequence : string,
 *   price : string,
 *   size : string,
 *   side : string,
 *   time : number
 *  }[]}
 */
const get_prices = async (symbol,start,end) => {
  const response = await API.rest.Market.Histories.getMarketHistories(symbol);
  start = start || new Date(1970,0,1);
  end = end || new Date();
  if (G.differenzaDate(end,start) < 0) return {error : true, message : 'END > START'};
  if (response.code != 200000) return {error : true, response, message : 'SERVER ERROR'};
  console.log(response.data.length)
  console.log(new Date(response.data[0].sequence*1))
  console.log(new Date(response.data[response.data.length-1].sequence*1))
  let prices = response.data.filter(p => G.dataCompresa(new Date(p.sequence*1),start,end))
  return prices;
}

module.exports = {
  test,
  get_ticker,
  get_symbols,
  get_announcement
}

/** Run Demo */
return
  get_prices('XLM-USDT',new Date(2022,0,6,13),new Date(2022,0,7,13))
  //.then(r => console.log(new Date(r.reduce((acc,cur) => Math.min(acc,cur.sequence*1),Infinity))));
  .then(r => console.log(r));
