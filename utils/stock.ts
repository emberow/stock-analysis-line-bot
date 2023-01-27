import axios from 'axios';
import { getKD } from './TechnicalAnalysis/Kd';
import { getMovingAverage } from './TechnicalAnalysis/MoveAverage';
import { getRsi } from './TechnicalAnalysis/Rsi';

type stockInfo = {
    low: number[],
    high: number[],
    open: number[],
    close: number[],
}

const stockWebCrawler = async (stockNum: string) => {
    let curTime: any = new Date();
    curTime = curTime.getTime();
    curTime = Math.round(curTime.valueOf()/1000);
    let yearAgeTime = curTime - 31556926;
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stockNum}.TW?period1=${yearAgeTime}&period2=${curTime}&interval=1d&events=history&=hP2rOschxO0`);
    let stockPriceArray: stockInfo = response.data.chart.result[0].indicators.quote[0];
    return stockPriceArray;
};

export const getStockInfo = async (stockNum: string) => {
    let stockPriceArray = await stockWebCrawler(stockNum);
    let stockClosePriceArray = stockPriceArray.close;
    let stockLowPriceArray = stockPriceArray.low;
    let stockHighPriceArray = stockPriceArray.high;
    stockClosePriceArray = stockClosePriceArray.reverse();
    let responseText = '';
    // 分別得到5MA 20MA 60MA
    responseText = await getMovingAverage(5, stockClosePriceArray, responseText);
    responseText = await getMovingAverage(20, stockClosePriceArray, responseText);
    responseText = await getMovingAverage(60, stockClosePriceArray, responseText);
    responseText = await getRsi(6, stockClosePriceArray, responseText);
    responseText = await getKD(9, stockClosePriceArray, stockLowPriceArray, stockHighPriceArray, responseText);

    return responseText;
}


