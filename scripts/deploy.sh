#!/bin/bash

# dummy deploy
set -e 

function buildProd {
    npm run build
}

buildProd

git config --global user.name "Circle CI"
git config --global user.email "$COMMIT_AUTHOR_EMAIL"

REPO="https://github.com/OpenStatics/openstatics.github.io"
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
TARGET_BRANCH="master"

git add dist/

git commit -m 'Deploy to GitHub'

git push $SSH_REPO $TARGET_BRANCH
