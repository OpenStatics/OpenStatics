#!/bin/bash

# dummy deploy
set -e 

function buildProd {
    npm run build
}



REPO="https://github.com/OpenStatics/openstatics.github.io.git"
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
TARGET_BRANCH="master"


git clone $REPO tempfolder

cd tempfolder
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH
find -maxdepth 1 ! -name .git ! -name . | xargs rm -rf
cd ..

buildProd

cp -rf dist/* tempfolder/

cd tempfolder

echo "in temp folder"

git config --global user.name "Circle CI"
git config --global user.email "$COMMIT_AUTHOR_EMAIL"


git add -A .

git commit -m 'Deploy to GitHub'

echo "$COMMIT_AUTHOR_EMAIL"

git push $SSH_REPO $TARGET_BRANCH
