#!/bin/sh

# This file is meant to be run from a docker container

# echo on
set -x

# --- git section ---
git add ./frontend/content/weather.json
git commit -m "Update"
git push
# --- end git section ---