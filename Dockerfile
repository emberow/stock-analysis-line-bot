FROM --platform=linux/amd64 node:20 AS build_amd64
FROM build_amd64 AS build

WORKDIR /app

COPY ./package*.json ./

RUN npm i 
RUN npx playwright install --with-deps chromium
RUN apt install xauth -y

COPY . .

EXPOSE 3000/tcp

CMD ["npm", "run", "start"]