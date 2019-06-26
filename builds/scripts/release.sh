#!/bin/bash

# testing before publish
npm run lint && npm run build #&& npm run test

if [ $? = 0 ]; then
  # purge dist
  rm -fr dist

  export NODE_ENV=production
  export BABEL_ENV=production

  # babel transform es6 into es5
  babel src --out-dir dist/npm/es5/src 
  babel libs --out-dir dist/npm/es5/libs 
  babel builds/npm/index.js --out-file dist/npm/es5/index.js 

  # keep es6 for next.js
  # babel src --out-dir dist/npm/es6/src --copy-files
  # babel libs --out-dir dist/npm/es6/libs --copy-files
  # cp builds/npm/next.js dist/npm/next.es6.js

  # copy package.json
  TMP=$(mktemp)
  PACKAGE_VERSION=$(cat package.json | jq '.version' | sed 's/[",]//g')
  PACKAGE_DEPENDENCIES=$(cat package.json | jq -c '.dependencies')
  cat builds/npm/package.json | 
    jq 'to_entries | 
        map(if .key == "version"
            then . + {"value": '\""$PACKAGE_VERSION"\"'}
            elif .key == "dependencies"
            then . + {"value": '"$PACKAGE_DEPENDENCIES"'}
            else .
            end
        ) |
        from_entries' > "$TMP" && mv -f "$TMP" dist/npm/package.json

  # copy README.md
  cp README.md dist/npm/README.md    

  # publish
  yarn publish dist/npm --new-version "$PACKAGE_VERSION"

else
  echo 'Code cant be verify, plz check ~'
fi