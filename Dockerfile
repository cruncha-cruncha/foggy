# syntax=docker/dockerfile:1

FROM golang:1.18-bullseye AS golang
  
FROM node:16.15-bullseye

# install Golang lol
COPY --from=golang /usr/local/go/ /usr/local/go/
ENV PATH="/usr/local/go/bin:${PATH}"

# idk
WORKDIR /app 

# copy go stuff
COPY ./backend/constants/*      ./backend/constants/
COPY ./backend/helpers/*        ./backend/helpers/
COPY ./backend/providers/*      ./backend/providers/
COPY ./backend/types/*          ./backend/types/
COPY ./backend/go.mod           ./backend/
COPY ./backend/main.go          ./backend/

# copy gatsby stuff
COPY ./frontend/schemas/*           ./frontend/schemas/
COPY ./frontend/src/*               ./frontend/src/
COPY ./frontend/schemas/*           ./frontend/schemas/
COPY ./frontend/content/*           ./frontend/content/
COPY ./frontend/.nvmrc              ./frontend/
COPY ./frontend/gatsby-config.ts    ./frontend/
COPY ./frontend/package.json        ./frontend/
COPY ./frontend/tsconfig.json       ./frontend/

# copy scripts
COPY ./refresh.sh ./
COPY ./deploy.sh  ./

# engage
RUN cd ./frontend && npm i
RUN chmod +x ./refresh.sh
RUN chmod +x ./deploy.sh
ENTRYPOINT ["./refresh.sh && ./deploy.sh"]

# docker build -t foggy/foggy .
# docker run --env-file ./frontend/.env foggy/foggy 

# jessie/stretch/buster/bullseye = debian versions (oldest/old/newer/newest)
# slim = slim
# alpine = based on alpine linux which is a slim version of linux
# windowsservercore = can run windows
