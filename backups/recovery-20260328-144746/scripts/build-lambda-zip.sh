#!/bin/bash
set -e

printf '\033[1;92m=========== BUILD LAMBDA ZIP START ===========\033[0m\n'
cd "$(dirname "$0")/.." || exit 1
pwd

rm -f naes-crm-backend-lambda.zip

zip -r naes-crm-backend-lambda.zip \
  package.json \
  package-lock.json \
  node_modules \
  src \
  >/dev/null

printf '\n--- zip file ---\n'
ls -lh naes-crm-backend-lambda.zip

printf '\n--- zip contents sample ---\n'
unzip -l naes-crm-backend-lambda.zip | sed -n '1,40p'

printf '\033[1;92m=========== BUILD LAMBDA ZIP END ===========\033[0m\n'
