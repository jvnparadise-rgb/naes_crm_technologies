#!/bin/bash
set -e
printf '\033[1;92m=========== LOCAL HEALTH START ===========\033[0m\n'
cd "$(dirname "$0")/.." || exit 1
npm run invoke:health
printf '\033[1;92m=========== LOCAL HEALTH END ===========\033[0m\n'
