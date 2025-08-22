FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env.exmaple .env

RUN npm run build || true

CMD ["npm","run","start"]