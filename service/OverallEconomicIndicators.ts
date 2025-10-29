import * as financingMaintenanceRate from '../utils/FinancingMaintenanceRate';
import * as cnnFearGreedIndex from '../utils/CnnFearGreedIndex';
import * as vix from '../utils/Vix';
import * as aaiiInvestorSentimentIndex from '../utils/AaiiInvestorSentimentIndex';
import * as taiwanPeRatio from '../utils/TaiwanPeRatio';
import * as usdNtdExchangeRate from '../utils/UsdNtdExchangeRate';
import * as AmericaShillerPeRatio from '../utils/AmericaShillerPeRatio';
import * as MarginBalance from '../utils/MarginBalance';

import { sendMessage } from '../utils/messageSender';

export const sendDataToLine = async () => {
    console.log("Scheduling task started...");
    let message = '' ;

    // 美國席勒本益比
    const americaShillerPeRatio = await AmericaShillerPeRatio.crawler();
    console.log("crawler americaShillerPeRatio data successfully");
    message += `${americaShillerPeRatio[0]}美國-席勒本益比: ${americaShillerPeRatio[1]}\n\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // 台灣-台股本益比與台股趨勢
    const taiwanStockPE = await taiwanPeRatio.crawler();
    console.log("crawler taiwanStockPE data successfully");
    message += `${taiwanStockPE[0]}台灣-台股本益比: ${taiwanStockPE[1]}\n\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // CNN恐懼貪婪指數
    const fearGreedIndex = await cnnFearGreedIndex.crawler();
    console.log("crawler cnnFearGreedIndex data successfully");
    message += `${fearGreedIndex[0]}美國-CNN恐懼與貪婪指數: ${fearGreedIndex[1]}\n\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // VIX 指數
    const vixIndex = await vix.crawler();
    console.log("crawler vixIndex data successfully");
    message += `${vixIndex[0]}VIX波動率指數: ${vixIndex[1]}\n\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // 美國-AAII 散戶投資人情緒指數
    const aaiiIndex = await aaiiInvestorSentimentIndex.crawler();
    console.log("crawler aaiiIndex data successfully");
    message += `${aaiiIndex[0]}美國-AAII散戶投資人情緒指數:\n`;
    message += `看空: ${aaiiIndex?.[1]?.[0]}% \n`;
    message += `持平: ${aaiiIndex?.[1]?.[1]}% \n`;
    message += `看多: ${aaiiIndex?.[1]?.[2]}% \n\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    const marginBalance = await MarginBalance.crawler();
    console.log("crawler marginBalance data successfully");
    message += `${marginBalance[0]}融資餘額: ${marginBalance[1]}\n\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // 大盤融資維持率
    const financingMaintenanceRateData = await financingMaintenanceRate.crawler();
    console.log("crawler financingMaintenanceRate data successfully");
    message += `${financingMaintenanceRateData[0]}大盤融資維持率: ${financingMaintenanceRateData[1]}%\n\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // 美元/新台幣匯率
    const UsdNtdExchangeRate = await usdNtdExchangeRate.crawler();
    console.log("crawler taiwanUsdNtd data successfully");
    message += `${UsdNtdExchangeRate[0]}台灣-美元/新台幣匯率: ${UsdNtdExchangeRate[1]}`;

    // Send message to LINE
    const userId = "U5955656d94c4c77b92c1e51959db691c";
    await sendMessage(userId, message);
    console.log("Message sent successfully");

    return;
}


