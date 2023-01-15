"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const getStockInfo = async (stockNum) => {
    let curTime = new Date();
    curTime = curTime.getTime();
    curTime = Math.round(curTime.valueOf() / 1000);
    let yearAgeTime = curTime - 31556926;
    const response = await axios_1.default.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stockNum}.TW?period1=${yearAgeTime}&period2=${curTime}&interval=1d&events=history&=hP2rOschxO0`);
    let result = response.data.chart.result[0].indicators.quote[0].close;
    result = await Promise.all(result.map(async (price) => {
        return Math.round(price.valueOf() * 1000) / 1000;
    }));
    console.log(result);
    return result[result.length - 1];
};
exports.getStockInfo = getStockInfo;
