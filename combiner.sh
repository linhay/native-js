#!/usr/bin/env bash
cat ./source/*.js > temp.js
babel temp.js -o native.js
rm temp.js