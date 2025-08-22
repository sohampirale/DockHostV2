FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN cp .env.exmaple .env

RUN npm run build || true

CMD ["npm","run","start"]