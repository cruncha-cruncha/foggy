#!/bin/sh

# This file is meant to be run from a docker container

# echo on
set -x

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
git pull origin netlify
git checkout netlify
# --- end git section ---