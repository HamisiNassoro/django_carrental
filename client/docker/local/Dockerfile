ARG NODE_VERSION=18-alpine

FROM node:${NODE_VERSION} as node

FROM node as client-local-build

ARG APP_HOME=/app

WORKDIR ${APP_HOME}

COPY ./package*.json .

RUN npm install

COPY . ${APP_HOME}

# Set permissions to avoid permission issues
RUN mkdir -p ${APP_HOME}/node_modules/.cache && chmod -R 777 ${APP_HOME}/node_modules

CMD ["npm","start"]