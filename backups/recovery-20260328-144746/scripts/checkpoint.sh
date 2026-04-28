#!/bin/bash
set -e

MESSAGE="$1"

if [ -z "$MESSAGE" ]; then
  echo "Usage: ./scripts/checkpoint.sh \"your checkpoint message\""
  exit 1
fi

printf '\033[1;92m=========== CHECKPOINT START ===========\033[0m\n'
pwd
git status --short || true

git add -A

if git diff --cached --quiet; then
  echo "No changes to commit."
  printf '\033[1;92m=========== CHECKPOINT END ===========\033[0m\n'
  exit 0
fi

git commit -m "checkpoint: $MESSAGE"
git push origin main

printf '\n--- latest commit ---\n'
git log --oneline -1
printf '\033[1;92m=========== CHECKPOINT END ===========\033[0m\n'
