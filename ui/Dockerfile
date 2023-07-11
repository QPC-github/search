FROM node:18

COPY . /app/

WORKDIR /app

RUN npm ci && npm run build

EXPOSE 3000

CMD ["node", "./output/server/index.mjs"]
