"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStockInfo = void 0;
const axios_1 = __importDefault(require("axios"));
const stockWebCrawler = async (stockNum) => {
    let curTime = new Date();
    curTime = curTime.getTime();
    curTime = Math.round(curTime.valueOf() / 1000);
    let yearAgeTime = curTime - 31556926;
    const response = await axios_1.default.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stockNum}.TW?period1=${yearAgeTime}&period2=${curTime}&interval=1d&events=history&=hP2rOschxO0`);
    let stockPriceArray = response.data.chart.result[0].indicators.quote[0].close;
    stockPriceArray = await Promise.all(stockPriceArray.map(async (price) => {
        return Math.round(price.valueOf() * 1000) / 1000;
    }));
    return stockPriceArray;
};
const getStockInfo = async (stockNum) => {
    let stockPriceArray = await stockWebCrawler(stockNum);
    stockPriceArray = stockPriceArray.reverse();
    let responseText = '';
    // 分別得到5MA 20MA 60MA
    responseText = await getMovingAverage(5, stockPriceArray, responseText);
    responseText = await getMovingAverage(20, stockPriceArray, responseText);
    responseText = await getMovingAverage(60, stockPriceArray, responseText);
    responseText = await getRsi(6, stockPriceArray, responseText);
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
// 暴力型rsi，看盤軟體都是使用指數型rsi，因此以指數型rsi為主
// const getRsi = async (numberOfDay: number, stockPriceArray: number[], responseText: string) => {
//     const priceArray = stockPriceArray.slice(0, numberOfDay+1).reverse();
//     const upArrays: number[] = [];
//     const downArrays: number[] = [];
//     for (let i = 1; i < priceArray.length; i++){
//         const result = priceArray[i] - priceArray[i-1];
//         if (result > 0){
//             upArrays.push(result);
//         } else {
//             downArrays.push(result * -1);
//         }
//     }
//     const upAvg = upArrays.reduce((accumulator, currentValue) => {
//         return accumulator + currentValue;
//     }) / numberOfDay;
//     const downAvg = (downArrays.reduce((accumulator, currentValue) => {
//         return accumulator + currentValue;
//     })) / numberOfDay;
//     const Rsi = upAvg / (upAvg + downAvg) * 100;
//     responseText += `RSI(${ numberOfDay }) = ${ Rsi }\n`;
//     return responseText;
// }
const getRsi = async (numberOfDay, stockPriceArray, responseText) => {
    // 指數型rsi
    // n為numberOfDay
    // 只取前六筆，算完後的結果 = 舊值/n*(n-1)+新值/n
    let priceArray = stockPriceArray.reverse();
    priceArray = stockPriceArray.slice(0, numberOfDay + 1);
    let upValue = 0;
    let downValue = 0;
    for (let i = 1; i < priceArray.length; i++) {
        const result = priceArray[i] - priceArray[i - 1];
        if (result > 0) {
            upValue += result;
        }
        else {
            downValue -= result;
        }
    }
    upValue = upValue / numberOfDay;
    downValue = downValue / numberOfDay;
    priceArray = stockPriceArray.slice(numberOfDay + 1);
    for (let i = 1; i < priceArray.length; i++) {
        const result = priceArray[i] - priceArray[i - 1];
        upValue = (upValue / numberOfDay) * (numberOfDay - 1);
        downValue = (downValue / numberOfDay) * (numberOfDay - 1);
        if (result > 0) {
            upValue += (result / numberOfDay);
        }
        else if (result < 0) {
            downValue += (-1) * result / numberOfDay;
        }
    }
    let Rsi = upValue / (upValue + downValue) * 100;
    Rsi = Math.round(Rsi * 100) / 100;
    responseText += `RSI(${numberOfDay}) = ${Rsi}\n`;
    return responseText;
};
// const getKD = async (numberOfDay: number, stockPriceArray: number[], responseText: string) => {
//     const RSV = 
// }
