FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN cp .env.example .env

RUN npm run build || true

CMD ["node","dist/index.js"]
