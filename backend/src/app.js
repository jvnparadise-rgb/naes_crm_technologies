const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pinoHttp = require('pino-http');

const { env } = require('./config/env');
const { attachCurrentUser } = require('./middleware/auth');
const healthRouter = require('./routes/health');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const accountsRouter = require('./routes/accounts');
const contactsRouter = require('./routes/contacts');
const opportunitiesRouter = require('./routes/opportunities');
const tasksRouter = require('./routes/tasks');
const activitiesRouter = require('./routes/activities');
const profileRouter = require('./routes/profile');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(pinoHttp({ level: env.logLevel }));
app.use(attachCurrentUser);

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'naes-crm-backend',
    message: 'Backend scaffold is running',
  });
});

app.use('/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/opportunities', opportunitiesRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/profile', profileRouter);

app.use((err, _req, res, _next) => {
  console.error('FULL ERROR:', err);

  res.status(500).json({
    ok: false,
    error: err?.message || 'Internal server error',
    stack: err?.stack || null,
  });
});

module.exports = { app };
