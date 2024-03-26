# stock analysis line bot

## Introduction

<p>This line bot can analyze stocks using technical analysis</p>

## Features

- **Enter a stock symbol and get technical analysis indicators**

<img src="https://github.com/emberow/blog-image/blob/main/BlogImg/stock-analyze%20demo.gif?raw=true"  style="width: 40vw;" > <br>

### technical analysis indicators
- Kd
- RSI
- MA (MoveAverage)
- BollingerBand

## Quick start 


### run backend
```
# use node 21
$ cd backend
$ npm i
$ export CHANNEL_ACCESS_TOKEN=xxx
$ export CHANNEL_SECRET=xxx
$ npm run start
```

### run ngrok
```
$ ngrok config add-authtoken {your ngrok auth token}
$ ngrok http 3000
```

### Line develop
```
https://developers.line.biz/console/
Use ngrok fordwarding URL as webhook URL, and then paste it into line develop
```
