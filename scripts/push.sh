#!/bin/bash

echo 'push with proxy:'
git config --global https.https://github.com.proxy socks5://127.0.0.1:10081
git config --global https.https://github.com.proxy
git push
git config --global --unset https.https://github.com.proxy
