import * as financingMaintenanceRate from '../utils/FinancingMaintenanceRate';
import * as cnnFearGreedIndex from '../utils/CnnFearGreedIndex';
import * as vix from '../utils/Vix';
import { sendMessage } from '../utils/messageSender';

export const sendDataToLine = async () => {
    console.log("Scheduling task started...");
    let message = '' ;

    // 爬蟲CNN恐懼貪婪指數
    const fearGreedIndex = await cnnFearGreedIndex.crawler();
    console.log("crawler cnnFearGreedIndex data successfully");
    message += `${fearGreedIndex[0]}美國-CNN恐懼與貪婪指數: ${fearGreedIndex[1]}\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // 爬蟲 VIX 指數
    const vixIndex = await vix.crawler();
    console.log("crawler vixIndex data successfully");
    message += `${vixIndex[0]}VIX波動率指數: ${vixIndex[1]}\n`;

    // 隨機延遲 10-15 秒
    await new Promise(resolve => setTimeout(resolve, Math.random() * 5000 + 10000));

    // 爬蟲大盤融資維持率
    const financingMaintenanceRateData = await financingMaintenanceRate.crawler();
    console.log("crawler financingMaintenanceRate data successfully");
    message += `${financingMaintenanceRateData[0]}大盤融資維持率: ${financingMaintenanceRateData[1]}%\n`;

    // Send message to LINE
    const userId = "U5955656d94c4c77b92c1e51959db691c";
    await sendMessage(userId, message);
    console.log("Message sent successfully");

    return;
}


