#!/usr/bin/env bash
set -euo pipefail

printf '\033[1;96m=========== RUN ON EC2 : NAES CRM BACKEND START ===========\033[0m\n'

cd /home/ec2-user/naes-crm-backend/backend || exit 1

printf '\n--- install dependencies ---\n'
npm install

printf '\n--- verify environment file ---\n'
ls -l .env

printf '\n--- stop any prior manual backend ---\n'
pkill -f 'node src/server.js' 2>/dev/null || true

printf '\n--- start production mode manually for validation ---\n'
nohup npm run start:prod </dev/null > /tmp/naes-crm-backend.log 2>&1 &
disown || true
sleep 5

printf '\n--- listener check ---\n'
lsof -iTCP:4000 -sTCP:LISTEN || true

printf '\n--- health check ---\n'
curl -s http://127.0.0.1:4000/health || true

printf '\n--- log tail ---\n'
tail -n 80 /tmp/naes-crm-backend.log || true

printf '\033[1;96m=========== RUN ON EC2 : NAES CRM BACKEND END ===========\033[0m\n'
