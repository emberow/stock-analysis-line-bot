import { schedule } from 'node-cron';
import { sendMessage } from './utils/messageSender';
import * as financingMaintenanceRate from './utils/FinancingMaintenanceRate';

// 每天早上9點寄送大盤融資維持率訊息
export const scheduleDailyMessage = () => {
  schedule('0 1 * * *', async () => {
    try {
      console.log("Scheduling task started...");
      const data = await financingMaintenanceRate.crawler();
      console.log("crawler financingMaintenanceRate data successfully");
      const message = `${data[0]}大盤融資維持率: ${data[1]}%`;
      const userId = "U5955656d94c4c77b92c1e51959db691c";
      await sendMessage(userId, message);
      console.log("Message sent successfully");
    }
    catch (error) {
      console.error("Error in scheduled task:", error);
    }
  });
};