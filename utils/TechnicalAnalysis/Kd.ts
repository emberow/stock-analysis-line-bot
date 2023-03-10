export const getKD = async (
    numberOfDay: number,
    stockPriceArray: number[],
    stockLowPriceArray: number[],
    stockHighPriceArray: number[],
    responseText: string
    ) => {
    let kValue = 50;
    let dValue = 50;
    for (let i = 0; i < (stockPriceArray.length - numberOfDay); i++) {
        const tempHighestPrice = stockHighPriceArray.slice(i + 1, i + numberOfDay + 1);
        const tempLowestPrice = stockLowPriceArray.slice(i + 1, i + numberOfDay + 1);
        const highestPrice = Math.max(...tempHighestPrice);
        const lowestPrice = Math.min(...tempLowestPrice);
        const closingPrice = stockPriceArray[i + numberOfDay];
        const RSV = (closingPrice - lowestPrice) / (highestPrice - lowestPrice);
        kValue = kValue * (2 / 3) + RSV * (1 / 3);
        dValue = dValue * (2 / 3) + kValue * (1 / 3);
    }
    kValue = Math.round(kValue * 10000)/100;
    dValue = Math.round(dValue * 10000)/100;
    
    responseText += `K(${ numberOfDay }) = ${ kValue }%\n`;
    responseText += `D(${ numberOfDay }) = ${ dValue }%\n`;
    return responseText;
};