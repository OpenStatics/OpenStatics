#!/bin/bash

cd ~/OpenStatics
git pull
npm run build
fuser 5000/tcp
serve -s dist
