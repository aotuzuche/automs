#!/bin/bash

echo 'publish with proxy:'
git config --global https.https://github.com.proxy socks5://127.0.0.1:10081
git config --global https.https://github.com.proxy
./node_modules/lerna/cli.js publish
git config --global --unset https.https://github.com.proxy
