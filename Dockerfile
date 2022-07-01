# syntax=docker/dockerfile:1


FROM node:16.15-bullseye AS big-node

# npm install
COPY ./frontend/package.json        ./frontend/
RUN cd ./frontend && npm i

FROM golang:1.18-bullseye AS golang

FROM node:16.15-bullseye-slim

# idk
WORKDIR /app 

# copy npm i from big-node
COPY --from=big-node ./frontend/node_modules/ ./frontend/node_modules/

# install Golang lol
COPY --from=golang /usr/local/go/ /usr/local/go/
ENV PATH="/usr/local/go/bin:${PATH}"

# get git
RUN apt-get update -y && apt-get install -y git

# copy go stuff
COPY ./backend/constants/       ./backend/constants/
COPY ./backend/helpers/         ./backend/helpers/
COPY ./backend/providers/       ./backend/providers/
COPY ./backend/types/           ./backend/types/
COPY ./backend/go.mod           ./backend/
COPY ./backend/main.go          ./backend/

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

# docker build -t foggy/foggy .
# docker run --name="foggy" --env-file="./.env" foggy/foggy 