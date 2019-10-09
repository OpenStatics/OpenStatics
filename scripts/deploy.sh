#!/bin/bash

# set pipefail 
set -e 

# create production build and all the programming tricks here
function buildProd {
    npm run build
    # later add codes for testing
}

# set variables
REPO="https://github.com/OpenStatics/openstatics.github.io.git"
SSH_REPO=${REPO/https:\/\/github.com\//git@github.com:}
TARGET_BRANCH="master"

# establish fresh connection to github.io repo
git clone $REPO tempfolder
cd tempfolder
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH

# delete everthing excepy .git for latter overwritten
find -maxdepth 1 ! -name .git ! -name . | xargs rm -rf
cd ..


# call function
buildProd

# move production package to the folder
cp -rf dist/* tempfolder/

cd tempfolder

echo "in temp folder"

# set necessary envs
git config --global user.name "Circle CI"
git config --global user.email "$COMMIT_AUTHOR_EMAIL"


# if there is no change, exit
if git diff --quiet; then
    echo "No Changes Have Been Made. EXIT with 0"
    exit 0
fi

# wrap up and push to repo
git add -A .
git commit -m 'Deploy to GitHub'

git push $SSH_REPO $TARGET_BRANCH
