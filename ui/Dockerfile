FROM node:18

COPY . /app/
COPY ./output /app/.output

WORKDIR /app

# RUN npm ci

EXPOSE 3000

CMD ["node", "./output/server/index.mjs"]
