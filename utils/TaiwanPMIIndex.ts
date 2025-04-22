import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as fs from 'fs';
import * as path from 'path';

// 啟用 stealth 插件
puppeteer.use(StealthPlugin());

export const crawler = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
        ],
    });

    const page = await browser.newPage();

    // 設置用戶代理和視窗大小
    await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );
    await page.setViewport({ width: 1280, height: 720 });

    // 打開目標網頁
    await page.goto('https://www.macromicro.me/collections/16/tw-industry-relative/126/tw-pmi', {
        waitUntil: 'networkidle0', // 等待網頁完全加載
    });

    // 網站截圖
    const PICS_DIR = path.resolve(__dirname, '../pics');
    if (!fs.existsSync(PICS_DIR)) {
        fs.mkdirSync(PICS_DIR, { recursive: true });
    }
    const screenshotPath = path.resolve(PICS_DIR, 'TaiwanPMIIndex_screenshot.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to ${screenshotPath}`);

    // 提取數據
    const value = await page.evaluate(() => {
        const element = document.querySelector('div.stat-val > span.val');
        return element ? element.textContent : null;
    });

    const date = await page.evaluate(() => {
        const element = document.querySelector('div.date-label');
        return element ? element.textContent : null;
    });

    // 關閉瀏覽器
    await browser.close();
    return [date, value];
};