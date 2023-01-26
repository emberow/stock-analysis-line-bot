import axios from 'axios';

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
    stockClosePriceArray = stockClosePriceArray.reverse();
    let responseText = '';
    // 分別得到5MA 20MA 60MA
    responseText = await getMovingAverage(5, stockClosePriceArray, responseText);
    responseText = await getMovingAverage(20, stockClosePriceArray, responseText);
    responseText = await getMovingAverage(60, stockClosePriceArray, responseText);
    responseText = await getRsi(6, stockClosePriceArray, responseText);
    return responseText;
}

// 參數為交易日天數
const getMovingAverage = async (numberOfDay: number, stockPriceArray: number[], responseText: string) => {
    let movingAverage = stockPriceArray.slice(0, numberOfDay).reduce(function(total, price){
        return total + price;
    }) / numberOfDay;
    movingAverage = Math.round(movingAverage * 100) / 100;
    responseText += `${ numberOfDay }MA = ${ movingAverage }\n`;
    return responseText;
}

const getRsi = async (numberOfDay: number, stockPriceArray: number[], responseText: string) => {
    // 指數型rsi
    // n為numberOfDay
    // 只取前六筆，算完後的結果 = 舊值/n*(n-1)+新值/n
    let priceArray = stockPriceArray.reverse();
    priceArray = stockPriceArray.slice(0, numberOfDay+1);
    let upValue: number = 0;
    let downValue: number = 0;
    for (let i = 1; i < priceArray.length; i++){
        const result = priceArray[i] - priceArray[i-1];
        if (result > 0){
            upValue += result;
        } else {
            downValue -= result;
        }
    }
    upValue = upValue / numberOfDay;
    downValue = downValue / numberOfDay;
    priceArray = stockPriceArray.slice(numberOfDay+1);
    
    for( let i = 1; i < priceArray.length; i++){
        const result = priceArray[i] - priceArray[i-1];
        upValue = (upValue / numberOfDay) * (numberOfDay - 1);
        downValue = (downValue / numberOfDay) * (numberOfDay - 1);
        if (result > 0){
            upValue += (result / numberOfDay);
        } else if (result < 0){
            downValue += (-1) * result / numberOfDay;
        }
    }
    let Rsi = upValue / (upValue + downValue) * 100;
    Rsi = Math.round(Rsi * 100) / 100;
    responseText += `RSI(${ numberOfDay }) = ${ Rsi }\n`;
    return responseText;
}

// const getKD = async (numberOfDay: number, stockPriceArray: number[], responseText: string) => {
//     const RSV = 
// }