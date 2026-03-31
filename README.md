# NAES CRM Backend

Greenfield backend for the NAES CRM AWS-native stack.

## Source of truth
This local repository is the source of truth for backend code, configuration, and deployment packaging.

## Working rules
- Work from local files first
- Make frequent Git commits
- Create milestone tags at major checkpoints
- Push to a remote backup when available
- Do not make major changes without a checkpoint first

## Runtime modes

### Local development
```bash
cd backend
npm run dev
```

### Local production-style start
```bash
cd backend
npm run start:prod
```

### Health check
```bash
cd backend
npm run health
```

## EC2 runtime guidance

Use a single managed process owner in production. Do not mix manual `node src/server.js` launches with other supervisors.

Recommended production pattern:
- install dependencies in `backend/`
- place production environment values in `backend/.env`
- run with a system-managed service
- validate `http://127.0.0.1:4000/health`

A starter systemd unit is provided at:

```bash
backend/deploy/systemd/naes-crm-backend.service
```
