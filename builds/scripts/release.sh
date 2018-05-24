#!/bin/bash

# set ORIGIN to current git origin
ORIGIN=$(git remote -v | awk '$1=="origin" && $3=="(push)" {print $2}');
VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g');

# target folder: /dist/site, make it clean and step into
rm -fr dist
mkdir dist dist/gh-pages
cd dist/gh-pages

# init an empty git repo, checkout branch gh-pages
git init
git remote add origin $ORIGIN
git fetch
git checkout -t origin/gh-pages

# run the site build script
rm -r *
yarn run build

# copy site to gh-pages folder
cp -r ../site/* .

# commit and push to gh-pages
 git add . -A
 git commit -m "$VERSION"
 git push