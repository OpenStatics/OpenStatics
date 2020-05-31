#!/bin/bash

cd ~/OpenStatics
git pull
npm run build
fuser 5000/tcp
tmux new -s deploy
serve -s dist

