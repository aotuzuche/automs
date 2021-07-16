#!/bin/bash

echo 'push with proxy:'
git config --global https.proxy socks5://127.0.0.1:10081
git config --global https.proxy
git push
git config --global --unset https.proxy
