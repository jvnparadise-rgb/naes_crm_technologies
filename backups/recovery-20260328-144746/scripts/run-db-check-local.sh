#!/bin/bash
set -e
printf '\033[1;92m=========== LOCAL DB CHECK START ===========\033[0m\n'
cd "$(dirname "$0")/.." || exit 1
npm run invoke:db-check
printf '\033[1;92m=========== LOCAL DB CHECK END ===========\033[0m\n'
