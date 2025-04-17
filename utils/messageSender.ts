import { ClientConfig, Client } from '@line/bot-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const client = new Client(clientConfig);

export const sendMessage = async (userId: string, message: string) => {
  try {
    await client.pushMessage(userId, {
      type: 'text',
      text: message,
    });
  } catch (err) {
    console.error('Error sending message:', err);
  }
};