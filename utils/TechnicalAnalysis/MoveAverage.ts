// 參數為交易日天數
export const getMovingAverage = async (numberOfDay: number, stockPriceArray: number[], responseText: string) => {
    let movingAverage = stockPriceArray.slice(0, numberOfDay).reduce(function(total, price){
        return total + price;
    }) / numberOfDay;
    movingAverage = Math.round(movingAverage * 100) / 100;
    responseText += `${ numberOfDay }MA = ${ movingAverage }\n`;
    return responseText;
}