#!/bin/sh

docker rm foggy 

./refresh.sh && ./deploy.sh