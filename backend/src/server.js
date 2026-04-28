const { app } = require('./app');
const { env } = require('./config/env');

app.listen(env.port, () => {
  console.log(`NAES CRM backend listening on port ${env.port}`);
});

app.use('/api/admin-users', require('./routes/adminUsers'));
