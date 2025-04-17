FROM --platform=linux/amd64 node:20 AS build_amd64
FROM build_amd64 AS build

WORKDIR /app

COPY ./package*.json ./

RUN npm i 
RUN apt-get update
RUN apt-get install -y xauth
RUN apt-get install -y xvfb

COPY . .

EXPOSE 3000/tcp

# 使用 xvfb 運行應用，支持有頭模式
CMD ["xvfb-run", "--server-args", "-screen 0 1920x1080x24", "npm", "run", "start"]