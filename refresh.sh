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

cd ..
# --- end backend section ---

cp ./backend/output.json ./frontend/content/weather.json
