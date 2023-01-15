import axios from 'axios';

export const getStockInfo = async (stockNum: string) => {
    let curTime: any = new Date();
    curTime = curTime.getTime();
    curTime = Math.round(curTime.valueOf()/1000);
    let yearAgeTime = curTime - 31556926;
    const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${stockNum}.TW?period1=${yearAgeTime}&period2=${curTime}&interval=1d&events=history&=hP2rOschxO0`);
    let result = response.data.chart.result[0].indicators.quote[0].close;
    result = await Promise.all(result.map(async(price: any) => {
        return Math.round(price.valueOf() * 1000) / 1000;
    }))
    console.log(result);
    return result[result.length - 1];
}