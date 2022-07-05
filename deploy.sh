#!/bin/sh

# This file is meant to be run from a docker container

# echo on
set -x

# we're working in the frontend
cd ./frontend

# --- git section ---
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
git pull origin gh-pages
# --- end git section ---

# --- Node section ---
WANT_NODE_VERSION=$(cat .nvmrc | cut -d '.' -f 1,2)
HAVE_NODE_VERSION=$(node --version | grep -oE "v[0-9]+\.[0-9]+")
if [ $WANT_NODE_VERSION != $HAVE_NODE_VERSION ]; then 
    exit 1
fi

npm run deploy
# --- end Node section ---