export const getRsi = async (numberOfDay: number, stockPriceArray: number[], responseText: string) => {
    // 指數型rsi
    // n為numberOfDay
    // 只取前六筆，算完後的結果 = 舊值/n*(n-1)+新值/n
    stockPriceArray.reverse();
    let priceArray = stockPriceArray.slice(0, numberOfDay+1);
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
    responseText += `RSI(${ numberOfDay }) = ${ Rsi }%\n`;
    return responseText;
}