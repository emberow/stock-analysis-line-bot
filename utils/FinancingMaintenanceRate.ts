import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";

const COOKIE_FILE_PATH = path.resolve(__dirname, "cookies.json");

export const crawler = async () => {
    const browser = await chromium.launch({ headless: false }); // Launch browser
    const context = await browser.newContext();

    // Load cookies if the file exists
    if (fs.existsSync(COOKIE_FILE_PATH)) {
        const cookies = JSON.parse(fs.readFileSync(COOKIE_FILE_PATH, "utf-8"));
        await context.addCookies(cookies); // Load cookies into the browser context
        console.log("Cookies loaded from file.");
    } else {
        console.log("No cookies file found. Proceeding without cookies.");
    }

    const page = await context.newPage();
    await page.goto('https://www.macromicro.me/charts/53117/taiwan-taiex-maintenance-margin'); // Open webpage

    // Save the latest cookies to the file (always save cookies, even if the file didn't exist before)
    const cookies = await context.cookies();
    fs.writeFileSync(COOKIE_FILE_PATH, JSON.stringify(cookies, null, 2), "utf-8");
    console.log("Cookies saved to file.");

    const res = await page.evaluate(() => {
        const scriptContent = [...document.querySelectorAll('script')]
            .map(script => script.innerText)
            .find(content => content.includes('let chart ='));

        const match = scriptContent && scriptContent.match(/let chart = ({[\s\S]*?});/);
        if (match && match[1]) {
            const chart = JSON.parse(match[1]);
            const seriesData = JSON.parse(chart.series_last_rows.replace(/&quot;/g, '"'));
            const targetData = seriesData[0][1];
            return targetData;
        }

        return null;
    });

    await browser.close();
    return res;
};