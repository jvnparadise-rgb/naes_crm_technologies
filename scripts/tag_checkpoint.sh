#!/bin/bash
set -e

TAG_NAME="$1"
TAG_MESSAGE="$2"

if [ -z "$TAG_NAME" ] || [ -z "$TAG_MESSAGE" ]; then
  echo "Usage: ./scripts/tag_checkpoint.sh <tag-name> \"tag message\""
  exit 1
fi

printf '\033[1;92m=========== TAG CHECKPOINT START ===========\033[0m\n'
pwd
git status --short || true
git tag -a "$TAG_NAME" -m "$TAG_MESSAGE"
git push origin "$TAG_NAME"

printf '\n--- tags ---\n'
git tag --list | tail -20
printf '\033[1;92m=========== TAG CHECKPOINT END ===========\033[0m\n'
