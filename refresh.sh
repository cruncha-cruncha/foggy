#!/bin/sh

# echo on
set -x

# --- Golang section ---
cd ./backend

if ! go version; then
    exit 1
fi

WANT_GO_VERSION=$(cat go.mod | awk '/go/ {print $2}' | cut -d '.' -f 1,2)
HAVE_GO_VERSION=$(go version | grep -oE "[0-9]+\.[0-9]+")
if [ $WANT_GO_VERSION != $HAVE_GO_VERSION ]; then 
    exit 1
fi

go run main.go
# --- end Golang section ---

cd ..

cp ./backend/output.json ./frontend/content/weather.json

# --- Node section ---
cd ./frontend

if ! node --version; then
    exit 1
fi

WANT_NODE_VERSION=$(cat .nvmrc | cut -d '.' -f 1,2)
HAVE_NODE_VERSION=$(node --version | grep -oE "v[0-9]+\.[0-9]+")
if [ $WANT_NODE_VERSION != $HAVE_NODE_VERSION ]; then 
    exit 1
fi

npm run pre-deploy
# --- end Node section ---

