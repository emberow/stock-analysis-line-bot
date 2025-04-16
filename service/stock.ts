import axios from 'axios';
import { getKD } from '../utils/Kd';
import { getMovingAverage } from '../utils/MoveAverage';
import { getRsi } from '../utils/Rsi';
import { getBollingerBands } from '../utils/BollingerBand';
import { StockInfo } from '../type/StockPrice';

const stockWebCrawler = async (stockNum: string) => {
    let curTime: any = new Date();
    curTime = curTime.getTime();
    curTime = Math.round(curTime.valueOf()/1000);
    let yearAgeTime = curTime - 31556926;
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stockNum}.TW?period1=${yearAgeTime}&period2=${curTime}&interval=1d&events=history&=hP2rOschxO0`);
    let stockPriceArray: StockInfo = response.data.chart.result[0].indicators.quote[0];
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
    responseText += `當前股價: ${Math.round(stockClosePriceArray[0] * 100) / 100}\n`;
    responseText = await getMovingAverage(5, stockClosePriceArray, responseText);
    responseText = await getMovingAverage(20, stockClosePriceArray, responseText);
    responseText = await getMovingAverage(60, stockClosePriceArray, responseText);
    responseText = await getRsi(6, stockClosePriceArray, responseText);
    responseText = await getKD(9, stockClosePriceArray, stockLowPriceArray, stockHighPriceArray, responseText);
    let twentyDayStockInfo: StockInfo = {
        low: [],
        high: [],
        open: [],
        close: [],
    };
    twentyDayStockInfo.close = stockPriceArray.close.reverse().slice(0, 20);
    twentyDayStockInfo.high = stockPriceArray.high.reverse().slice(0, 20);
    twentyDayStockInfo.low = stockPriceArray.low.reverse().slice(0, 20);
    responseText = await getBollingerBands(stockPriceArray, 20, 2, responseText);
    return responseText;
}


