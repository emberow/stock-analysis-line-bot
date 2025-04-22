import * as financingMaintenanceRate from '../utils/FinancingMaintenanceRate';
import * as cnnFearGreedIndex from '../utils/CnnFearGreedIndex';
import * as vix from '../utils/Vix';
import * as aaiiInvestorSentimentIndex from '../utils/AaiiInvestorSentimentIndex';
import * as taiwanEconomicIndicators from '../utils/TaiwanEconomicIndicators';
import * as taiwanPeRatio from '../utils/TaiwanPeRatio';
import { sendMessage } from '../utils/messageSender';

export const sendDataToLine = async () => {
    console.log("Scheduling task started...");
    let message = '' ;

    // 爬蟲CNN恐懼貪婪指數
    const fearGreedIndex = await cnnFearGreedIndex.crawler();
    console.log("crawler cnnFearGreedIndex data successfully");
    message += `${fearGreedIndex[0]}美國-CNN恐懼與貪婪指數: ${fearGreedIndex[1]}\n\n`;

    // // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // // 爬蟲 VIX 指數
    const vixIndex = await vix.crawler();
    console.log("crawler vixIndex data successfully");
    message += `${vixIndex[0]}VIX波動率指數: ${vixIndex[1]}\n\n`;

    // // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // 美國-AAII 散戶投資人情緒指數
    const aaiiIndex = await aaiiInvestorSentimentIndex.crawler();
    console.log("crawler aaiiIndex data successfully");
    message += `${aaiiIndex[0]}美國-AAII散戶投資人情緒指數:\n`;
    message += `看空: ${aaiiIndex?.[1]?.[0]}\n`;
    message += `持平: ${aaiiIndex?.[1]?.[1]}\n`;
    message += `看多: ${aaiiIndex?.[1]?.[2]}\n\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // 台灣景氣對策燈號
    const taiwanEconomicIndex = await taiwanEconomicIndicators.crawler();
    console.log("crawler taiwanEconomicIndicators data successfully");
    message += `${taiwanEconomicIndex[0]}台灣景氣對策燈號: ${taiwanEconomicIndex[1]}\n\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // 爬蟲大盤融資維持率
    const financingMaintenanceRateData = await financingMaintenanceRate.crawler();
    console.log("crawler financingMaintenanceRate data successfully");
    message += `${financingMaintenanceRateData[0]}大盤融資維持率: ${financingMaintenanceRateData[1]}%\n\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // 台灣-台股本益比與台股趨勢
    const taiwanStockPE = await taiwanPeRatio.crawler();
    console.log("crawler taiwanStockPE data successfully");
    message += `${taiwanStockPE[0]}台灣-台股本益比: ${taiwanStockPE[1]}\n`;

    // Send message to LINE
    const userId = "U5955656d94c4c77b92c1e51959db691c";
    await sendMessage(userId, message);
    console.log("Message sent successfully");

    return;
}


