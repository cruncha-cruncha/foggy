# syntax=docker/dockerfile:1

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

# copy backend executable from golang
COPY --from=golang ./golang-app/backend/main ./backend/
RUN chmod +x ./backend/main

# get git
RUN apt-get update -y && apt-get install -y git

# copy scripts
COPY ./ENGAGE.sh    ./
COPY ./.env         ./

# engage
RUN chmod +x ./ENGAGE.sh

ENTRYPOINT ["./ENGAGE.sh"]

# docker build --platform linux/arm/v7 -t username/repo .
# docker run --rm --name foggy --env-file=".env" username/repo 