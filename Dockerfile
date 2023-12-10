FROM node:18-alpine

RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn run check

RUN yarn run build

ENV PORT=80 NODE_ENV=production

EXPOSE 80

CMD [ "node", "build" ]