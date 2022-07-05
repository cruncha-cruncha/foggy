#!/bin/sh

# This file is meant to be run from a docker container

# echo on
set -x

# --- backend section ---
cd ./backend

if [ -z $CITY ]; then
    exit 1
elif [ -z $WEATHER_API_LOCATION ]; then
    exit 1
elif [ -z $WEATHER_API_KEY ]; then
    exit 1
fi

./main
# --- end backend section ---

cd ..

cp ./backend/output.json ./frontend/content/weather.json

# --- frontend section ---
cd ./frontend

WANT_NODE_VERSION=$(cat .nvmrc | cut -d '.' -f 1,2)
HAVE_NODE_VERSION=$(node --version | grep -oE "v[0-9]+\.[0-9]+")
if [ $WANT_NODE_VERSION != $HAVE_NODE_VERSION ]; then 
    exit 1
fi

npm run build
# --- end frontend section ---

