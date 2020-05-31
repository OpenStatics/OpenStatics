#!/bin/bash

cd ~/OpenStatics
git pull
npm run build
fuser 5000/tcp
tmux new -s deploy
sleep 2
tmux attach -t deploy
serve -s dist
