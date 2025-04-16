import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

// Ensure the /cookies directory exists
const COOKIES_DIR = path.resolve(__dirname, "../cookies");
if (!fs.existsSync(COOKIES_DIR)) {
    fs.mkdirSync(COOKIES_DIR, { recursive: true });
}

// Define the path for the cookies file
const COOKIE_FILE_PATH = path.resolve(COOKIES_DIR, "cookies.json");

export const crawler = async () => {
    const browser = await chromium.launch({ headless: false }); // Launch browser
    const context = await browser.newContext({
        javaScriptEnabled: true, // 確保 JavaScript 已啟用
    });
    // Load cookies if the file exists
    if (fs.existsSync(COOKIE_FILE_PATH)) {
        const cookies = JSON.parse(fs.readFileSync(COOKIE_FILE_PATH, "utf-8"));
        await context.addCookies(cookies); // Load cookies into the browser context
        console.log("Cookies loaded from file.");
    } else {
        console.log("No cookies file found. Proceeding without cookies.");
    }

    const page = await context.newPage();
    // Open webpage
    await page.goto('https://www.macromicro.me/charts/53117/taiwan-taiex-maintenance-margin'); 
    // 等待網路請求完成
    await page.waitForLoadState('networkidle'); 

    // 儲存cookie到檔案
    const cookies = await context.cookies();
    fs.writeFileSync(COOKIE_FILE_PATH, JSON.stringify(cookies, null, 2), "utf-8");
    console.log("Cookies saved to file in /cookies directory.");

    // 網站截圖
    const PICS_DIR = path.resolve(__dirname, "../pics");
    if (!fs.existsSync(PICS_DIR)) {
        fs.mkdirSync(PICS_DIR, { recursive: true });
    }
    const screenshotPath = path.resolve(PICS_DIR, "screenshot.png");
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot saved to ${screenshotPath}`);

    const value = await page.evaluate(() => {
        const element = document.querySelector('div.stat-val > span.val');
        return (element as HTMLElement).innerText;
    });
    const date = await page.evaluate(() => {
        const element = document.querySelector('div.date-label');
        return (element as HTMLElement).innerText;
    });

    await browser.close();
    return [date, value];
};