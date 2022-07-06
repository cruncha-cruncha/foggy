#!/bin/sh

# This file is meant to be run from a docker container

# echo on
set -x

# --- git pull section ---
if [ -z $GIT_NAME ]; then
    exit 1
elif [ -z $GIT_EMAIL ]; then
    exit 1
elif [ -z $GIT_ORIGIN_URL ]; then
    exit 1
fi

git config --global init.defaultBranch main
git init
git config --local user.name $GIT_NAME
git config --local user.email $GIT_EMAIL
git remote add origin $GIT_ORIGIN_URL
git config pull.rebase false
git fetch origin netlify
git reset --hard origin/netlify
# --- end git pull section ---

# --- backend section ---
if [ -z $CITY ]; then
    exit 1
elif [ -z $WEATHER_API_LOCATION ]; then
    exit 1
elif [ -z $WEATHER_API_KEY ]; then
    exit 1
fi

./backend./main
# --- end backend section ---

cp ./backend/output.json ./frontend/content/weather.json

# --- git push section ---
git add ./frontend/content/weather.json
git status
# git commit -m "Update"
# git push
# --- end git push section ---