FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY . .

COPY .env.example .env

ENV NEXT_PUBLIC_MAIN_SERVER_URL "http://mainservercontainer:3000"

RUN npm run build || true

CMD ["npm","run","start"]
