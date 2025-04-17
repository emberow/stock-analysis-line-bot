import { schedule } from 'node-cron';
import * as overallEconomicIndicators from './service/OverallEconomicIndicators';

// 每天早上9點寄送大盤融資維持率訊息
export const scheduleDailyMessage = () => {
  schedule('0 1 * * *', async () => {
    try {
      console.log("Scheduling task started...");
      overallEconomicIndicators.sendDataToLine();
      console.log("Scheduling task ended...");
    }
    catch (error) {
      console.error("Error in scheduled task:", error);
    }
  });
};