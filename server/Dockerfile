FROM node:lts-alpine

RUN mkdir -p /home/node/server/node_modules && chown -R node:node /home/node/server

WORKDIR /home/node/server

COPY package.json yarn.* ./

USER node

RUN yarn

COPY --chown=node:node . .

CMD ["yarn", "dev"]

EXPOSE 3000
