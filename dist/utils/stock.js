"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMovingAverage = exports.getStockInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const getStockInfo = async (stockNum) => {
    let curTime = new Date();
    curTime = curTime.getTime();
    curTime = Math.round(curTime.valueOf() / 1000);
    let yearAgeTime = curTime - 31556926;
    const response = await axios_1.default.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stockNum}.TW?period1=${yearAgeTime}&period2=${curTime}&interval=1d&events=history&=hP2rOschxO0`);
    let stockPriceArray = response.data.chart.result[0].indicators.quote[0].close;
    stockPriceArray = await Promise.all(stockPriceArray.map(async (price) => {
        return Math.round(price.valueOf() * 1000) / 1000;
    }));
    stockPriceArray = stockPriceArray.reverse();
    let responseText = '';
    // 分別得到5MA 20MA 60MA
    responseText = await exports.getMovingAverage(5, stockPriceArray, responseText);
    responseText = await exports.getMovingAverage(20, stockPriceArray, responseText);
    responseText = await exports.getMovingAverage(60, stockPriceArray, responseText);
    console.log(responseText);
    return responseText;
};
exports.getStockInfo = getStockInfo;
// 參數為交易日天數
const getMovingAverage = async (numberOfDay, stockPriceArray, responseText) => {
    let movingAverage = stockPriceArray.slice(0, numberOfDay).reduce(function (total, price) {
        return total + price;
    }) / numberOfDay;
    movingAverage = Math.round(movingAverage * 100) / 100;
    responseText += `${numberOfDay}MA = ${movingAverage}\n`;
    return responseText;
};
exports.getMovingAverage = getMovingAverage;
