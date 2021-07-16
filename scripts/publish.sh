#!/bin/bash

echo 'publish:'
git config --global https.proxy socks5://127.0.0.1:10081
git config --global https.proxy
./node_modules/lerna/cli.js publish
git config --global --unset https.proxy
