// 計算布林通道
import { StockInfo } from "../type/StockPrice";
  
export function getBollingerBands(stockInfo: StockInfo, n: number = 20, multiplier: number = 2, responseText: string) {
    // 計算Typical Price
    const typicalPrices = stockInfo.close.map((_, i) => (stockInfo.high[i] + stockInfo.low[i] + stockInfo.close[i]) / 3);
    // 計算中線
    const midLine = typicalPrices.slice(0, n).reduce((sum, price) => sum + price, 0) / n;
  
    // 計算True Range
    const trueRanges = [];
    for (let i = 1; i < stockInfo.close.length; i++) {
      const prevClose = stockInfo.close[i - 1];
      const high = stockInfo.high[i];
      const low = stockInfo.low[i];
      const trueRange = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
      trueRanges.push(trueRange);
    }
  
    // 計算上下通道線
    const upperLine = [];
    const lowerLine = [];
    for (let i = n; i < stockInfo.close.length; i++) {
      const atr = trueRanges.slice(i - n, i).reduce((sum, tr) => sum + tr, 0) / n;
      const upper = midLine + atr * multiplier;
      const lower = midLine - atr * multiplier;
      upperLine.push(upper);
      lowerLine.push(lower);
    }
  
    responseText += `upperBound: ${upperLine[1]}\n`;
    responseText += `lowerBound: ${lowerLine[1]}\n`;
    return responseText;
  }