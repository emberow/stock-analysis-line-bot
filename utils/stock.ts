import axios from 'axios';

export const getStockInfo = async (stockNum: string) => {
    let curTime: any = new Date();
    curTime = curTime.getTime();
    curTime = Math.round(curTime.valueOf()/1000);
    let yearAgeTime = curTime - 31556926;
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stockNum}.TW?period1=${yearAgeTime}&period2=${curTime}&interval=1d&events=history&=hP2rOschxO0`);
    let stockPriceArray: number[] = response.data.chart.result[0].indicators.quote[0].close;
    stockPriceArray = await Promise.all(stockPriceArray.map(async(price: any) => {
        return Math.round(price.valueOf() * 1000) / 1000;
    }))
    stockPriceArray = stockPriceArray.reverse();
    let responseText = '';
    // 分別得到5MA 20MA 60MA
    responseText = await getMovingAverage(5, stockPriceArray, responseText);
    responseText = await getMovingAverage(20, stockPriceArray, responseText);
    responseText = await getMovingAverage(60, stockPriceArray, responseText);
    console.log(responseText);
    return responseText;
}

// 參數為交易日天數
export const getMovingAverage = async (numberOfDay: number, stockPriceArray: number[], responseText: string) => {
    let movingAverage = stockPriceArray.slice(0, numberOfDay).reduce(function(total, price){
        return total + price;
    }) / numberOfDay;
    movingAverage = Math.round(movingAverage * 100) / 100;
    responseText += `${ numberOfDay }MA = ${ movingAverage }\n`;
    return responseText;
}

