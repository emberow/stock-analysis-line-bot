// 取得大盤融資維持率

import { chromium } from "playwright";

export const crawler = async () => {
    const browser = await chromium.launch({ headless: true }); // 启动浏览器
    const page = await browser.newPage();
    
    await page.goto('https://www.macromicro.me/charts/53117/taiwan-taiex-maintenance-margin'); // 打开网页
    console.log("Landed on page")

    await page.screenshot({ path: '/pics/screenshot.png', fullPage: true });
    console.log("screanshot created")

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
