#!/usr/bin/env bash
set -e
npm run build
cd admin
touch .nojekyll
git init
git add -A
git commit -m 'deploy'
git push -f "https://${access_token}@gitee.com/suisung/shopsuite-admin.git" master:gh-pages
start "https://gitee.com/suisung/shopsuite-admin"
cd -
exec /bin/bash
