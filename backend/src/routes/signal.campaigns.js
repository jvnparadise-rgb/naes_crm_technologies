const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const DATA_DIR = process.env.SIGNAL_DATA_DIR || path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'signal-campaigns.json');

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ campaigns: [], events: [], suppressions: [] }, null, 2));
  }
}

function readStore() {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (err) {
    return { campaigns: [], events: [], suppressions: [] };
  }
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

const sesClient = new SESClient({ region: process.env.AWS_REGION || 'us-east-1' });

function id(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getPublicBaseUrl(req) {
  return (process.env.SIGNAL_PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildTrackedMessage({ req, messageId, body, links = [] }) {
  const baseUrl = getPublicBaseUrl(req);
  const openPixelUrl = `${baseUrl}/api/signal/campaigns/track/open?mid=${encodeURIComponent(messageId)}`;

  const normalizedLinks = Array.isArray(links) && links.length
    ? links
    : [
        {
          label: 'Learn more',
          url: process.env.SIGNAL_DEFAULT_CTA_URL || 'https://www.naes.com'
        }
      ];

  const trackedLinks = normalizedLinks.map((link) => {
    const destination = String(link.url || '').trim();
    const clickUrl = `${baseUrl}/api/signal/campaigns/track/click?mid=${encodeURIComponent(messageId)}&url=${encodeURIComponent(destination)}`;

    return {
      label: String(link.label || 'Learn more'),
      url: destination,
      click_url: clickUrl
    };
  });

  const escaped = escapeHtml(body);
  const withLineBreaks = escaped.replace(/\n/g, '<br />');

  const linkHtml = trackedLinks
    .map((link) => `<p><a href="${link.click_url}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a></p>`)
    .join('');

  const htmlBody = `${withLineBreaks}<br />${linkHtml}<br /><img src="${openPixelUrl}" width="1" height="1" style="display:none;" alt="" />`;

  return {
    body_text: body,
    body_html: htmlBody,
    open_pixel_url: openPixelUrl,
    tracked_links: trackedLinks
  };
}


function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isSuppressed(store, email) {
  const target = normalizeEmail(email);
  if (!target) return false;
  return (store.suppressions || []).some((item) => normalizeEmail(item.email) === target && item.active !== false);
}

function addSuppression(store, { email, type = 'manual', reason = '', source = 'signal-ui' }) {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  store.suppressions = Array.isArray(store.suppressions) ? store.suppressions : [];

  const existing = store.suppressions.find((item) => normalizeEmail(item.email) === normalized);
  const now = new Date().toISOString();

  if (existing) {
    existing.type = type || existing.type;
    existing.reason = reason || existing.reason;
    existing.source = source || existing.source;
    existing.active = true;
    existing.updated_at = now;
    return existing;
  }

  const suppression = {
    id: id('sup'),
    email: normalized,
    type,
    reason,
    source,
    active: true,
    created_at: now,
    updated_at: now
  };

  store.suppressions.unshift(suppression);
  return suppression;
}



router.get('/readiness', (req, res) => {
  const checks = [
    {
      key: 'tracking',
      label: 'Tracking Active',
      ready: true,
      detail: 'Open and click tracking endpoints are live.'
    },
    {
      key: 'suppression',
      label: 'Suppression Active',
      ready: true,
      detail: 'Suppression guard blocks protected contacts.'
    },
    {
      key: 'public_base_url',
      label: 'Public Tracking URL',
      ready: Boolean(process.env.SIGNAL_PUBLIC_BASE_URL),
      detail: process.env.SIGNAL_PUBLIC_BASE_URL
        ? `Tracking base URL configured: ${process.env.SIGNAL_PUBLIC_BASE_URL}`
        : 'Set SIGNAL_PUBLIC_BASE_URL before live sending.'
    },
    {
      key: 'domain_verified',
      label: 'Domain Verified',
      ready: process.env.SIGNAL_DOMAIN_VERIFIED === 'true',
      detail: 'Outbound sending domain/subdomain must be verified.'
    },
    {
      key: 'email_auth',
      label: 'SPF / DKIM / DMARC',
      ready: process.env.SIGNAL_EMAIL_AUTH_READY === 'true',
      detail: 'DNS authentication must be completed before SES live mode.'
    },
    {
      key: 'live_send',
      label: 'Live Send Enabled',
      ready: process.env.SIGNAL_LIVE_SEND_ENABLED === 'true',
      detail: 'Live send remains locked until all deliverability controls are ready.'
    }
  ];

  const liveReady = checks.every((check) => check.ready === true);

  res.json({
    mode: liveReady ? 'live-ready' : 'safe-mode',
    live_ready: liveReady,
    checks
  });
});

router.get('/health', (req, res) => {
  const store = readStore();
  res.json({
    ok: true,
    service: 'signal-campaigns',
    campaigns: store.campaigns.length,
    events: store.events.length
  });
});

router.get('/', (req, res) => {
  const store = readStore();
  res.json({ campaigns: store.campaigns });
});

router.post('/', express.json({ limit: '1mb' }), (req, res) => {
  const now = new Date().toISOString();
  const body = req.body || {};

  const campaign = {
    id: id('camp'),
    name: String(body.name || 'Untitled Signal Campaign').trim(),
    segment: String(body.segment || 'General').trim(),
    status: String(body.status || 'draft').trim(),
    sequence: Array.isArray(body.sequence) ? body.sequence : [],
    template: body.template || {
      subject: 'Quick question for {{company}}',
      body: 'Hi {{first_name}},\n\nBased on {{signal_insight}}, NAES may be able to help with {{service_fit}}.\n\nWould it make sense to compare notes?\n'
    },
    contacts: [],
    created_at: now,
    updated_at: now
  };

  const store = readStore();
  store.campaigns.unshift(campaign);
  writeStore(store);

  res.status(201).json({ campaign });
});


router.post('/events/log', express.json({ limit: '1mb' }), (req, res) => {
  const store = readStore();
  const now = new Date().toISOString();
  const body = req.body || {};

  const event = {
    id: id('evt'),
    event_type: String(body.event_type || 'unknown'),
    campaign_id: body.campaign_id || null,
    contact_id: body.contact_id || null,
    message_id: body.message_id || null,
    payload: body.payload || {},
    source: body.source || 'signal-ui',
    created_at: now
  };

  store.events = Array.isArray(store.events) ? store.events : [];
  store.events.unshift(event);

  if (['bounced', 'complained', 'unsubscribed'].includes(event.event_type)) {
    addSuppression(store, {
      email: body.email || body.contact_id || body.payload?.email,
      type: event.event_type,
      reason: body.reason || body.payload?.reason || event.event_type,
      source: event.source || 'signal-events'
    });
  }

  writeStore(store);

  res.status(201).json({ event });
});

router.get('/events', (req, res) => {
  const store = readStore();
  const events = Array.isArray(store.events) ? store.events : [];
  res.json({ events: events.slice(0, 250) });
});


router.get('/suppressions', (req, res) => {
  const store = readStore();
  res.json({ suppressions: Array.isArray(store.suppressions) ? store.suppressions : [] });
});

router.post('/suppressions', express.json({ limit: '1mb' }), (req, res) => {
  const store = readStore();
  const suppression = addSuppression(store, {
    email: req.body?.email,
    type: req.body?.type || 'manual',
    reason: req.body?.reason || '',
    source: req.body?.source || 'signal-ui'
  });

  if (!suppression) {
    return res.status(400).json({ error: 'email_required' });
  }

  writeStore(store);
  res.status(201).json({ suppression });
});

router.delete('/suppressions/:email', (req, res) => {
  const store = readStore();
  const target = normalizeEmail(req.params.email);
  const suppression = (store.suppressions || []).find((item) => normalizeEmail(item.email) === target);

  if (!suppression) {
    return res.status(404).json({ error: 'suppression_not_found' });
  }

  suppression.active = false;
  suppression.updated_at = new Date().toISOString();
  writeStore(store);

  res.json({ suppression });
});


router.get('/:campaignId', (req, res) => {
  const store = readStore();
  const campaign = store.campaigns.find((c) => c.id === req.params.campaignId);

  if (!campaign) {
    return res.status(404).json({ error: 'campaign_not_found' });
  }

  res.json({ campaign });
});

router.post('/:campaignId/contacts', express.json({ limit: '2mb' }), (req, res) => {
  const store = readStore();
  const campaign = store.campaigns.find((c) => c.id === req.params.campaignId);

  if (!campaign) {
    return res.status(404).json({ error: 'campaign_not_found' });
  }

  const now = new Date().toISOString();
  const contacts = Array.isArray(req.body?.contacts)
    ? req.body.contacts
    : req.body?.contact
      ? [req.body.contact]
      : [];

  const normalized = contacts.map((contact) => ({
    id: contact.id || id('contact'),
    first_name: contact.first_name || contact.firstName || '',
    last_name: contact.last_name || contact.lastName || '',
    name: contact.name || `${contact.first_name || contact.firstName || ''} ${contact.last_name || contact.lastName || ''}`.trim(),
    title: contact.title || '',
    email: contact.email || '',
    company: contact.company || contact.account || contact.organization || '',
    service_fit: contact.service_fit || contact.serviceFit || '',
    signal_insight: contact.signal_insight || contact.signalInsight || '',
    source: contact.source || 'Apollo',
    status: 'selected',
    added_at: now
  }));

  const existingKeys = new Set(
    campaign.contacts.map((c) => `${String(c.email || '').toLowerCase()}|${String(c.company || '').toLowerCase()}`)
  );

  const added = [];
  for (const contact of normalized) {
    const key = `${String(contact.email || '').toLowerCase()}|${String(contact.company || '').toLowerCase()}`;
    if (!existingKeys.has(key)) {
      campaign.contacts.push(contact);
      existingKeys.add(key);
      added.push(contact);
    }
  }

  campaign.updated_at = now;
  writeStore(store);

  res.status(201).json({
    campaign_id: campaign.id,
    added_count: added.length,
    total_contacts: campaign.contacts.length,
    contacts: campaign.contacts
  });
});





router.get('/track/open', (req, res) => {
  const store = readStore();
  const now = new Date().toISOString();
  const mid = req.query.mid || null;

  const event = {
    id: id('evt'),
    event_type: 'opened',
    message_id: mid,
    source: 'tracking-pixel',
    created_at: now
  };

  store.events.unshift(event);
  writeStore(store);

  // 1x1 transparent pixel
  const img = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
    'base64'
  );

  res.set('Content-Type', 'image/gif');
  res.send(img);
});

router.get('/track/click', (req, res) => {
  const store = readStore();
  const now = new Date().toISOString();

  const mid = req.query.mid || null;
  const url = req.query.url || '/';

  const event = {
    id: id('evt'),
    event_type: 'clicked',
    message_id: mid,
    payload: { url },
    source: 'tracking-click',
    created_at: now
  };

  store.events.unshift(event);
  writeStore(store);

  res.redirect(url);
});

module.exports = router;




router.post('/:campaignId/send', express.json({ limit: '2mb' }), async (req, res) => {
  const store = readStore();
  const campaign = store.campaigns.find(c => c.id === req.params.campaignId);

  if (!campaign) {
    return res.status(404).json({ error: 'campaign_not_found' });
  }

  const mode = String(req.body?.mode || 'safe').toLowerCase();
  const now = new Date().toISOString();

  const template = req.body?.template || campaign.template || {};
  const subject = template.subject || 'Quick question for {{company}}';
  const body = template.body || 'Hi {{first_name}},\n\nBased on {{signal_insight}}, NAES may be able to help with {{service_fit}}.\n';

  const render = (tpl, c) =>
    String(tpl || '')
      .replace(/{{first_name}}/g, c.first_name || '')
      .replace(/{{company}}/g, c.company || '')
      .replace(/{{service_fit}}/g, c.service_fit || '')
      .replace(/{{signal_insight}}/g, c.signal_insight || '');

  const contacts = Array.isArray(campaign.contacts) ? campaign.contacts : [];

  if (mode === 'live') {
    const liveEnabled = process.env.SIGNAL_LIVE_SEND_ENABLED === 'true';
    const fromEmail = process.env.SIGNAL_FROM_EMAIL || '';

    if (!liveEnabled || !fromEmail) {
      return res.status(409).json({
        error: 'live_send_not_enabled',
        message: 'Live SES sending is blocked. Enable SIGNAL_LIVE_SEND_ENABLED and set SIGNAL_FROM_EMAIL.'
      });
    }

    const results = [];

    for (const contact of contacts) {
      if (isSuppressed(store, contact.email)) continue;

      const message_id = id('msg');
      const subjectText = render(subject, contact);
      const bodyText = render(body, contact);

      const tracked = buildTrackedMessage({ req, messageId: message_id, body: bodyText });

      try {
        await sesClient.send(new SendEmailCommand({
          Destination: {
            ToAddresses: [contact.email]
          },
          Source: fromEmail,
          Message: {
              Subject: { Data: subjectText },
              Body: {
                Html: { Data: tracked.body_html },
                Text: { Data: bodyText }
            }
          }
        }));

        const event = {
          id: id('evt'),
          event_type: 'sent',
          campaign_id: campaign.id,
          contact_id: contact.email,
          message_id,
          source: 'signal-ses',
          created_at: new Date().toISOString()
        };

        store.events.unshift(event);

        results.push({
          to: contact.email,
          message_id,
          status: 'sent'
        });

      } catch (err) {
        results.push({
          to: contact.email,
          error: err.message
        });
      }
    }

    writeStore(store);

    return res.json({
      mode: 'live',
      sent_count: results.filter(r => r.status === 'sent').length,
      results
    });
  }

  const blocked = [];
  const allowedContacts = contacts.filter((contact) => {
    if (isSuppressed(store, contact.email)) {
      blocked.push({
        email: contact.email || '',
        reason: 'suppressed'
      });
      return false;
    }
    return true;
  });

  const send_results = allowedContacts.map((contact) => {
    const message_id = id('msg');
    const renderedBody = render(body, contact);
    const tracked = buildTrackedMessage({ req, messageId: message_id, body: renderedBody });

    const payload = {
      to: contact.email || '',
      subject: render(subject, contact),
      body: renderedBody,
      body_html: tracked.body_html,
      open_pixel_url: tracked.open_pixel_url,
      tracked_links: tracked.tracked_links,
      message_id,
      mode: 'safe_simulation',
      delivery_status: 'not_sent'
    };

    const event = {
      id: id('evt'),
      event_type: 'sent_simulated',
      campaign_id: campaign.id,
      contact_id: contact.id || contact.email || null,
      message_id,
      payload,
      source: 'signal-send-engine',
      created_at: now
    };

    store.events = Array.isArray(store.events) ? store.events : [];
    store.events.unshift(event);

    return payload;
  });

  campaign.last_send_mode = 'safe';
  campaign.last_send_preview_at = now;
  campaign.updated_at = now;

  writeStore(store);

  res.json({
    mode: 'safe',
    campaign_id: campaign.id,
    sent_count: send_results.length,
    blocked_count: blocked.length,
    blocked,
    send_results
  });
});

router.post('/:campaignId/send-preview', (req, res) => {
  const store = readStore();
  const campaign = store.campaigns.find(c => c.id === req.params.campaignId);

  if (!campaign) {
    return res.status(404).json({ error: 'campaign_not_found' });
  }

  const template = campaign.template || {};
  const subject = template.subject || '';
  const body = template.body || '';

  const render = (tpl, c) =>
    tpl
      .replace(/{{first_name}}/g, c.first_name || '')
      .replace(/{{company}}/g, c.company || '')
      .replace(/{{service_fit}}/g, c.service_fit || '')
      .replace(/{{signal_insight}}/g, c.signal_insight || '');

  const preview = (campaign.contacts || []).map(c => {
    const message_id = id('msg');
    const renderedBody = render(body, c);
    const tracked = buildTrackedMessage({ req, messageId: message_id, body: renderedBody });

    return {
      to: c.email,
      subject: render(subject, c),
      body: renderedBody,
      body_html: tracked.body_html,
      open_pixel_url: tracked.open_pixel_url,
      tracked_links: tracked.tracked_links,
      message_id
    };
  });

  res.json({ preview });
});
