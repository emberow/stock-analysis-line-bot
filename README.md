# stock analysis line bot

## Introduction

<p>This line bot can analyze stocks using technical analysis</p>

## Features

- **Enter a stock symbol and get technical analysis indicators.**
- **Fetch overall economic indicators every morning at 9 a.m. to assist in making judgments.**

<img src="https://github.com/emberow/blog-image/blob/main/BlogImg/stock-analyze%20demo.gif?raw=true"  style="width: 40vw;" > <br>

### Technical analysis indicators
- KD
- RSI
- MA (MoveAverage)
- BollingerBand

## Quick start 


### Backend
```
# use node 21
$ npm i
$ export CHANNEL_ACCESS_TOKEN=xxx
$ export CHANNEL_SECRET=xxx
$ npm run start
```

### Run ngrok
```
$ ngrok config add-authtoken {your ngrok auth token}
$ ngrok http 3000
```

### Line develop
```
https://developers.line.biz/console/
Use ngrok fordwarding URL as webhook URL, and then paste it into line develop
```

## 策略
原本策略為定期定額買入大盤，以獲取平均市場報酬。
使用爬蟲每天進行數據撈取，並使用以下指標，來進行擇時買入，以獲取超越大盤報酬。

### [美國-S&P 500席勒通膨調整後本益比](https://www.macromicro.me/collections/34/us-stock-relative/410/us-sp500-cyclically-adjusted-price-earnings-ratio)

Robert Shiller（2013 年諾貝爾經濟學獎得主、耶魯大學教授，著有非理性繁榮）提出的 Shiller 週期性調整本益比 ，是將一般的本益比透過過去 10 年的通貨膨脹與季節因子調整，可以反映較為實質的股價評價。

### [美國-CNN恐懼與貪婪指數](https://www.macromicro.me/collections/34/us-stock-relative/50108/cnn-fear-and-greed)

CNN 恐懼與貪婪指數為採用美股市場情緒相關變數所編製的綜合指標，其中變數包括：市場動能、股價強度、股價廣度、 Put/Call Ratio 、市場波動、避險需求、垃圾債券需求。該指數計算這些單獨的變數偏離其平均值的程度，並賦予相同權重。其中 100 代表市場最貪婪，0 代表市場最恐懼。

### [VIX 指數](https://www.macromicro.me/charts/47/vix)

此指標反映 S&P 500 指數期貨的波動程度，測量未來 30 天市場預期的波動程度。

通常 VIX 指數超過 40 時，表示市場對未來出現非理性恐慌；低於 15 時，則出現非理性繁榮的預期。

### [美國-AAII 散戶投資人情緒指數](https://www.macromicro.me/charts/20828/us-aaii-sentimentsurvey)

其調查方式只詢問 AAII 會員投資人一個問題：是否認為未來六個月的股市方向是向上（看多），沒有變化（持平）或下降（看空）。 AAII 於 1987 年開始進行投資人情緒調查，原先透過明信片郵寄方式，目前則是利用網路投票。

根據過去經驗，這項指標被許多人視為市場的反向指標。舉例來說：過度看空的狀況出現時常伴隨著落底訊號；相對地，當看多情緒開始增加到高點時，股市多會出現修正。

### [台灣-台股本益比與台股趨勢](https://www.macromicro.me/charts/13940/tai-wan-tai-gu-ben-yi-bi-yu-tai-gu-qu-shi)

大盤PE長期區間15-20
選擇低於大盤本益比且無衰退的企業個股，如果此公司的盈餘目前處於成長狀態，那麼就更具安全邊際。

### [景氣燈號](https://index.ndc.gov.tw/n/zh_tw)

台灣景氣對策燈號
- 9-16  藍燈
- 17-22 黃藍燈
- 23-31 黃燈
- 32-37 黃紅燈
- 38-45 紅燈

### [台灣-大盤融資維持率](https://www.macromicro.me/charts/53117/taiwan-taiex-maintenance-margin)

融資維持率為券商借款給投資人買股時，為了減少行情波動大時投資人無法還款的狀況所設的保護機制。股價的上下漲跌將影響融資維持率的高低，當股價下跌時，融資維持率降低，而當減少至一定比例時券商則會通知投資人補錢。

當大盤的整體融資維持率降至一定低點時，代表目前大盤可能出現不理性的賣壓或斷頭潮，通常為股市的相對低點。

### [台灣-未完成訂單減客戶存貨](https://www.macromicro.me/charts/5479/tw-backlog-of-orders-customers-invertories)

台灣製造業採購經理人指數（PMI）中的未完成訂單與客戶存貨兩大指數，可能用判斷企業補庫存動能，「未完成訂單」為考量產能與新接訂單下，尚未完成交貨的部分，「客戶存貨」則是指已銷售給客戶的完成品存貨，均以 50 作為分界點， 50 以上代表擴張， 50 以下代表衰退。

### [台灣-PMI製造業指數](https://www.macromicro.me/collections/16/tw-industry-relative/126/tw-pmi)

台灣製造業採購經理人指數（Manufacturing Purchasing Managers’Index，PMI）為一企業商業活動綜合性指標，具有即時發布及領先景氣循環轉折點等特性，每月對受訪企業的採購經理人進行調查，並依調查結果編製成的指數，以新增訂單數量、生產數量、人力僱用數量、存貨，以及供應商交貨時間等 5 項細項擴散指數（Diffusion Index）綜合編製而成 ，均以 50 作為分界點， 50 以上代表景氣擴張， 50 以下代表景氣衰退。
其中製造業 PMI 又分為六大產業，包括電子暨光學產業、基礎原物料產業、電力暨機械設備產業、化學暨生技醫療產業、食品暨紡織產業、交通工具產業

### [台股預估成交量](https://www.wantgoo.com/index/0000)

- 上漲時成交量大 => 多頭氣勢強、買盤積極，續漲機率高
- 上漲時成交量小 => 買盤不積極，漲勢可能乏力，需小心假突破或主力拉高出貨
- 下跌時成交量大 => 出現恐慌性賣壓，也可能是主力承接，短期底部訊號
- 下跌時成交量小 => 市場觀望、信心不足，沒有人願意低接，可能繼續下跌或橫盤整理
