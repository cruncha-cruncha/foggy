# syntax=docker/dockerfile:1

# ----- NODE BUILDER -----
FROM node:16.15-bullseye AS big-node

WORKDIR /node-app 

COPY ./frontend/package.json ./frontend/
RUN cd ./frontend && npm i
# ----- NODE BUILDER -----

# ----- GOLANG BUILDER -----
FROM golang:1.18-bullseye AS golang

WORKDIR /golang-app 

COPY ./backend/constants/   ./backend/constants/
COPY ./backend/helpers/     ./backend/helpers/
COPY ./backend/providers/   ./backend/providers/
COPY ./backend/types/       ./backend/types/
COPY ./backend/go.mod       ./backend/
COPY ./backend/main.go      ./backend/

RUN cd ./backend && go build main.go
# ----- GOLANG BUILDER -----

FROM node:16.15-bullseye-slim

WORKDIR /app

# copy npm i from big-node
COPY --from=big-node ./node-app/frontend/node_modules/ ./frontend/node_modules/

# copy backend executable from golang
COPY --from=golang ./golang-app/backend/main ./backend/
RUN chmod +x ./backend/main

# get git
RUN apt-get update -y && apt-get install -y git

# copy gatsby stuff
COPY ./frontend/schemas/            ./frontend/schemas/
COPY ./frontend/src/                ./frontend/src/
COPY ./frontend/schemas/            ./frontend/schemas/
COPY ./frontend/content/            ./frontend/content/
COPY ./frontend/.nvmrc              ./frontend/
COPY ./frontend/gatsby-config.ts    ./frontend/
COPY ./frontend/tsconfig.json       ./frontend/
COPY ./frontend/package.json        ./frontend/

# copy scripts
COPY ./refresh.sh ./
COPY ./deploy.sh  ./
COPY ./ENGAGE.sh  ./
COPY ./.env       ./

# engage
RUN chmod +x ./refresh.sh
RUN chmod +x ./deploy.sh
RUN chmod +x ./ENGAGE.sh

ENTRYPOINT ["./ENGAGE.sh"]

# docker build --platform linux/arm/v7 -t username/repo .
# docker run --name foggy --env-file=".env" username/repo 