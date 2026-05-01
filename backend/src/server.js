const { app } = require('./app');
const { env } = require('./config/env');
const signalZoomInfoRoutes = require('./routes/signal.zoominfo');
const adminUsersRoutes = require('./routes/adminUsers');
const signalCampaignRoutes = require('./routes/signal.campaigns');

app.use('/api/signal/zoominfo', signalZoomInfoRoutes);
app.use('/api/signal/campaigns', signalCampaignRoutes);
app.use('/api/admin-users', adminUsersRoutes);


app.listen(env.port, () => {
  console.log(`NAES CRM backend listening on port ${env.port}`);
});

