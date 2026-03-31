import React, { useEffect, useMemo, useState } from 'react';

const sidebarSections = [
  {
    title: 'Overview',
    items: ['Welcome', 'Dashboard', 'My Pipeline', 'Pipeline Rollup', 'Revenue Command Center', 'Business Reviews']
  },
  {
    title: 'Forecasting',
    items: ['Forecast Dashboard', 'Forecast Integrity', 'Period Control']
  },
  {
    title: 'CRM',
    items: ['Accounts', 'Contacts', 'Opportunities', 'Tasks', 'Activities', 'Client Reports']
  },
  {
    title: 'Admin',
    items: ['Settings', 'User Accounts']
  }
];

const naesTheme = {
  bg: '#f4f8f4',
  surface: '#ffffff',
  surfaceAlt: '#f8fbf8',
  border: '#d7e4d8',
  text: '#18342a',
  textMuted: '#5e786d',
  textSoft: '#7f958b',
  primary: '#3f8f66',
  primaryStrong: '#2f7552',
  primarySoft: '#e5f3ea',
  accent: '#7fb3d5',
  accentSoft: '#e9f3fb',
  warning: '#e8a63c',
  warningSoft: '#fff4de',
  danger: '#d96b5f',
  dangerSoft: '#fdecea',
  success: '#3f8f66',
  successSoft: '#e5f3ea',
  shadowSm: '0 1px 2px rgba(16, 24, 40, 0.06)',
  shadowMd: '0 8px 20px rgba(16, 24, 40, 0.08)',
  radiusXl: '20px',
  radius2xl: '24px'
};

const topStrip = [
  { label: 'TECHNOLOGIES', accent: '#19D4D4', bg: '#063C43' },
  { label: 'RENEWABLES', accent: '#6E9F52', bg: '#183523' },
  { label: 'STRATOSIGHT', accent: '#1FA8FF', bg: '#0A2E52' }
];

const welcomeKpis = [
  ['Active Opportunities', '83'],
  ['Accounts in CRM', '214'],
  ['Open Tasks', '46'],
  ['Review Cadence', 'WBR / MBR / QBR / ABR']
];

const workflowStages = [
  '0 Prospecting',
  '1 Qualified',
  '2 Discovery',
  '3 Solution Fit',
  '4 Commercials',
  '5 Security Legal',
  '6 Commit',
  '7 Closed Won',
  '8 Closed Lost'
];

const shellCard = {
  borderRadius: '28px',
  border: '1px solid #D8E2D7',
  background: '#FFFFFF',
  padding: '24px',
  boxShadow: '0 18px 40px rgba(31,41,55,0.06)'
};

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function dtNow() {
  return new Date().toLocaleString();
}

function safeParseStoredJson(raw, fallback) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function smallLabel(text) {
  return (
    <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#54745D' }}>
      {text}
    </div>
  );
}

const sectionCardStyle = shellCard;

function StatCard({ label, value, sub, tone = 'primary' }) {
  const toneMap = {
    primary: {
      bg: '#FFFFFF',
      border: '#D8E2D7',
      value: '#123B2F',
      sub: '#5F7368',
    },
    success: {
      bg: '#F6FBF7',
      border: '#D8EAD9',
      value: '#1F6B44',
      sub: '#5F7368',
    },
    warning: {
      bg: '#FFF9EF',
      border: '#F2DFC2',
      value: '#8B5E12',
      sub: '#77624A',
    },
  };

  const colors = toneMap[tone] || toneMap.primary;

  return (
    <div
      style={{
        borderRadius: '24px',
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        boxShadow: '0 10px 24px rgba(31,41,55,0.05)',
        padding: '18px',
      }}
    >
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>
        {label}
      </div>
      <div style={{ marginTop: '10px', fontSize: '28px', fontWeight: 700, color: colors.value }}>
        {value}
      </div>
      <div style={{ marginTop: '6px', fontSize: '13px', color: colors.sub }}>
        {sub}
      </div>
    </div>
  );
}

function OpportunitySummaryRow({ opportunity, onOpenOpportunity }) {
  const revenue = Number(
    opportunity?.calculated_revenue ??
    opportunity?.amount_total ??
    opportunity?.calc_year1_total ??
    opportunity?.amount_estimated ??
    0
  );

  const safeRevenue = Number.isFinite(revenue) ? revenue : 0;

  return (
    <button
      type="button"
      onClick={() => onOpenOpportunity && onOpenOpportunity(opportunity?.id)}
      style={{
        width: '100%',
        textAlign: 'left',
        borderRadius: '20px',
        border: '1px solid #E5ECE5',
        background: '#FFFFFF',
        boxShadow: '0 8px 20px rgba(31,41,55,0.04)',
        padding: '16px 18px',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) repeat(4, minmax(120px, 1fr))', gap: '12px', alignItems: 'center' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {opportunity?.name || 'Untitled Opportunity'}
          </div>
          <div style={{ marginTop: '4px', fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {opportunity?.account_name || opportunity?.account || opportunity?.owner_full_name || 'No linked account'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8' }}>Stage</div>
          <div style={{ marginTop: '4px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            {opportunity?.stage || '0 Prospecting'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8' }}>Forecast</div>
          <div style={{ marginTop: '4px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            {opportunity?.forecast_category || 'Pipeline'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8' }}>Revenue</div>
          <div style={{ marginTop: '4px', fontSize: '13px', fontWeight: 700, color: '#0B6771' }}>
            {formatCurrency(safeRevenue)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8' }}>Close</div>
          <div style={{ marginTop: '4px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            {opportunity?.expected_close_date || 'No date'}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94A3B8' }}>Status</div>
          <div style={{ marginTop: '4px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            {opportunity?.staleness_flag || 'Current'}
          </div>
        </div>
      </div>
    </button>
  );
}

function buttonStyle(active = false) {
  return {
    borderRadius: '18px',
    padding: '12px 14px',
    textAlign: 'left',
    cursor: 'pointer',
    border: `1px solid ${active ? naesTheme.border : 'transparent'}`,
    background: active ? naesTheme.primarySoft : 'transparent',
    color: active ? naesTheme.primaryStrong : naesTheme.textMuted,
    boxShadow: active ? naesTheme.shadowSm : 'none',
    fontWeight: 600
  };
}

function naesCardStyle(elevated = false) {
  return {
    background: naesTheme.surface,
    border: `1px solid ${naesTheme.border}`,
    borderRadius: elevated ? naesTheme.radius2xl : naesTheme.radiusXl,
    boxShadow: elevated ? naesTheme.shadowMd : naesTheme.shadowSm
  };
}

function buildDefaultUserProfile() {
  return {
    fullName: 'Jeff Yarbrough',
    nickname: '',
    title: 'VP of Operations',
    role: 'Admin',
    email: 'jeff.yarbrough@naes.com',
    department: 'Operations',
    team: 'Executive Leadership',
    status: 'Active',
    permissionLevel: 'Administrator - L6',
    businessUnitAccess: 'NAES Technologies CRM',
    serviceLineAccess: 'Renewables, StratoSight',
    territoryScope: 'Global',
    authType: 'Managed Identity',
    passwordNote: 'Password is managed by administrator or identity provider.',
    lastLogin: dtNow(),
    photoDataUrl: ''
  };
}

function getUserDisplayName(profile = {}) {
  return String(profile?.nickname || profile?.fullName || 'User').trim() || 'User';
}

function getUserInitials(profile = {}) {
  const source = String(profile?.nickname || profile?.fullName || 'User').trim();
  if (!source) return 'U';
  const parts = source.split(/\s+/).filter(Boolean).slice(0, 2);
  const initials = parts.map((part) => part.charAt(0).toUpperCase()).join('');
  return initials || source.charAt(0).toUpperCase();
}

function SettingsPage({ userProfile = {}, userAccounts = [], onSaveUserProfile, onSaveUserAccounts }) {
  const [draftNickname, setDraftNickname] = useState(String(userProfile?.nickname || ''));
  const [draftPhotoDataUrl, setDraftPhotoDataUrl] = useState(String(userProfile?.photoDataUrl || ''));
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    setDraftNickname(String(userProfile?.nickname || ''));
    setDraftPhotoDataUrl(String(userProfile?.photoDataUrl || ''));
    setImageError('');
  }, [userProfile]);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const hasChanges =
    draftNickname !== String(userProfile?.nickname || '') ||
    draftPhotoDataUrl !== String(userProfile?.photoDataUrl || '');

  function handlePhotoUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setImageError('Only JPG, JPEG, PNG, and WEBP images are supported.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const source = String(reader.result || '');
      const img = new Image();

      img.onload = () => {
        try {
          const maxSize = 320;
          const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
          const targetWidth = Math.max(1, Math.round(img.width * scale));
          const targetHeight = Math.max(1, Math.round(img.height * scale));

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setDraftPhotoDataUrl(source);
            setImageError('');
            return;
          }

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setDraftPhotoDataUrl(String(compressed || source));
          setImageError('');
        } catch (error) {
          setDraftPhotoDataUrl(source);
          setImageError('');
        }
      };

      img.onerror = () => {
        setImageError('Could not process that image. Please try another file.');
      };

      img.src = source;
    };
    reader.onerror = () => {
      setImageError('Could not read that image. Please try another file.');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  function handleRemovePhoto() {
    setDraftPhotoDataUrl('');
    setImageError('');
  }

  function handleCancel() {
    setDraftNickname(String(userProfile?.nickname || ''));
    setDraftPhotoDataUrl(String(userProfile?.photoDataUrl || ''));
    setImageError('');
  }

  function handleSave() {
    if (!hasChanges) return;
    const nextProfile = {
      ...userProfile,
      nickname: draftNickname.trim(),
      photoDataUrl: draftPhotoDataUrl
    };

    try {
      window.localStorage.setItem('naes-crm-user-profile', JSON.stringify(nextProfile));
    } catch (error) {
      setImageError('Profile could not be saved locally. Try a smaller image.');
      return;
    }

    if (Array.isArray(userAccounts) && typeof onSaveUserAccounts === 'function') {
      const nextAccounts = userAccounts.map((item) => (
        item && item.linkedProfile
          ? {
              ...item,
              nickname: nextProfile.nickname,
              photoDataUrl: nextProfile.photoDataUrl
            }
          : item
      ));

      try {
        window.localStorage.setItem('naes-crm-user-accounts', JSON.stringify(nextAccounts));
      } catch (error) {
        setImageError('Profile saved, but linked account sync failed locally. Try a smaller image.');
      }

      onSaveUserAccounts(nextAccounts);
    }

    setImageError('');
    onSaveUserProfile(nextProfile);
  }

  function readOnlyRow(label, value, helper = '') {
    return (
      <div style={{ display: 'grid', gap: '6px', padding: '14px 0', borderBottom: `1px solid ${naesTheme.border}` }}>
        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: naesTheme.textSoft }}>
          {label}
        </div>
        <div style={{ fontSize: '14px', fontWeight: 700, color: naesTheme.text }}>
          {value || '—'}
        </div>
        {helper ? (
          <div style={{ fontSize: '12px', lineHeight: 1.5, color: naesTheme.textMuted }}>
            {helper}
          </div>
        ) : null}
      </div>
    );
  }

  const displayName = getUserDisplayName({ ...userProfile, nickname: draftNickname });
  const previewProfile = { ...userProfile, nickname: draftNickname, photoDataUrl: draftPhotoDataUrl };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', display: 'grid', gap: '24px' }}>
      <section style={{ ...naesCardStyle(false), padding: '28px' }}>
        {smallLabel('Personal Settings')}
        <h2 style={{ margin: '8px 0 0 0', fontSize: '30px', fontWeight: 800, color: naesTheme.text }}>
          Settings
        </h2>
        <p style={{ marginTop: '10px', maxWidth: '720px', fontSize: '14px', lineHeight: 1.7, color: naesTheme.textMuted }}>
          Manage your personal display preferences here. Profile photo and nickname can be updated by the user. Identity, role, access, and account permissions remain read-only and are managed by an administrator.
        </p>
      </section>

      <section style={{ ...naesCardStyle(false), padding: '24px' }}>
        {smallLabel('Profile Summary')}
        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr)', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {previewProfile.photoDataUrl ? (
              <img
                src={previewProfile.photoDataUrl}
                alt={displayName}
                style={{ width: '104px', height: '104px', borderRadius: '24px', objectFit: 'cover', border: `1px solid ${naesTheme.border}` }}
              />
            ) : (
              <div style={{ width: '104px', height: '104px', borderRadius: '24px', background: naesTheme.primarySoft, color: naesTheme.primaryStrong, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', fontWeight: 800, border: `1px solid ${naesTheme.border}` }}>
                {getUserInitials(previewProfile)}
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: naesTheme.text }}>{userProfile.fullName || '—'}</div>
              <div style={{ marginTop: '4px', fontSize: '14px', color: naesTheme.textMuted }}>
                {draftNickname ? `Preferred display name: ${draftNickname}` : 'No nickname set'}
              </div>
            </div>
            <div style={{ display: 'grid', gap: '6px' }}>
              <div style={{ fontSize: '14px', color: naesTheme.textMuted }}><strong style={{ color: naesTheme.text }}>Title:</strong> {userProfile.title || '—'}</div>
              <div style={{ fontSize: '14px', color: naesTheme.textMuted }}><strong style={{ color: naesTheme.text }}>Role:</strong> {userProfile.role || '—'}</div>
              <div style={{ fontSize: '14px', color: naesTheme.textMuted }}><strong style={{ color: naesTheme.text }}>Email:</strong> {userProfile.email || '—'}</div>
              <div style={{ fontSize: '14px', color: naesTheme.textMuted }}><strong style={{ color: naesTheme.text }}>Status:</strong> {userProfile.status || '—'}</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ ...naesCardStyle(false), padding: '24px', display: 'grid', gap: '18px' }}>
        {smallLabel('Editable Personal Settings')}

        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: naesTheme.text }}>Profile Photo</div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <label
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.border}`,
                background: naesTheme.accentSoft,
                color: naesTheme.text,
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Upload Photo
              <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            </label>

            <button
              type="button"
              onClick={handleRemovePhoto}
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.border}`,
                background: '#FFFFFF',
                color: naesTheme.text,
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Remove Photo
            </button>
          </div>

          <div style={{ fontSize: '12px', color: naesTheme.textMuted }}>
            Supported file types: JPG, JPEG, PNG, and WEBP.
          </div>

          {imageError ? (
            <div style={{ fontSize: '12px', fontWeight: 700, color: naesTheme.danger }}>
              {imageError}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'grid', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 700, color: naesTheme.text }}>Nickname / Preferred Display Name</label>
          <input
            value={draftNickname}
            onChange={(event) => setDraftNickname(event.target.value)}
            placeholder="Enter preferred display name"
            style={{
              height: '44px',
              borderRadius: '14px',
              border: `1px solid ${naesTheme.border}`,
              padding: '0 14px',
              fontSize: '14px',
              color: naesTheme.text,
              background: '#FFFFFF'
            }}
          />
          <div style={{ fontSize: '12px', color: naesTheme.textMuted }}>
            This is the name shown in the user placard and profile display areas when set.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges}
            style={{
              borderRadius: '14px',
              border: `1px solid ${hasChanges ? naesTheme.primary : naesTheme.border}`,
              background: hasChanges ? naesTheme.primary : '#F3F5F4',
              color: hasChanges ? '#FFFFFF' : naesTheme.textSoft,
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 800,
              cursor: hasChanges ? 'pointer' : 'not-allowed'
            }}
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={handleCancel}
            style={{
              borderRadius: '14px',
              border: `1px solid ${naesTheme.border}`,
              background: '#FFFFFF',
              color: naesTheme.text,
              padding: '10px 18px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </section>

      <section style={{ ...naesCardStyle(false), padding: '24px' }}>
        {smallLabel('Read-Only Account Information')}
        <div style={{ marginTop: '10px', display: 'grid' }}>
          {readOnlyRow('Full Name', userProfile.fullName)}
          {readOnlyRow('Title', userProfile.title)}
          {readOnlyRow('Work Email', userProfile.email)}
          {readOnlyRow('Role', userProfile.role)}
          {readOnlyRow('Department', userProfile.department)}
          {readOnlyRow('Team', userProfile.team)}
          {readOnlyRow('Account Status', userProfile.status)}
        </div>
      </section>

      <section style={{ ...naesCardStyle(false), padding: '24px' }}>
        {smallLabel('Read-Only Access / Permissions')}
        <div style={{ marginTop: '10px', display: 'grid' }}>
          {readOnlyRow('Role / Permission Level', userProfile.permissionLevel, 'Managed by administrator')}
          {readOnlyRow('Business Unit Access', userProfile.businessUnitAccess, 'Managed by administrator')}
          {readOnlyRow('Service Line Access', userProfile.serviceLineAccess, 'Managed by administrator')}
          {readOnlyRow('Territory / Scope', userProfile.territoryScope, 'Managed by administrator')}
        </div>
      </section>

      <section style={{ ...naesCardStyle(false), padding: '24px' }}>
        {smallLabel('Authentication / Login')}
        <div style={{ marginTop: '10px', display: 'grid' }}>
          {readOnlyRow('Authentication Type', userProfile.authType)}
          {readOnlyRow('Password', userProfile.passwordNote)}
          {readOnlyRow('Last Login', userProfile.lastLogin || '—')}
        </div>
      </section>

      <section style={{ ...naesCardStyle(false), padding: '24px', background: naesTheme.surfaceAlt }}>
        {smallLabel('Support')}
        <div style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.7, color: naesTheme.textMuted }}>
          Contact an administrator for changes to role, access, title, email, department, team, or account permissions. Personal display preferences on this page are limited to profile photo and nickname only.
        </div>
      </section>
    </div>
  );
}

function renderUserPlacard(profile = buildDefaultUserProfile()) {
  const displayName = getUserDisplayName(profile);
  return (
    <div style={{ borderRadius: '24px', border: '1px solid #0C5A63', background: '#055059', padding: '16px', boxShadow: '0 12px 28px rgba(0,0,0,0.24)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.58)' }}>
            User Profile
          </div>
          <div style={{ marginTop: '4px', fontSize: '14px', fontWeight: 700, color: '#fff' }}>
            {displayName}
          </div>
          <div style={{ marginTop: '2px', fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>
            {profile.title || '—'}
          </div>
          <div style={{ marginTop: '8px', display: 'inline-flex', borderRadius: '999px', background: '#0B6771', padding: '4px 10px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B6FFFB' }}>
            {profile.role || 'User'}
          </div>
        </div>
        {profile.photoDataUrl ? (
          <img
            src={profile.photoDataUrl}
            alt={displayName}
            style={{ width: '56px', height: '56px', borderRadius: '18px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.18)' }}
          />
        ) : (
          <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#0C6670', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', color: '#DDFEFB' }}>
            {getUserInitials(profile)}
          </div>
        )}
      </div>
    </div>
  );
}

function buildInitialUserAccounts(profile = buildDefaultUserProfile()) {
  return [
    {
      id: 'user-jeff-yarbrough',
      linkedProfile: true,
      fullName: profile.fullName,
      nickname: profile.nickname || '',
      title: profile.title,
      email: profile.email,
      role: profile.role,
      department: profile.department,
      team: profile.team,
      status: profile.status,
      permissionLevel: profile.permissionLevel,
      businessUnitAccess: profile.businessUnitAccess,
      serviceLineAccess: profile.serviceLineAccess,
      territoryScope: profile.territoryScope,
      authType: profile.authType,
      passwordNote: profile.passwordNote,
      lastLogin: profile.lastLogin,
      photoDataUrl: profile.photoDataUrl || ''
    }
  ];
}

function normalizeUserRole(role = '') {
  const raw = String(role || '').trim().toLowerCase();
  if (raw === 'sales manager') return 'Manager';
  if (raw === 'sales associate') return 'Associate';
  if (raw === 'admin') return 'Admin';
  if (raw === 'executive') return 'Executive';
  if (raw === 'manager') return 'Manager';
  if (raw === 'associate') return 'Associate';
  return 'Associate';
}

function getRoleProfile(role = '') {
  const normalized = normalizeUserRole(role);

  if (normalized === 'Admin') {
    return {
      role: 'Admin',
      permissionLevel: 'Administrator - L6',
      businessUnitAccess: 'NAES Technologies CRM',
      serviceLineAccess: 'Renewables and StratoSight',
      territoryScope: 'Global'
    };
  }

  if (normalized === 'Executive') {
    return {
      role: 'Executive',
      permissionLevel: 'Executive - L5',
      businessUnitAccess: 'NAES Technologies CRM',
      serviceLineAccess: 'Renewables and StratoSight',
      territoryScope: 'Global'
    };
  }

  if (normalized === 'Manager') {
    return {
      role: 'Manager',
      permissionLevel: 'Manager - L4',
      businessUnitAccess: 'NAES Technologies CRM',
      serviceLineAccess: 'Renewables and StratoSight',
      territoryScope: 'Assigned Team / Territory'
    };
  }

  return {
    role: 'Associate',
    permissionLevel: 'Associate - L3',
    businessUnitAccess: 'CRM Workspace',
    serviceLineAccess: 'Assigned Service Lines',
    territoryScope: 'Assigned Accounts / Territory'
  };
}

function getAllowedPagesForRole(role = '') {
  const normalized = normalizeUserRole(role);
  const allPages = sidebarSections.flatMap((section) => section.items);

  if (normalized === 'Admin') {
    return allPages;
  }

  if (normalized === 'Executive') {
    return allPages.filter((item) => item !== 'User Accounts');
  }

  if (normalized === 'Manager') {
    return allPages.filter((item) => item !== 'Dashboard' && item !== 'User Accounts');
  }

  return [
    'Welcome',
    'My Pipeline',
    'Accounts',
    'Contacts',
    'Opportunities',
    'Tasks',
    'Activities',
    'Client Reports',
    'Settings'
  ];
}

function buildNewUserAccount(role = 'Associate') {
  const profile = getRoleProfile(role);
  return {
    id: `user-${Date.now()}`,
    linkedProfile: false,
    fullName: '',
    nickname: '',
    title: '',
    email: '',
    role: profile.role,
    department: '',
    team: '',
    status: 'Active',
    permissionLevel: profile.permissionLevel,
    businessUnitAccess: profile.businessUnitAccess,
    serviceLineAccess: profile.serviceLineAccess,
    territoryScope: profile.territoryScope,
    authType: 'Managed Identity',
    passwordNote: 'Password is managed by administrator or identity provider.',
    lastLogin: '',
    photoDataUrl: ''
  };
}

function buildUserAccountDraft(record = {}) {
  const normalizedRole = normalizeUserRole(record.role || '');
  const roleProfile = getRoleProfile(normalizedRole);

  return {
    id: String(record.id || ''),
    linkedProfile: Boolean(record.linkedProfile),
    fullName: String(record.fullName || ''),
    nickname: String(record.nickname || ''),
    title: String(record.title || ''),
    email: String(record.email || ''),
    role: normalizedRole,
    department: String(record.department || ''),
    team: String(record.team || ''),
    status: String(record.status || 'Active'),
    permissionLevel: String(record.permissionLevel || roleProfile.permissionLevel || ''),
    businessUnitAccess: String(record.businessUnitAccess || roleProfile.businessUnitAccess || ''),
    serviceLineAccess: String(record.serviceLineAccess || roleProfile.serviceLineAccess || ''),
    territoryScope: String(record.territoryScope || roleProfile.territoryScope || ''),
    authType: String(record.authType || ''),
    passwordNote: String(record.passwordNote || ''),
    lastLogin: String(record.lastLogin || ''),
    photoDataUrl: String(record.photoDataUrl || '')
  };
}

function UserAccountsPage({ userAccounts = [], onSaveUserAccounts, onSyncCurrentUserProfile }) {
  const safeAccounts = Array.isArray(userAccounts) ? userAccounts.map((item) => buildUserAccountDraft(item)) : [];
  const initialSelectedId = safeAccounts[0]?.id || null;

  const [selectedUserId, setSelectedUserId] = useState(initialSelectedId);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [draftUser, setDraftUser] = useState(buildUserAccountDraft(safeAccounts[0] || buildNewUserAccount('Associate')));

  useEffect(() => {
    if (isCreatingNew) return;
    const nextSelectedId = safeAccounts.some((item) => item.id === selectedUserId)
      ? selectedUserId
      : (safeAccounts[0]?.id || null);
    setSelectedUserId(nextSelectedId);
    const selectedRecord = safeAccounts.find((item) => item.id === nextSelectedId) || buildNewUserAccount('Associate');
    setDraftUser(buildUserAccountDraft(selectedRecord));
  }, [userAccounts, isCreatingNew]);

  const selectedRecord = safeAccounts.find((item) => item.id === selectedUserId) || null;
  const hasChanges = isCreatingNew
    ? JSON.stringify(buildUserAccountDraft(buildNewUserAccount(draftUser.role || 'Associate'))) !== JSON.stringify(draftUser)
    : JSON.stringify(buildUserAccountDraft(selectedRecord || {})) !== JSON.stringify(draftUser);

  function updateField(field, value) {
    setDraftUser((current) => {
      const next = { ...current, [field]: value };
      if (field === 'role') {
        const roleProfile = getRoleProfile(value);
        next.role = roleProfile.role;
        next.permissionLevel = roleProfile.permissionLevel;
        next.businessUnitAccess = roleProfile.businessUnitAccess;
        next.serviceLineAccess = roleProfile.serviceLineAccess;
        next.territoryScope = roleProfile.territoryScope;
      }
      return next;
    });
  }

  function handleStartNewUser() {
    setIsCreatingNew(true);
    setSelectedUserId(null);
    setDraftUser(buildUserAccountDraft(buildNewUserAccount('Associate')));
  }

  function handleSelectUser(userId) {
    setIsCreatingNew(false);
    setSelectedUserId(userId);
    const selected = safeAccounts.find((item) => item.id === userId) || buildNewUserAccount('Associate');
    setDraftUser(buildUserAccountDraft(selected));
  }

  function handleCancel() {
    if (isCreatingNew) {
      setIsCreatingNew(false);
      const fallback = safeAccounts[0] || buildNewUserAccount('Associate');
      setSelectedUserId(safeAccounts[0]?.id || null);
      setDraftUser(buildUserAccountDraft(fallback));
      return;
    }
    setDraftUser(buildUserAccountDraft(selectedRecord || {}));
  }

  function handleSave() {
    if (isCreatingNew) {
      const nextUser = {
        ...draftUser,
        id: draftUser.id || `user-${Date.now()}`,
        linkedProfile: false
      };
      const nextAccounts = [nextUser, ...safeAccounts];

      try {
        window.localStorage.setItem('naes-crm-user-accounts', JSON.stringify(nextAccounts));
      } catch (error) {
        // ignore local storage persistence issues in preview shell
      }

      onSaveUserAccounts(nextAccounts);
      setIsCreatingNew(false);
      setSelectedUserId(nextUser.id);
      setDraftUser(buildUserAccountDraft(nextUser));
      return;
    }

    if (!selectedRecord) return;

    const nextAccounts = safeAccounts.map((item) => (
      item.id === selectedRecord.id
        ? {
            ...item,
            ...draftUser
          }
        : item
    ));

    try {
      window.localStorage.setItem('naes-crm-user-accounts', JSON.stringify(nextAccounts));
    } catch (error) {
      // ignore local storage persistence issues in preview shell
    }

    onSaveUserAccounts(nextAccounts);

    if (draftUser.linkedProfile) {
      const nextProfile = {
        fullName: draftUser.fullName,
        nickname: draftUser.nickname,
        title: draftUser.title,
        email: draftUser.email,
        role: draftUser.role,
        department: draftUser.department,
        team: draftUser.team,
        status: draftUser.status,
        permissionLevel: draftUser.permissionLevel,
        businessUnitAccess: draftUser.businessUnitAccess,
        serviceLineAccess: draftUser.serviceLineAccess,
        territoryScope: draftUser.territoryScope,
        authType: draftUser.authType,
        passwordNote: draftUser.passwordNote,
        lastLogin: draftUser.lastLogin,
        photoDataUrl: draftUser.photoDataUrl
      };

      try {
        window.localStorage.setItem('naes-crm-user-profile', JSON.stringify(nextProfile));
      } catch (error) {
        // ignore local storage persistence issues in preview shell
      }

      onSyncCurrentUserProfile((current) => ({
        ...current,
        ...nextProfile
      }));
    }
  }

  function handleDelete() {
    if (isCreatingNew) {
      handleCancel();
      return;
    }
    if (!selectedRecord || selectedRecord.linkedProfile) return;

    const nextAccounts = safeAccounts.filter((item) => item.id !== selectedRecord.id);
    onSaveUserAccounts(nextAccounts);
    const fallback = nextAccounts[0] || buildNewUserAccount('Associate');
    setSelectedUserId(nextAccounts[0]?.id || null);
    setDraftUser(buildUserAccountDraft(fallback));
  }

  function renderField(label, field, options = {}) {
    const isTextarea = options.type === 'textarea';
    const isSelect = Array.isArray(options.options);
    const commonStyle = {
      width: '100%',
      boxSizing: 'border-box',
      borderRadius: '14px',
      border: `1px solid ${naesTheme.border}`,
      background: '#FFFFFF',
      color: naesTheme.text,
      fontSize: '14px',
      padding: isTextarea ? '12px 14px' : '0 12px',
      height: isTextarea ? 'auto' : '40px',
      minHeight: isTextarea ? '96px' : '40px'
    };

    return (
      <div style={{ display: 'grid', gap: '8px' }}>
        <label style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: naesTheme.textSoft }}>
          {label}
        </label>
        {isSelect ? (
          <select value={draftUser[field] || ''} onChange={(event) => updateField(field, event.target.value)} style={commonStyle}>
            {options.options.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : isTextarea ? (
          <textarea value={draftUser[field] || ''} onChange={(event) => updateField(field, event.target.value)} style={commonStyle} />
        ) : (
          <input value={draftUser[field] || ''} onChange={(event) => updateField(field, event.target.value)} style={commonStyle} />
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' }}>
      <section style={{ ...naesCardStyle(false), padding: '28px' }}>
        {smallLabel('Admin Directory')}
        <h2 style={{ margin: '8px 0 0 0', fontSize: '30px', fontWeight: 800, color: naesTheme.text }}>
          User Accounts
        </h2>
        <p style={{ marginTop: '10px', maxWidth: '760px', fontSize: '14px', lineHeight: 1.7, color: naesTheme.textMuted }}>
          Admin-managed user directory for identity, role, access, team, and account-status maintenance. This is the correct place to update managed fields such as email, title, role, and user access.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '340px minmax(0, 1fr)', gap: '24px', alignItems: 'start' }}>
        <section style={{ ...naesCardStyle(false), padding: '20px', display: 'grid', gap: '14px', maxWidth: '360px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
            <div>
              {smallLabel('User Directory')}
              <h3 style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 800, color: naesTheme.text }}>
                Accounts
              </h3>
            </div>

            <button
              type="button"
              onClick={handleStartNewUser}
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.primary}`,
                background: naesTheme.primary,
                color: '#FFFFFF',
                padding: '10px 14px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Add Account
            </button>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {safeAccounts.map((user) => {
              const isActive = user.id === selectedUserId && !isCreatingNew;
              const displayName = String(user.nickname || user.fullName || 'User').trim() || 'User';
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectUser(user.id)}
                  style={{
                    borderRadius: '18px',
                    border: `1px solid ${isActive ? naesTheme.primary : naesTheme.border}`,
                    background: isActive ? naesTheme.primarySoft : '#FFFFFF',
                    padding: '14px',
                    display: 'grid',
                    gap: '8px',
                    textAlign: 'left',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: naesTheme.text }}>{displayName}</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: user.status === 'Active' ? naesTheme.primaryStrong : naesTheme.danger }}>
                      {user.status || '—'}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: naesTheme.textMuted }}>{user.email || '—'}</div>
                  <div style={{ fontSize: '12px', color: naesTheme.textSoft }}>{user.title || '—'} • {normalizeUserRole(user.role || 'Associate')}</div>
                </button>
              );
            })}

            {isCreatingNew ? (
              <div style={{ borderRadius: '18px', border: `1px dashed ${naesTheme.primary}`, background: naesTheme.primarySoft, padding: '14px', fontSize: '13px', fontWeight: 700, color: naesTheme.primaryStrong }}>
                Creating new user account
              </div>
            ) : null}
          </div>
        </section>

        <section style={{ ...naesCardStyle(false), padding: '24px', display: 'grid', gap: '18px', maxWidth: '576px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '88px minmax(0, 1fr)', gap: '18px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {draftUser.photoDataUrl ? (
                <img
                  src={draftUser.photoDataUrl}
                  alt={draftUser.fullName || 'User'}
                  style={{ width: '80px', height: '80px', borderRadius: '22px', objectFit: 'cover', border: `1px solid ${naesTheme.border}` }}
                />
              ) : (
                <div style={{ width: '80px', height: '80px', borderRadius: '22px', background: naesTheme.primarySoft, color: naesTheme.primaryStrong, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 800, border: `1px solid ${naesTheme.border}` }}>
                  {getUserInitials(draftUser)}
                </div>
              )}
            </div>
            <div>
              {smallLabel(isCreatingNew ? 'New Account' : 'Selected Account')}
              <div style={{ marginTop: '6px', fontSize: '24px', fontWeight: 800, color: naesTheme.text }}>
                {draftUser.fullName || 'User'}
              </div>
              <div style={{ marginTop: '4px', fontSize: '14px', color: naesTheme.textMuted }}>
                {draftUser.linkedProfile ? 'Linked to current signed-in profile' : isCreatingNew ? 'New directory account' : 'Directory-only account'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {smallLabel('Identity / Account')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 280px)', gap: '16px', justifyContent: 'start' }}>
              {renderField('Full Name', 'fullName')}
              {renderField('Nickname', 'nickname')}
              {renderField('Title', 'title')}
              {renderField('Work Email', 'email')}
              {renderField('Role', 'role', { options: ['Admin', 'Executive', 'Manager', 'Associate'] })}
              {renderField('Department', 'department')}
              {renderField('Team', 'team')}
              {renderField('Account Status', 'status', { options: ['Active', 'Inactive'] })}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {smallLabel('Permissions / Access')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 280px)', gap: '16px', justifyContent: 'start' }}>
              {renderField('Permission Level', 'permissionLevel')}
              {renderField('Business Unit Access', 'businessUnitAccess')}
              {renderField('Service Line Access', 'serviceLineAccess')}
              {renderField('Territory / Scope', 'territoryScope')}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {smallLabel('Authentication')}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 280px)', gap: '16px', justifyContent: 'start' }}>
              {renderField('Authentication Type', 'authType')}
              {renderField('Last Login', 'lastLogin')}
            </div>
            {renderField('Password / Login Note', 'passwordNote', { type: 'textarea' })}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges}
              style={{
                borderRadius: '14px',
                border: `1px solid ${hasChanges ? naesTheme.primary : naesTheme.border}`,
                background: hasChanges ? naesTheme.primary : '#F3F5F4',
                color: hasChanges ? '#FFFFFF' : naesTheme.textSoft,
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: hasChanges ? 'pointer' : 'not-allowed'
              }}
            >
              {isCreatingNew ? 'Create User Account' : 'Save User Account'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.border}`,
                background: '#FFFFFF',
                color: naesTheme.text,
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={Boolean(selectedRecord?.linkedProfile) && !isCreatingNew}
              style={{
                borderRadius: '14px',
                border: `1px solid ${selectedRecord?.linkedProfile && !isCreatingNew ? naesTheme.border : naesTheme.danger}`,
                background: '#FFFFFF',
                color: selectedRecord?.linkedProfile && !isCreatingNew ? naesTheme.textSoft : naesTheme.danger,
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: selectedRecord?.linkedProfile && !isCreatingNew ? 'not-allowed' : 'pointer'
              }}
            >
              {isCreatingNew ? 'Discard New Account' : 'Delete Account'}
            </button>
          </div>

          {selectedRecord?.linkedProfile && !isCreatingNew ? (
            <div style={{ fontSize: '12px', lineHeight: 1.6, color: naesTheme.textMuted }}>
              The currently linked signed-in profile can be edited and activated/inactivated, but not deleted from the directory.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function renderExecutiveDashboard({ accounts = [], contacts = [], opportunities = [], onOpenOpportunity } = {}) {
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const safeContacts = Array.isArray(contacts) ? contacts : [];
  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function normalizeText(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function revenueFor(item) {
    return toNumber(
      item?.calculated_revenue ??
      item?.amount_total ??
      item?.calc_year1_total ??
      item?.amount_estimated ??
      item?.calc_arr_total ??
      item?.arr_total ??
      0
    );
  }

  function weightedFor(item) {
    const explicitWeighted = toNumber(
      item?.weighted_revenue ??
      item?.amount_weighted ??
      item?.weightedRevenue ??
      item?.weighted_value
    );
    if (explicitWeighted > 0) return explicitWeighted;

    const probability = toNumber(
      item?.probability ??
      item?.forecast_probability ??
      item?.forecastProbability
    );

    return revenueFor(item) * (probability > 0 ? probability / 100 : 0);
  }

  function forecastCategoryFor(item) {
    const raw = normalizeText(item?.forecast_category ?? item?.forecastCategory);
    if (raw === 'bestcase' || raw === 'best case') return 'Best Case';
    if (raw === 'commit') return 'Commit';
    if (raw === 'closedwon' || raw === 'closed won' || raw === 'closed') return 'Closed Won';
    if (raw === 'closedlost' || raw === 'closed lost') return 'Closed Lost';
    return 'Pipeline';
  }

  function stageFor(item) {
    return String(item?.stage ?? item?.salesStage ?? item?.stage_name ?? item?.stageName ?? '0 Prospecting').trim();
  }

  function expectedCloseFor(item) {
    return String(item?.expected_close_date || '').trim();
  }

  function ownerFor(item) {
    return String(item?.owner_full_name ?? item?.owner ?? 'Unassigned').trim() || 'Unassigned';
  }

  function monthKey(dateText) {
    const d = new Date(dateText);
    if (Number.isNaN(d.getTime())) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  function monthLabel(key) {
    const [year, month] = String(key).split('-').map(Number);
    const d = new Date(year, (month || 1) - 1, 1);
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  }

  function recentMonthKeys(count = 6) {
    const keys = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    return keys;
  }

  function isClosedWon(item) {
    const stage = normalizeText(stageFor(item));
    const forecast = normalizeText(forecastCategoryFor(item));
    return stage === 'closedwon' || forecast === 'closedwon';
  }

  function isClosedLost(item) {
    const stage = normalizeText(stageFor(item));
    const forecast = normalizeText(forecastCategoryFor(item));
    return stage === 'closedlost' || forecast === 'closedlost';
  }

  function isOpen(item) {
    return !isClosedWon(item) && !isClosedLost(item);
  }

  function riskReasonFor(item) {
    const reasons = [];
    const stale = String(item?.staleness_flag || '').trim();
    if (stale) reasons.push(stale);
    if (!expectedCloseFor(item)) reasons.push('Missing close date');
    if (!toNumber(item?.probability) && forecastCategoryFor(item) !== 'Pipeline') reasons.push('No probability');
    return reasons.join(', ') || 'Monitor';
  }

  const openOpportunities = safeOpportunities.filter(isOpen);
  const commitDeals = openOpportunities.filter((item) => forecastCategoryFor(item) === 'Commit');
  const atRiskDeals = openOpportunities.filter((item) => {
    const flag = String(item?.staleness_flag || '').toLowerCase();
    return flag.includes('risk') || flag.includes('overdue') || flag.includes('stale');
  });

  const totalPipeline = openOpportunities.reduce((sum, item) => sum + revenueFor(item), 0);
  const weightedPipeline = openOpportunities.reduce((sum, item) => sum + weightedFor(item), 0);
  const commitValue = commitDeals.reduce((sum, item) => sum + revenueFor(item), 0);

  const kpis = [
    { label: 'Open Pipeline', value: formatCurrency(totalPipeline), sub: `${openOpportunities.length} open opportunities` },
    { label: 'Weighted Pipeline', value: formatCurrency(weightedPipeline), sub: 'forecast-adjusted value' },
    { label: 'Commit', value: formatCurrency(commitValue), sub: `${commitDeals.length} commit deals` },
    { label: 'At-Risk Deals', value: String(atRiskDeals.length), sub: 'stale or overdue follow-up' }
  ];

  const forecastCategories = ['Pipeline', 'Best Case', 'Commit', 'Closed Won', 'Closed Lost'];
  const forecastRows = forecastCategories.map((label) => ({
    label,
    value: safeOpportunities
      .filter((item) => forecastCategoryFor(item) === label)
      .reduce((sum, item) => sum + revenueFor(item), 0)
  }));
  const maxForecastValue = Math.max(1, ...forecastRows.map((row) => row.value));

  const stageOrder = [
    '0 Prospecting',
    '1 Qualified',
    '2 Discovery',
    '3 Solution Fit',
    '4 Commercials',
    '5 Security Legal',
    '6 Commit',
    '7 Closed Won',
    '8 Closed Lost'
  ];
  const stageRows = stageOrder.map((stage) => {
    const matches = safeOpportunities.filter((item) => stageFor(item) === stage);
    return {
      label: stage,
      value: matches.reduce((sum, item) => sum + revenueFor(item), 0),
      count: matches.length
    };
  });
  const maxStageValue = Math.max(1, ...stageRows.map((row) => row.value));

  const monthKeys = recentMonthKeys(6);

  const periodRows = monthKeys.map((key) => {
    const matchingOpen = openOpportunities.filter((item) => monthKey(expectedCloseFor(item)) === key);
    const matchingCommit = commitDeals.filter((item) => monthKey(expectedCloseFor(item)) === key);
    return {
      key,
      label: monthLabel(key),
      open: matchingOpen.reduce((sum, item) => sum + revenueFor(item), 0),
      weighted: matchingOpen.reduce((sum, item) => sum + weightedFor(item), 0),
      commit: matchingCommit.reduce((sum, item) => sum + revenueFor(item), 0)
    };
  });
  const maxPeriodBar = Math.max(1, ...periodRows.flatMap((row) => [row.open, row.weighted, row.commit]));

  const trendRows = monthKeys.map((key) => {
    const matchingOpen = openOpportunities.filter((item) => monthKey(expectedCloseFor(item)) === key);
    const matchingWon = safeOpportunities.filter((item) => isClosedWon(item) && monthKey(expectedCloseFor(item)) === key);
    return {
      key,
      label: monthLabel(key),
      pipeline: matchingOpen.reduce((sum, item) => sum + revenueFor(item), 0),
      weighted: matchingOpen.reduce((sum, item) => sum + weightedFor(item), 0),
      won: matchingWon.reduce((sum, item) => sum + revenueFor(item), 0)
    };
  });
  const maxTrendValue = Math.max(1, ...trendRows.flatMap((row) => [row.pipeline, row.weighted, row.won]));

  function trendPoints(rows, accessor) {
    return rows.map((row, index) => {
      const x = rows.length === 1 ? 0 : (index / (rows.length - 1)) * 100;
      const y = 100 - ((accessor(row) / maxTrendValue) * 100);
      return `${x},${y}`;
    }).join(' ');
  }

  const topOpenDeals = [...openOpportunities]
    .sort((a, b) => revenueFor(b) - revenueFor(a))
    .slice(0, 10);
  const maxTopDealValue = Math.max(1, ...topOpenDeals.map((item) => revenueFor(item)));

  const ownerRows = Object.entries(
    openOpportunities.reduce((acc, item) => {
      const owner = ownerFor(item);
      if (!acc[owner]) acc[owner] = 0;
      acc[owner] += revenueFor(item);
      return acc;
    }, {})
  )
    .map(([owner, value]) => ({ owner, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);
  const maxOwnerValue = Math.max(1, ...ownerRows.map((row) => row.value));

  const closePeriods = [
    { label: 'This Month', total: 0 },
    { label: 'Next Month', total: 0 },
    { label: 'This Quarter', total: 0 },
    { label: 'Next Quarter', total: 0 }
  ];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentQuarter = Math.floor(currentMonth / 3);

  openOpportunities.forEach((item) => {
    const closeText = expectedCloseFor(item);
    if (!closeText) return;
    const closeDate = new Date(closeText);
    if (Number.isNaN(closeDate.getTime())) return;

    const closeMonth = closeDate.getMonth();
    const closeYear = closeDate.getFullYear();
    const closeQuarter = Math.floor(closeMonth / 3);
    const weighted = weightedFor(item);

    if (closeYear === currentYear && closeMonth === currentMonth) closePeriods[0].total += weighted;

    const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
    if (closeYear === nextMonthDate.getFullYear() && closeMonth === nextMonthDate.getMonth()) closePeriods[1].total += weighted;

    if (closeYear === currentYear && closeQuarter === currentQuarter) closePeriods[2].total += weighted;

    const nextQuarter = (currentQuarter + 1) % 4;
    const nextQuarterYear = currentQuarter === 3 ? currentYear + 1 : currentYear;
    if (closeYear === nextQuarterYear && closeQuarter === nextQuarter) closePeriods[3].total += weighted;
  });

  const maxClosePeriod = Math.max(1, ...closePeriods.map((row) => row.total));

  const sectionTitle = {
    margin: '8px 0 0 0',
    fontSize: '20px',
    fontWeight: 700,
    color: '#123B2F'
  };

  const barTrack = {
    width: '100%',
    height: '14px',
    borderRadius: '999px',
    background: '#EDF2EE',
    overflow: 'hidden'
  };

  return (
    <div style={{ display: 'grid', gap: '18px' }}>
      <section style={sectionCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            {smallLabel('Executive Dashboard')}
            <div style={{ marginTop: '6px', fontSize: '30px', fontWeight: 800, letterSpacing: '-0.03em', color: '#123B2F' }}>
              Executive Dashboard
            </div>
            <div style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.6, color: '#4E6A5E', maxWidth: '760px' }}>
              Executive rollup driven by live CRM inputs, focused on forecast quality, stage distribution, timing, concentration, and risk.
            </div>
          </div>

          <div style={{
            alignSelf: 'center',
            background: '#F4F8F5',
            color: '#234B3D',
            border: '1px solid #D8E2DC',
            borderRadius: '999px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap'
          }}>
            Leadership Pipeline View
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {kpis.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} sub={card.sub} tone="primary" />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.95fr)', gap: '18px' }}>
        <section style={sectionCardStyle}>
          {smallLabel('Forecast Category')}
          <h3 style={sectionTitle}>Total Pipeline by Forecast Category</h3>
          <div style={{ marginTop: '18px', display: 'grid', gap: '14px' }}>
            {forecastRows.map((row) => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{row.label}</div>
                  <div style={{ fontSize: '13px', color: '#475569' }}>{formatCurrency(row.value)}</div>
                </div>
                <div style={barTrack}>
                  <div style={{ width: `${(row.value / maxForecastValue) * 100}%`, height: '100%', background: '#0B6771' }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionCardStyle}>
          {smallLabel('Sales Stage')}
          <h3 style={sectionTitle}>Pipeline by Sales Stage</h3>
          <div style={{ marginTop: '18px', display: 'grid', gap: '14px' }}>
            {stageRows.map((row) => (
              <div key={row.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{row.label}</div>
                  <div style={{ fontSize: '13px', color: '#475569' }}>{formatCurrency(row.value)} • {row.count}</div>
                </div>
                <div style={barTrack}>
                  <div style={{ width: `${(row.value / maxStageValue) * 100}%`, height: '100%', background: '#2A83C5' }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '18px' }}>
        <section style={sectionCardStyle}>
          {smallLabel('Period Comparison')}
          <h3 style={sectionTitle}>Open vs Weighted vs Commit Trend</h3>
          <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, periodRows.length)}, minmax(0, 1fr))`, gap: '12px', alignItems: 'end', minHeight: '260px' }}>
            {periodRows.map((row) => (
              <div key={row.key} style={{ display: 'grid', gap: '8px', alignItems: 'end' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', alignItems: 'end', minHeight: '180px' }}>
                  <div style={{ width: '18px', height: `${Math.max(8, (row.open / maxPeriodBar) * 100)}%`, background: '#C7D9D0', borderRadius: '10px 10px 0 0' }} />
                  <div style={{ width: '18px', height: `${Math.max(8, (row.weighted / maxPeriodBar) * 100)}%`, background: '#0B6771', borderRadius: '10px 10px 0 0' }} />
                  <div style={{ width: '18px', height: `${Math.max(8, (row.commit / maxPeriodBar) * 100)}%`, background: '#2A83C5', borderRadius: '10px 10px 0 0' }} />
                </div>
                <div style={{ fontSize: '12px', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>{row.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={sectionCardStyle}>
          {smallLabel('Pipeline Trend')}
          <h3 style={sectionTitle}>Pipeline Trend Over Time</h3>
          <div style={{ marginTop: '18px', borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '16px' }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '240px', display: 'block' }}>
              <polyline fill="none" stroke="#0B6771" strokeWidth="2.5" points={trendPoints(trendRows, (row) => row.pipeline)} />
              <polyline fill="none" stroke="#2A83C5" strokeWidth="2.5" points={trendPoints(trendRows, (row) => row.weighted)} />
              <polyline fill="none" stroke="#6D8F72" strokeWidth="2.5" points={trendPoints(trendRows, (row) => row.won)} />
            </svg>
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}><span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#0B6771' }} /> Open Pipeline</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}><span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#2A83C5' }} /> Weighted Pipeline</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}><span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#6D8F72' }} /> Closed Won</div>
            </div>
          </div>
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '18px' }}>
        <section style={sectionCardStyle}>
          {smallLabel('Top Opportunities')}
          <h3 style={sectionTitle}>Ranked by value</h3>
          <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
            {topOpenDeals.length ? topOpenDeals.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onOpenOpportunity?.(item.id)}
                style={{
                  borderRadius: '18px',
                  border: '1px solid #E5ECE5',
                  background: '#FBFCFB',
                  padding: '14px 16px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'grid', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{item.name || 'Opportunity'}</div>
                    <div style={{ fontSize: '13px', color: '#475569' }}>{formatCurrency(revenueFor(item))}</div>
                  </div>
                  <div style={barTrack}>
                    <div style={{ width: `${(revenueFor(item) / maxTopDealValue) * 100}%`, height: '100%', background: '#6D8F72' }} />
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {(item.account_name || item.accountName || 'No Account')} • {(item.forecast_category || 'Pipeline')}
                  </div>
                </div>
              </button>
            )) : (
              <div style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '16px', fontSize: '14px', color: '#64748b' }}>
                No open opportunities available yet.
              </div>
            )}
          </div>
        </section>

        <section style={sectionCardStyle}>
          {smallLabel('Close Timing')}
          <h3 style={sectionTitle}>Weighted Revenue by Expected Close Period</h3>
          <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '12px', alignItems: 'end', minHeight: '260px' }}>
            {closePeriods.map((bucket) => (
              <div key={bucket.label} style={{ display: 'grid', gap: '8px', alignItems: 'end' }}>
                <div style={{ fontSize: '12px', textAlign: 'center', color: '#475569' }}>{formatCurrency(bucket.total)}</div>
                <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <div style={{ width: '56px', height: `${Math.max(8, (bucket.total / maxClosePeriod) * 100)}%`, borderRadius: '16px 16px 0 0', background: '#0B6771' }} />
                </div>
                <div style={{ fontSize: '12px', textAlign: 'center', color: '#64748b', fontWeight: 700 }}>{bucket.label}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.95fr) minmax(0, 1.05fr)', gap: '18px' }}>
        <section style={sectionCardStyle}>
          {smallLabel('Pipeline by Owner')}
          <h3 style={sectionTitle}>Owner concentration</h3>
          <div style={{ marginTop: '18px', display: 'grid', gap: '14px' }}>
            {ownerRows.length ? ownerRows.map((row) => (
              <div key={row.owner}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>{row.owner}</div>
                  <div style={{ fontSize: '13px', color: '#475569' }}>{formatCurrency(row.value)}</div>
                </div>
                <div style={barTrack}>
                  <div style={{ width: `${(row.value / maxOwnerValue) * 100}%`, height: '100%', background: '#2A83C5' }} />
                </div>
              </div>
            )) : (
              <div style={{ fontSize: '14px', color: '#64748b' }}>No owner pipeline data available.</div>
            )}
          </div>
        </section>

        <section style={sectionCardStyle}>
          {smallLabel('At-Risk Deals')}
          <h3 style={sectionTitle}>Ranked exception table</h3>
          <div style={{ marginTop: '16px', display: 'grid', gap: '10px' }}>
            {atRiskDeals.length ? atRiskDeals.slice(0, 10).map((item) => (
              <div key={item.id} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '14px 16px' }}>
                <div style={{ display: 'grid', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{item.name || 'Opportunity'}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#B25547' }}>{String(item?.staleness_flag || 'At Risk')}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    {ownerFor(item)} • {item.stage || 'No Stage'} • {item.forecast_category || 'Pipeline'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {riskReasonFor(item)}
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '16px', fontSize: '14px', color: '#64748b' }}>
                No at-risk deals currently flagged.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function renderWelcomePage({ onStartNewContact, onStartNewAccount, onStartNewOpportunity }) {
  const quickStartSteps = [
    {
      number: '1',
      title: 'Create a New Contact',
      body: 'Start with the person first so communication, title, and ownership are established before tying them to a customer record.',
      bg: '#EAF4EC',
      border: '#CFE3D4',
      numberBg: '#6D8F72',
      numberText: '#FFFFFF',
    },
    {
      number: '2',
      title: 'Create a New Account',
      body: 'Set up the company or customer record next so contacts, opportunities, and future work all point to the same account structure.',
      bg: '#EEF7F8',
      border: '#CFE3E8',
      numberBg: '#0B6771',
      numberText: '#FFFFFF',
    },
    {
      number: '3',
      title: 'Create a New Opportunity',
      body: 'After the account and contact exist, open the commercial opportunity and begin pricing, forecasting, and pipeline tracking.',
      bg: '#EEF5FB',
      border: '#D4E3F2',
      numberBg: '#2A83C5',
      numberText: '#FFFFFF',
    },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' }}>
      <section style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(360px, 0.8fr)', gap: '22px', alignItems: 'start' }}>
        <div style={{ ...shellCard, padding: '22px 22px 20px 22px' }}>
          {smallLabel('Tutorial Video')}
          <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
            Tutorial Video
          </h3>
          <p style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.6, color: '#475569', maxWidth: '760px' }}>
            Use this walkthrough to get oriented quickly and understand how to work through the CRM.
          </p>

          <div style={{ marginTop: '16px' }}>
            <div style={{
              borderRadius: '22px',
              overflow: 'hidden',
              border: '1px solid #CFE3E8',
              boxShadow: '0 10px 28px rgba(15, 23, 42, 0.10)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: 'linear-gradient(90deg, #07555E 0%, #2093B1 100%)',
                color: '#fff'
              }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.20em', textTransform: 'uppercase', opacity: 0.9 }}>
                    Tutorial Video
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '16px', fontWeight: 700 }}>
                    NAES CRM Walkthrough
                  </div>
                </div>
              </div>

              <div style={{ background: '#071E22', aspectRatio: '16 / 9' }}>
                <iframe
                  src="https://player.vimeo.com/video/1173012324?title=0&byline=0&portrait=0"
                  title="Tutorial Video"
                  style={{ display: 'block', width: '100%', height: '100%', border: '0' }}
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...shellCard, padding: '22px 22px 20px 22px' }}>
          {smallLabel('Quick Start')}
          <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
            Recommended setup sequence
          </h3>
          <p style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.6, color: '#475569' }}>
            Follow this order to keep CRM records clean and tied together correctly.
          </p>

          <div style={{ marginTop: '16px', display: 'grid', gap: '14px' }}>
            {quickStartSteps.map((step) => (
              <div
                key={step.number}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (step.number === '1') onStartNewContact?.();
                  if (step.number === '2') onStartNewAccount?.();
                  if (step.number === '3') onStartNewOpportunity?.();
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return;
                  event.preventDefault();
                  if (step.number === '1') onStartNewContact?.();
                  if (step.number === '2') onStartNewAccount?.();
                  if (step.number === '3') onStartNewOpportunity?.();
                }}
                style={{
                  borderRadius: '22px',
                  border: `1px solid ${step.border}`,
                  background: step.bg,
                  padding: '16px',
                  boxShadow: '0 6px 18px rgba(15, 23, 42, 0.04)',
                  cursor: 'pointer',
                  opacity: 1,
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '42px 1fr', gap: '14px', alignItems: 'start' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '999px',
                    background: step.numberBg,
                    color: step.numberText,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 800,
                    boxShadow: '0 8px 18px rgba(15,23,42,0.12)',
                  }}>
                    {step.number}
                  </div>

                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                      {step.title}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.6, color: '#475569' }}>
                      {step.body}
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '2px 6px 6px 6px' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#334155', fontSize: '13px', fontWeight: 700 }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#B11226', boxShadow: '0 0 0 4px rgba(177,18,38,0.10)' }} />
            Powered by NAES
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', color: '#334155', fontSize: '13px', fontWeight: 700 }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#E17A24', boxShadow: '0 0 0 4px rgba(225,122,36,0.10)' }} />
            Native infrastructure provided by AWS
          </div>
        </div>
      </section>
    </div>
  );
}

function renderMyPipelinePage({ opportunities = [], taskList = [], onOpenOpportunity } = {}) {
  function normalizeText(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function revenueFor(item) {
    return toNumber(
      item?.calculated_revenue ??
      item?.amount_total ??
      item?.calc_year1_total ??
      item?.amount_estimated ??
      item?.calc_arr_total ??
      item?.arr_total ??
      0
    );
  }

  function forecastCategoryFor(item) {
    const raw = normalizeText(item?.forecast_category ?? item?.forecastCategory);
    if (raw === 'bestcase' || raw === 'best case') return 'Best Case';
    if (raw === 'commit') return 'Commit';
    if (raw === 'closedwon' || raw === 'closed won' || raw === 'closed') return 'Closed Won';
    if (raw === 'closedlost' || raw === 'closed lost') return 'Closed Lost';
    return 'Pipeline';
  }

  function stageFor(item) {
    return String(item?.stage ?? item?.salesStage ?? item?.stage_name ?? item?.stageName ?? '0 Prospecting').trim();
  }

  function expectedCloseFor(item) {
    return String(item?.expected_close_date || '').trim();
  }

  function ownerFor(item) {
    return String(item?.owner_full_name ?? item?.owner ?? 'Unassigned').trim() || 'Unassigned';
  }

  function isClosedWon(item) {
    const stage = normalizeText(stageFor(item));
    const forecast = normalizeText(forecastCategoryFor(item));
    return stage === 'closedwon' || forecast === 'closedwon';
  }

  function isClosedLost(item) {
    const stage = normalizeText(stageFor(item));
    const forecast = normalizeText(forecastCategoryFor(item));
    return stage === 'closedlost' || forecast === 'closedlost';
  }

  function isOpen(item) {
    return !isClosedWon(item) && !isClosedLost(item);
  }

  const currentOwner = 'Jeff Yarbrough';

  const myOpportunities = (Array.isArray(opportunities) ? opportunities : [])
    .filter((item) => ownerFor(item) === currentOwner)
    .filter((item) => isOpen(item));

  const stageCounts = myOpportunities.reduce((acc, item) => {
    const key = stageFor(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const stageMix = Object.entries(stageCounts)
    .map(([stage, count]) => ({ stage, count }))
    .sort((a, b) => a.stage.localeCompare(b.stage, undefined, { numeric: true }));

  const attentionItems = myOpportunities
    .filter((item) => {
      const followUp = String(item?.follow_up_status || item?.staleness_flag || '').trim();
      const hygiene = String(item?.forecast_hygiene_status || '').trim();
      return followUp === 'Overdue' || followUp === 'DueSoon' || followUp === 'AtRisk' || hygiene === 'Warning' || hygiene === 'AtRisk';
    })
    .slice(0, 6);

  const myOpportunityIds = new Set(myOpportunities.map((item) => String(item?.id || '').trim()).filter(Boolean));

  const upcomingTasks = (Array.isArray(taskList) ? taskList : [])
    .filter((task) => String(task?.owner || '').trim() === currentOwner)
    .filter((task) => String(task?.status || 'Not Started').trim() !== 'Completed')
    .filter((task) => {
      const opportunityId = String(task?.opportunityId || '').trim();
      return opportunityId && myOpportunityIds.has(opportunityId);
    })
    .sort((a, b) => {
      const aDate = String(a?.dueDate || '').trim();
      const bDate = String(b?.dueDate || '').trim();
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return aDate.localeCompare(bDate);
    })
    .slice(0, 6)
    .map((task) => {
      const linkedOpportunity = myOpportunities.find((item) => String(item?.id || '').trim() === String(task?.opportunityId || '').trim());
      const dueText = String(task?.dueDate || '').trim() || 'No due date';
      return {
        id: task?.id || `task-${Math.random().toString(36).slice(2)}`,
        title: task?.title || 'Task',
        account: linkedOpportunity?.account_name || linkedOpportunity?.account || 'No linked account',
        dueLabel: `${task?.priority || 'Medium'} • ${dueText}`,
        opportunityId: task?.opportunityId || ''
      };
    });

  const currency = (value) =>
    Number(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

  const pageStyle = {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'grid',
    gap: '24px'
  };

  const heroCardStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '24px',
    padding: '28px 30px',
    boxShadow: '0 18px 40px rgba(5, 47, 53, 0.08)'
  };

  const sectionCardStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '22px',
    padding: '24px 24px 22px',
    boxShadow: '0 14px 34px rgba(5, 47, 53, 0.06)'
  };

  const sectionTitleStyle = {
    margin: 0,
    fontSize: '22px',
    lineHeight: 1.2,
    fontWeight: 800,
    color: '#123B42'
  };

  const sectionIntroStyle = {
    margin: '6px 0 0',
    fontSize: '14px',
    lineHeight: 1.6,
    color: '#5F6F72'
  };

  const statGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: '16px'
  };

  const statCardStyle = {
    background: '#F7FBF8',
    border: '1px solid #D9E4DA',
    borderRadius: '18px',
    padding: '18px 18px 16px'
  };

  const statLabelStyle = {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#5F6F72'
  };

  const statValueStyle = {
    marginTop: '8px',
    fontSize: '28px',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    color: '#123B42'
  };

  const listRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2.1fr) minmax(140px, 0.8fr) minmax(140px, 0.8fr) minmax(140px, 0.8fr) minmax(150px, 0.9fr)',
    gap: '14px',
    alignItems: 'center',
    padding: '14px 16px',
    border: '1px solid #E3ECE4',
    borderRadius: '16px',
    background: '#FFFFFF',
    cursor: 'pointer'
  };

  const mutedStyle = {
    fontSize: '13px',
    color: '#5F6F72'
  };

  return (
    <div style={pageStyle}>
      <div style={heroCardStyle}>
        <div style={{ display: 'grid', gap: '18px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3F8F66' }}>
              Seller Working View
            </div>
            <h2 style={{ margin: '10px 0 0', fontSize: '34px', lineHeight: 1.08, fontWeight: 850, letterSpacing: '-0.03em', color: '#123B42' }}>
              My Pipeline
            </h2>
            <p style={{ margin: '10px 0 0', maxWidth: '760px', fontSize: '15px', lineHeight: 1.7, color: '#5F6F72' }}>
              Rep-owned working page for active opportunities, stage progress, near-term attention, and execution follow-through. This is not the executive roll-up.
            </p>
          </div>

          <div style={statGridStyle}>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Open Deals</div>
              <div style={statValueStyle}>{myOpportunities.length}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Pipeline Revenue</div>
              <div style={statValueStyle}>{currency(myOpportunities.reduce((sum, item) => sum + revenueFor(item), 0))}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Attention Items</div>
              <div style={statValueStyle}>{attentionItems.length}</div>
            </div>
            <div style={statCardStyle}>
              <div style={statLabelStyle}>Upcoming Tasks</div>
              <div style={statValueStyle}>{upcomingTasks.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={sectionCardStyle}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={sectionTitleStyle}>My Open Deals</h3>
          <p style={sectionIntroStyle}>
            Primary owned-deal working list. Click any row to open the opportunity detail page.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {myOpportunities.length === 0 ? (
            <div style={{ padding: '18px', border: '1px dashed #D9E4DA', borderRadius: '16px', color: '#5F6F72', background: '#F7FBF8' }}>
              No owned open opportunities are currently available.
            </div>
          ) : myOpportunities.map((item) => (
            <div
              key={item.id}
              style={listRowStyle}
              onClick={() => onOpenOpportunity && onOpenOpportunity(item.id)}
            >
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#123B42' }}>
                  {item?.name || 'Untitled opportunity'}
                </div>
                <div style={{ marginTop: '4px', fontSize: '13px', color: '#5F6F72' }}>
                  {item?.account_name || item?.account || 'No linked account'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#7A8B8E' }}>Stage</div>
                <div style={{ marginTop: '4px', fontSize: '14px', fontWeight: 700, color: '#123B42' }}>{stageFor(item)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#7A8B8E' }}>Forecast</div>
                <div style={{ marginTop: '4px', fontSize: '14px', fontWeight: 700, color: '#123B42' }}>{forecastCategoryFor(item)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#7A8B8E' }}>Close</div>
                <div style={{ marginTop: '4px', fontSize: '14px', fontWeight: 700, color: '#123B42' }}>{expectedCloseFor(item) || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#7A8B8E' }}>Revenue</div>
                <div style={{ marginTop: '4px', fontSize: '14px', fontWeight: 800, color: '#123B42' }}>{currency(revenueFor(item))}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
        <div style={sectionCardStyle}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={sectionTitleStyle}>Stage Mix</h3>
            <p style={sectionIntroStyle}>
              Quick view of where owned active deals currently sit in the pipeline.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {stageMix.length === 0 ? (
              <div style={mutedStyle}>No stage data available.</div>
            ) : stageMix.map((item) => (
              <div key={item.stage} style={{ display: 'grid', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#123B42' }}>{item.stage}</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#3F8F66' }}>{item.count}</div>
                </div>
                <div style={{ height: '10px', borderRadius: '999px', background: '#E8F1EA', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.max(12, (item.count / Math.max(...stageMix.map((row) => row.count), 1)) * 100)}%`,
                      height: '100%',
                      borderRadius: '999px',
                      background: 'linear-gradient(90deg, #3F8F66, #76B58B)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={sectionCardStyle}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={sectionTitleStyle}>Attention Items</h3>
            <p style={sectionIntroStyle}>
              Stale follow-ups, weak hygiene, and deals that need near-term action.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {attentionItems.length === 0 ? (
              <div style={mutedStyle}>No immediate attention items.</div>
            ) : attentionItems.map((item) => (
              <div key={item.id} style={{ border: '1px solid #E3ECE4', borderRadius: '16px', padding: '14px 16px', background: '#FFFFFF' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#123B42' }}>{item?.name || 'Untitled opportunity'}</div>
                <div style={{ marginTop: '4px', fontSize: '13px', color: '#5F6F72' }}>
                  {item?.account_name || item?.account || 'No linked account'}
                </div>
                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ padding: '6px 10px', borderRadius: '999px', background: '#F6E8C8', color: '#7A5A00', fontSize: '12px', fontWeight: 700 }}>
                    {item?.follow_up_status || item?.staleness_flag || 'Current'}
                  </span>
                  <span style={{ padding: '6px 10px', borderRadius: '999px', background: '#F4E0DD', color: '#9D4B42', fontSize: '12px', fontWeight: 700 }}>
                    {item?.forecast_hygiene_status || 'Healthy'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={sectionCardStyle}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={sectionTitleStyle}>Upcoming Tasks</h3>
          <p style={sectionIntroStyle}>
            Execution-oriented follow-through tied back to owned opportunities.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {upcomingTasks.length === 0 ? (
            <div style={mutedStyle}>No upcoming tasks generated from current attention items.</div>
          ) : upcomingTasks.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', border: '1px solid #E3ECE4', borderRadius: '16px', padding: '14px 16px', background: '#FFFFFF' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#123B42' }}>{item.title}</div>
                <div style={{ marginTop: '4px', fontSize: '13px', color: '#5F6F72' }}>{item.account}</div>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#3F8F66' }}>{item.dueLabel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



const accountRecords = [];

const contactRecords = [];

function renderPipelineRollupPage({ opportunities = [], onOpenOpportunity } = {}) {
  function normalizeText(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function revenueFor(item) {
    return toNumber(
      item?.calculated_revenue ??
      item?.amount_total ??
      item?.calc_year1_total ??
      item?.amount_estimated ??
      item?.calc_arr_total ??
      item?.arr_total ??
      0
    );
  }

  function weightedFor(item) {
    const explicitWeighted = toNumber(
      item?.weighted_revenue ??
      item?.amount_weighted ??
      item?.weightedRevenue ??
      item?.weighted_value
    );
    if (explicitWeighted > 0) return explicitWeighted;

    const probability = toNumber(
      item?.probability ??
      item?.forecast_probability ??
      item?.forecastProbability
    );

    return revenueFor(item) * (probability > 0 ? probability / 100 : 0);
  }

  function forecastCategoryFor(item) {
    const raw = normalizeText(item?.forecast_category ?? item?.forecastCategory);
    if (raw == 'bestcase' || raw == 'best case') return 'Best Case';
    if (raw == 'commit') return 'Commit';
    if (raw == 'closedwon' || raw == 'closed won' || raw == 'closed') return 'Closed Won';
    if (raw == 'closedlost' || raw == 'closed lost') return 'Closed Lost';
    return 'Pipeline';
  }

  function stageFor(item) {
    return String(item?.stage ?? item?.salesStage ?? item?.stage_name ?? item?.stageName ?? '0 Prospecting').trim();
  }

  function expectedCloseFor(item) {
    return String(item?.expected_close_date || '').trim();
  }

  function ownerFor(item) {
    return String(item?.owner_full_name ?? item?.owner ?? 'Unassigned').trim() || 'Unassigned';
  }

  function isClosedWon(item) {
    const stage = normalizeText(stageFor(item));
    const forecast = normalizeText(forecastCategoryFor(item));
    return stage === 'closedwon' || forecast === 'closedwon';
  }

  function isClosedLost(item) {
    const stage = normalizeText(stageFor(item));
    const forecast = normalizeText(forecastCategoryFor(item));
    return stage === 'closedlost' || forecast === 'closedlost';
  }

  function isOpen(item) {
    return !isClosedWon(item) && !isClosedLost(item);
  }

  function riskReasonFor(item) {
    const reasons = [];
    const stale = String(item?.staleness_flag || '').trim();
    if (stale) reasons.push(stale);
    if (!expectedCloseFor(item)) reasons.push('Missing close date');
    if (!toNumber(item?.probability) && forecastCategoryFor(item) !== 'Pipeline') reasons.push('No probability');
    const hygiene = String(item?.forecast_hygiene_status || '').trim();
    if (hygiene && hygiene !== 'Healthy') reasons.push(hygiene);
    return reasons.join(', ') || 'Monitor';
  }

  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const openOpportunities = safeOpportunities.filter(isOpen);
  const commitDeals = openOpportunities.filter((item) => forecastCategoryFor(item) === 'Commit');

  const totalPipeline = openOpportunities.reduce((sum, item) => sum + revenueFor(item), 0);
  const weightedPipeline = openOpportunities.reduce((sum, item) => sum + weightedFor(item), 0);
  const arrTotal = openOpportunities.reduce((sum, item) => sum + toNumber(item?.calc_arr_total ?? item?.arr_total ?? 0), 0);
  const year1Total = openOpportunities.reduce((sum, item) => sum + toNumber(item?.calc_year1_total ?? item?.amount_estimated ?? item?.amount_total ?? 0), 0);
  const oneTimeTotal = openOpportunities.reduce((sum, item) => {
    const total = toNumber(item?.amount_total ?? item?.calculated_revenue ?? item?.amount_estimated ?? 0);
    const arr = toNumber(item?.calc_arr_total ?? item?.arr_total ?? 0);
    return sum + Math.max(0, total - arr);
  }, 0);

  const stageRows = Object.entries(
    openOpportunities.reduce((acc, item) => {
      const key = stageFor(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));

  const forecastRows = ['Pipeline', 'Best Case', 'Commit', 'Closed Won', 'Closed Lost']
    .map((label) => ({
      label,
      count: safeOpportunities.filter((item) => forecastCategoryFor(item) === label).length
    }))
    .filter((row) => row.count > 0);

  const ownerRows = Object.entries(
    openOpportunities.reduce((acc, item) => {
      const owner = ownerFor(item);
      acc[owner] = (acc[owner] || 0) + revenueFor(item);
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const riskRows = [
    {
      label: 'Stale Deals',
      count: openOpportunities.filter((item) => String(item?.staleness_flag || '').toLowerCase().includes('stale')).length
    },
    {
      label: 'Commit Risk',
      count: commitDeals.filter((item) => !expectedCloseFor(item) || String(item?.forecast_hygiene_status || '').trim() === 'AtRisk').length
    },
    {
      label: 'Missing Dates',
      count: openOpportunities.filter((item) => !expectedCloseFor(item)).length
    },
    {
      label: 'Low Confidence',
      count: openOpportunities.filter((item) => {
        const hygiene = String(item?.forecast_hygiene_status || '').trim();
        return hygiene === 'Warning' || hygiene === 'AtRisk';
      }).length
    }
  ];

  const exceptionRows = openOpportunities
    .filter((item) => {
      const stale = String(item?.staleness_flag || '').trim();
      const hygiene = String(item?.forecast_hygiene_status || '').trim();
      return stale || !expectedCloseFor(item) || hygiene === 'Warning' || hygiene === 'AtRisk' || forecastCategoryFor(item) === 'Commit';
    })
    .slice(0, 8);

  const currency = (value) =>
    Number(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

  const pageStyle = { maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' };
  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 14px 34px rgba(5, 47, 53, 0.06)'
  };
  const heroStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '24px',
    padding: '28px 30px',
    boxShadow: '0 18px 40px rgba(5, 47, 53, 0.08)'
  };
  const titleStyle = { margin: 0, fontSize: '22px', lineHeight: 1.2, fontWeight: 800, color: '#123B42' };
  const introStyle = { margin: '6px 0 0', fontSize: '14px', lineHeight: 1.6, color: '#5F6F72' };
  const kpiGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '16px' };
  const kpiCardStyle = {
    background: '#F7FBF8',
    border: '1px solid #D9E4DA',
    borderRadius: '18px',
    padding: '18px 18px 16px'
  };

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3F8F66' }}>
          Management Rollup View
        </div>
        <h2 style={{ margin: '10px 0 0', fontSize: '34px', lineHeight: 1.08, fontWeight: 850, letterSpacing: '-0.03em', color: '#123B42' }}>
          Pipeline Rollup
        </h2>
        <p style={{ margin: '10px 0 0', maxWidth: '820px', fontSize: '15px', lineHeight: 1.7, color: '#5F6F72' }}>
          Broader pipeline visibility across owners, forecast groupings, revenue posture, and exception review.
        </p>
      </div>

      <div style={kpiGridStyle}>
        {[
          ['Total Pipeline', currency(totalPipeline)],
          ['Weighted Pipeline', currency(weightedPipeline)],
          ['ARR', currency(arrTotal)],
          ['Year 1 Revenue', currency(year1Total)],
          ['One-Time / Job Revenue', currency(oneTimeTotal)],
          ['Open Deal Count', String(openOpportunities.length)]
        ].map(([label, value]) => (
          <div key={label} style={kpiCardStyle}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5F6F72' }}>{label}</div>
            <div style={{ marginTop: '8px', fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em', color: '#123B42' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px' }}>
        <div style={cardStyle}>
          <h3 style={titleStyle}>Stage Mix</h3>
          <p style={introStyle}>Distribution of open deals by sales stage.</p>
          <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
            {stageRows.map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#123B42' }}>{row.label}</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#3F8F66' }}>{row.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Forecast Mix</h3>
          <p style={introStyle}>Forecast category concentration across the broader pipeline.</p>
          {renderDonutChart(
            forecastRows.map((row) => ({ label: row.label, value: row.count })),
            (value) => String(value)
          )}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>By Owner / Team</h3>
          <p style={introStyle}>Open pipeline value by owner.</p>
          <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
            {ownerRows.slice(0, 6).map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#123B42' }}>{row.label}</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#3F8F66' }}>{currency(row.value)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Aging / Risk</h3>
          <p style={introStyle}>Concentration of risk and exception indicators.</p>
          <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
            {riskRows.map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#123B42' }}>{row.label}</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#B25547' }}>{row.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={titleStyle}>Main Pipeline Rollup Table</h3>
          <p style={introStyle}>Cross-owner commercial inspection view for open opportunities.</p>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1.1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr', gap: '12px', padding: '0 8px 8px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72' }}>
            <div>Opportunity</div>
            <div>Account</div>
            <div>Owner</div>
            <div>Stage</div>
            <div>Forecast</div>
            <div>Expected Close</div>
            <div>ARR</div>
            <div>Year 1</div>
            <div>Total</div>
            <div>Weighted</div>
            <div>Health / Risk</div>
          </div>

          {openOpportunities.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenOpportunity && onOpenOpportunity(item.id)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.4fr 1.1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr',
                gap: '12px',
                alignItems: 'center',
                padding: '14px 12px',
                border: '1px solid #E3ECE4',
                borderRadius: '16px',
                background: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#123B42' }}>{item?.name || 'Untitled opportunity'}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{item?.account_name || item?.account || 'No linked account'}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{ownerFor(item)}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{stageFor(item)}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{forecastCategoryFor(item)}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{expectedCloseFor(item) || '—'}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(toNumber(item?.calc_arr_total ?? item?.arr_total ?? 0))}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(toNumber(item?.calc_year1_total ?? item?.amount_estimated ?? item?.amount_total ?? 0))}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(revenueFor(item))}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(weightedFor(item))}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#B25547' }}>{riskReasonFor(item)}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={titleStyle}>Risk / Exception Section</h3>
          <p style={introStyle}>Inspection queue for stale deals, commit risk, missing dates, and low-confidence opportunities.</p>
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {exceptionRows.length === 0 ? (
            <div style={{ fontSize: '14px', color: '#5F6F72' }}>No current exceptions detected.</div>
          ) : exceptionRows.map((item) => (
            <div key={item.id} style={{ border: '1px solid #E3ECE4', borderRadius: '16px', padding: '14px 16px', background: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#123B42' }}>{item?.name || 'Untitled opportunity'}</div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#B25547' }}>{riskReasonFor(item)}</div>
              </div>
              <div style={{ marginTop: '4px', fontSize: '13px', color: '#5F6F72' }}>
                {(item?.account_name || item?.account || 'No linked account')} • {ownerFor(item)} • {stageFor(item)} • {forecastCategoryFor(item)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderVerticalBarChart(rows = [], valueFormatter = (value) => String(value)) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const maxValue = Math.max(1, ...safeRows.map((row) => Number(row?.value || 0)));

  return (
    <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: `repeat(${Math.max(safeRows.length, 1)}, minmax(0, 1fr))`, gap: '14px', alignItems: 'end', minHeight: '220px' }}>
      {safeRows.map((row) => {
        const value = Number(row?.value || 0);
        const heightPct = Math.max(10, (value / maxValue) * 100);

        return (
          <div key={row.label} style={{ display: 'grid', gap: '10px', alignItems: 'end' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#3F8F66', textAlign: 'center' }}>
              {valueFormatter(value)}
            </div>
            <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '68px',
                  height: `${heightPct}%`,
                  minHeight: '18px',
                  borderRadius: '14px 14px 6px 6px',
                  background: 'linear-gradient(180deg, #76B58B 0%, #3F8F66 100%)',
                  boxShadow: '0 12px 28px rgba(63, 143, 102, 0.22)'
                }}
              />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#123B42', textAlign: 'center', lineHeight: 1.4 }}>
              {row.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderDonutChart(rows = [], valueFormatter = (value) => String(value)) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const total = safeRows.reduce((sum, row) => sum + Number(row?.value || 0), 0);

  if (!safeRows.length || total <= 0) {
    return <div style={{ marginTop: '16px', fontSize: '14px', color: '#5F6F72' }}>No chart data available.</div>;
  }

  const colors = ['#3F8F66', '#76B58B', '#0B6771', '#E1A93A', '#B25547', '#8AA6A3'];
  const labelColorMap = {
    Pipeline: '#7C8B95',
    'Best Case': '#E1A93A',
    Commit: '#3F8F66',
    'Closed Won': '#0B6771',
    'Closed Lost': '#B25547',
    Renewables: '#3F8F66',
    StratoSight: '#7FB7E6'
  };

  let running = 0;
  const segments = safeRows.map((row, index) => {
    const value = Number(row?.value || 0);
    const pct = value / total;
    const start = running * 360;
    const end = (running + pct) * 360;
    running += pct;
    return {
      ...row,
      value,
      color: labelColorMap[String(row?.label || '').trim()] || colors[index % colors.length],
      start,
      end
    };
  });

  const gradient = `conic-gradient(${segments.map((segment) => `${segment.color} ${segment.start}deg ${segment.end}deg`).join(', ')})`;

  return (
    <div style={{ marginTop: '16px', display: 'grid', gap: '18px', justifyItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <div
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: gradient,
            position: 'relative',
            boxShadow: '0 16px 30px rgba(5, 47, 53, 0.12)'
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '24px',
              borderRadius: '50%',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5F6F72' }}>
              Total
            </div>
            <div style={{ marginTop: '6px', fontSize: '16px', fontWeight: 800, color: '#123B42' }}>
              {valueFormatter(total)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', display: 'grid', gap: '10px' }}>
        {segments.map((segment) => (
          <div
            key={segment.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '14px minmax(0, 1fr) auto',
              gap: '10px',
              alignItems: 'center'
            }}
          >
            <div style={{ width: '14px', height: '14px', borderRadius: '999px', background: segment.color }} />
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#123B42', lineHeight: 1.35, wordBreak: 'break-word' }}>
              {segment.label}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#3F8F66', whiteSpace: 'nowrap' }}>
              {valueFormatter(segment.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderHorizontalBarChart(rows = [], valueFormatter = (value) => String(value)) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const maxValue = Math.max(1, ...safeRows.map((row) => Number(row?.value || 0)));

  if (!safeRows.length) {
    return <div style={{ marginTop: '16px', fontSize: '14px', color: '#5F6F72' }}>No chart data available.</div>;
  }

  return (
    <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
      {safeRows.map((row) => {
        const value = Number(row?.value || 0);
        const widthPct = Math.max(10, (value / maxValue) * 100);

        return (
          <div key={row.label} style={{ display: 'grid', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#123B42' }}>{row.label}</div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0B6771' }}>{valueFormatter(value)}</div>
            </div>
            <div style={{ height: '14px', borderRadius: '999px', background: '#E7EFF0', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${widthPct}%`,
                  height: '100%',
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #0B6771 0%, #21A7B2 100%)',
                  boxShadow: '0 8px 18px rgba(11, 103, 113, 0.18)'
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function renderRevenueCommandCenterPage({ opportunities = [], onOpenOpportunity } = {}) {
  function normalizeText(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function revenueFor(item) {
    return toNumber(
      item?.calculated_revenue ??
      item?.amount_total ??
      item?.calc_year1_total ??
      item?.amount_estimated ??
      item?.calc_arr_total ??
      item?.arr_total ??
      0
    );
  }

  function weightedFor(item) {
    const explicitWeighted = toNumber(
      item?.weighted_revenue ??
      item?.amount_weighted ??
      item?.weightedRevenue ??
      item?.weighted_value
    );
    if (explicitWeighted > 0) return explicitWeighted;

    const probability = toNumber(
      item?.probability ??
      item?.forecast_probability ??
      item?.forecastProbability
    );

    return revenueFor(item) * (probability > 0 ? probability / 100 : 0);
  }

  function forecastCategoryFor(item) {
    const raw = normalizeText(item?.forecast_category ?? item?.forecastCategory);
    if (raw === 'bestcase' || raw === 'best case') return 'Best Case';
    if (raw === 'commit') return 'Commit';
    if (raw === 'closedwon' || raw === 'closed won' || raw === 'closed') return 'Closed Won';
    if (raw === 'closedlost' || raw === 'closed lost') return 'Closed Lost';
    return 'Pipeline';
  }

  function stageFor(item) {
    return String(item?.stage ?? item?.salesStage ?? item?.stage_name ?? item?.stageName ?? '0 Prospecting').trim();
  }

  function expectedCloseFor(item) {
    return String(item?.expected_close_date || '').trim();
  }

  function ownerFor(item) {
    return String(item?.owner_full_name ?? item?.owner ?? 'Unassigned').trim() || 'Unassigned';
  }

  function serviceLineFor(item) {
    return String(item?.service_line ?? item?.serviceLine ?? 'Unassigned').trim() || 'Unassigned';
  }

  function isClosedWon(item) {
    const stage = normalizeText(stageFor(item));
    const forecast = normalizeText(forecastCategoryFor(item));
    return stage === 'closedwon' || forecast === 'closedwon';
  }

  function isClosedLost(item) {
    const stage = normalizeText(stageFor(item));
    const forecast = normalizeText(forecastCategoryFor(item));
    return stage === 'closedlost' || forecast === 'closedlost';
  }

  function isOpen(item) {
    return !isClosedWon(item) && !isClosedLost(item);
  }

  function riskReasonFor(item) {
    const reasons = [];
    const stale = String(item?.staleness_flag || '').trim();
    if (stale) reasons.push(stale);
    if (!expectedCloseFor(item)) reasons.push('Missing close date');
    const hygiene = String(item?.forecast_hygiene_status || '').trim();
    if (hygiene && hygiene !== 'Healthy') reasons.push(hygiene);
    if (forecastCategoryFor(item) === 'Commit' && !expectedCloseFor(item)) reasons.push('Commit at risk');
    return reasons.join(', ') || 'Monitor';
  }

  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const openOpportunities = safeOpportunities.filter(isOpen);
  const commitDeals = openOpportunities.filter((item) => forecastCategoryFor(item) === 'Commit');

  const totalPipelineRevenue = openOpportunities.reduce((sum, item) => sum + revenueFor(item), 0);
  const weightedRevenue = openOpportunities.reduce((sum, item) => sum + weightedFor(item), 0);
  const arrTotal = openOpportunities.reduce((sum, item) => sum + toNumber(item?.calc_arr_total ?? item?.arr_total ?? 0), 0);
  const year1Total = openOpportunities.reduce((sum, item) => sum + toNumber(item?.calc_year1_total ?? item?.amount_estimated ?? item?.amount_total ?? 0), 0);
  const oneTimeRevenue = openOpportunities.reduce((sum, item) => {
    const total = revenueFor(item);
    const arr = toNumber(item?.calc_arr_total ?? item?.arr_total ?? 0);
    return sum + Math.max(0, total - arr);
  }, 0);
  const avgDealSize = openOpportunities.length ? totalPipelineRevenue / openOpportunities.length : 0;

  const stageRevenueRows = Object.entries(
    openOpportunities.reduce((acc, item) => {
      const key = stageFor(item);
      acc[key] = (acc[key] || 0) + revenueFor(item);
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const forecastRevenueRows = ['Pipeline', 'Best Case', 'Commit', 'Closed Won', 'Closed Lost']
    .map((label) => ({
      label,
      value: safeOpportunities
        .filter((item) => forecastCategoryFor(item) === label)
        .reduce((sum, item) => sum + revenueFor(item), 0)
    }))
    .filter((row) => row.value > 0);

  const ownerRevenueRows = Object.entries(
    openOpportunities.reduce((acc, item) => {
      const owner = ownerFor(item);
      acc[owner] = (acc[owner] || 0) + weightedFor(item);
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const serviceLineRows = Object.entries(
    openOpportunities.reduce((acc, item) => {
      const serviceLine = serviceLineFor(item);
      acc[serviceLine] = (acc[serviceLine] || 0) + revenueFor(item);
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const closeTimingRows = [
    {
      label: 'Current Quarter',
      count: openOpportunities.filter((item) => {
        const close = expectedCloseFor(item);
        if (!close) return false;
        return close.startsWith('2026-04') || close.startsWith('2026-05') || close.startsWith('2026-06');
      }).length
    },
    {
      label: 'Next Quarter',
      count: openOpportunities.filter((item) => {
        const close = expectedCloseFor(item);
        if (!close) return false;
        return close.startsWith('2026-07') || close.startsWith('2026-08') || close.startsWith('2026-09');
      }).length
    },
    {
      label: 'Later',
      count: openOpportunities.filter((item) => {
        const close = expectedCloseFor(item);
        if (!close) return false;
        return close >= '2026-10-01';
      }).length
    }
  ];

  const qualityRows = [
    {
      label: 'Commit Revenue at Risk',
      value: commitDeals
        .filter((item) => !expectedCloseFor(item) || String(item?.forecast_hygiene_status || '').trim() === 'AtRisk')
        .reduce((sum, item) => sum + weightedFor(item), 0)
    },
    {
      label: 'Stale Weighted Revenue',
      value: openOpportunities
        .filter((item) => String(item?.staleness_flag || '').trim())
        .reduce((sum, item) => sum + weightedFor(item), 0)
    },
    {
      label: 'Missing Close Dates',
      value: openOpportunities.filter((item) => !expectedCloseFor(item)).length
    },
    {
      label: 'Large Deals, Weak Hygiene',
      value: openOpportunities.filter((item) => revenueFor(item) >= 250000 && ['Warning', 'AtRisk'].includes(String(item?.forecast_hygiene_status || '').trim())).length
    }
  ];

  const revenueRows = openOpportunities
    .slice()
    .sort((a, b) => weightedFor(b) - weightedFor(a));

  const currency = (value) =>
    Number(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

  const pageStyle = { maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' };
  const heroStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '24px',
    padding: '28px 30px',
    boxShadow: '0 18px 40px rgba(5, 47, 53, 0.08)'
  };
  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 14px 34px rgba(5, 47, 53, 0.06)'
  };
  const titleStyle = { margin: 0, fontSize: '22px', lineHeight: 1.2, fontWeight: 800, color: '#123B42' };
  const introStyle = { margin: '6px 0 0', fontSize: '14px', lineHeight: 1.6, color: '#5F6F72' };
  const kpiGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '16px' };
  const kpiCardStyle = {
    background: '#F7FBF8',
    border: '1px solid #D9E4DA',
    borderRadius: '18px',
    padding: '18px 18px 16px'
  };

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3F8F66' }}>
          Commercial Leadership View
        </div>
        <h2 style={{ margin: '10px 0 0', fontSize: '34px', lineHeight: 1.08, fontWeight: 850, letterSpacing: '-0.03em', color: '#123B42' }}>
          Revenue Command Center
        </h2>
        <p style={{ margin: '10px 0 0', maxWidth: '820px', fontSize: '15px', lineHeight: 1.7, color: '#5F6F72' }}>
          Commercial revenue visibility across pipeline, forecast, ownership, concentration, and revenue quality.
        </p>
      </div>

      <div style={kpiGridStyle}>
        {[
          ['Total Pipeline Revenue', currency(totalPipelineRevenue)],
          ['Weighted Revenue', currency(weightedRevenue)],
          ['ARR', currency(arrTotal)],
          ['Year 1 Revenue', currency(year1Total)],
          ['One-Time / Project Revenue', currency(oneTimeRevenue)],
          ['Open Opportunities', String(openOpportunities.length)],
          ['Average Deal Size', currency(avgDealSize)]
        ].map(([label, value]) => (
          <div key={label} style={kpiCardStyle}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5F6F72' }}>{label}</div>
            <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: '#123B42' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px' }}>
        <div style={cardStyle}>
          <h3 style={titleStyle}>Revenue by Stage</h3>
          <p style={introStyle}>Where total revenue currently sits in the stage model.</p>
          {renderVerticalBarChart(stageRevenueRows, currency)}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Revenue by Forecast Category</h3>
          <p style={introStyle}>Pipeline, Best Case, Commit, and closed-category revenue mix.</p>
          {renderDonutChart(forecastRevenueRows, currency)}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Revenue by Owner</h3>
          <p style={introStyle}>Weighted revenue concentration by owner.</p>
          {renderHorizontalBarChart(ownerRevenueRows.slice(0, 8), currency)}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Revenue by Service Line / Product Mix</h3>
          <p style={introStyle}>Commercial volume concentration by service line.</p>
          {renderDonutChart(serviceLineRows, currency)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        <div style={cardStyle}>
          <h3 style={titleStyle}>Revenue Aging / Close Timing</h3>
          <p style={introStyle}>Near-term versus later close concentration.</p>
          {renderVerticalBarChart(
            closeTimingRows.map((row) => ({ label: row.label, value: row.count })),
            (value) => String(value)
          )}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Revenue Quality / Risk</h3>
          <p style={introStyle}>Believability and concentration signals for forecast discussion.</p>
          <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
            {qualityRows.map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#123B42' }}>{row.label}</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#B25547' }}>
                  {typeof row.value === 'number' && row.label.includes('Revenue') ? currency(row.value) : row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={titleStyle}>Main Revenue Table</h3>
          <p style={introStyle}>Revenue inspection view for leadership and forecast reviews.</p>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr', gap: '12px', padding: '0 8px 8px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72' }}>
            <div>Opportunity</div>
            <div>Account</div>
            <div>Owner</div>
            <div>Stage</div>
            <div>Forecast</div>
            <div>Expected Close</div>
            <div>ARR</div>
            <div>Year 1</div>
            <div>One-Time</div>
            <div>Total</div>
            <div>Weighted</div>
            <div>Status / Risk</div>
          </div>

          {revenueRows.map((item) => {
            const total = revenueFor(item);
            const arr = toNumber(item?.calc_arr_total ?? item?.arr_total ?? 0);
            const oneTime = Math.max(0, total - arr);

            return (
              <div
                key={item.id}
                onClick={() => onOpenOpportunity && onOpenOpportunity(item.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '14px 12px',
                  border: '1px solid #E3ECE4',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#123B42' }}>{item?.name || 'Untitled opportunity'}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{item?.account_name || item?.account || 'No linked account'}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{ownerFor(item)}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{stageFor(item)}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{forecastCategoryFor(item)}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{expectedCloseFor(item) || '—'}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(arr)}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(toNumber(item?.calc_year1_total ?? item?.amount_estimated ?? item?.amount_total ?? 0))}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(oneTime)}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(total)}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(weightedFor(item))}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#B25547' }}>{riskReasonFor(item)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function renderForecastDashboardPage({ opportunities = [], onOpenOpportunity } = {}) {
  function normalizeText(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function revenueFor(item) {
    return toNumber(
      item?.calculated_revenue ??
      item?.amount_total ??
      item?.calc_year1_total ??
      item?.amount_estimated ??
      item?.calc_arr_total ??
      item?.arr_total ??
      0
    );
  }

  function weightedFor(item) {
    const explicitWeighted = toNumber(
      item?.weighted_revenue ??
      item?.amount_weighted ??
      item?.weightedRevenue ??
      item?.weighted_value
    );
    if (explicitWeighted > 0) return explicitWeighted;

    const probability = forecastProbabilityFor(item);
    return revenueFor(item) * (probability > 0 ? probability / 100 : 0);
  }

  function forecastProbabilityFor(item) {
    const explicit = toNumber(item?.forecast_probability ?? item?.forecastProbability ?? item?.probability);
    if (explicit > 0) return explicit;

    const category = forecastCategoryFor(item);
    if (category === 'Commit') return 90;
    if (category === 'Best Case') return 70;
    if (category === 'Pipeline') return 30;
    if (category === 'Closed Won') return 100;
    if (category === 'Closed Lost') return 0;
    return 0;
  }

  function forecastCategoryFor(item) {
    const raw = normalizeText(item?.forecast_category ?? item?.forecastCategory);
    if (raw === 'bestcase' || raw === 'best case') return 'Best Case';
    if (raw === 'commit') return 'Commit';
    if (raw === 'closedwon' || raw === 'closed won' || raw === 'closed') return 'Closed Won';
    if (raw === 'closedlost' || raw === 'closed lost') return 'Closed Lost';
    return 'Pipeline';
  }

  function stageFor(item) {
    return String(item?.stage ?? item?.salesStage ?? item?.stage_name ?? item?.stageName ?? '0 Prospecting').trim();
  }

  function expectedCloseFor(item) {
    return String(item?.expected_close_date || '').trim();
  }

  function ownerFor(item) {
    return String(item?.owner_full_name ?? item?.owner ?? 'Unassigned').trim() || 'Unassigned';
  }

  function isClosedWon(item) {
    return forecastCategoryFor(item) === 'Closed Won';
  }

  function isClosedLost(item) {
    return forecastCategoryFor(item) === 'Closed Lost';
  }

  function isOpen(item) {
    return !isClosedWon(item) && !isClosedLost(item);
  }

  function confidenceFor(item) {
    const hygiene = String(item?.forecast_hygiene_status || '').trim();
    const probability = forecastProbabilityFor(item);
    if (hygiene === 'AtRisk') return Math.max(0, probability - 35);
    if (hygiene === 'Warning') return Math.max(0, probability - 15);
    return probability;
  }

  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const openOpportunities = safeOpportunities.filter(isOpen);
  const commitDeals = openOpportunities.filter((item) => forecastCategoryFor(item) === 'Commit');
  const bestCaseDeals = openOpportunities.filter((item) => forecastCategoryFor(item) === 'Best Case');
  const pipelineDeals = openOpportunities.filter((item) => forecastCategoryFor(item) === 'Pipeline');

  const commitRevenue = commitDeals.reduce((sum, item) => sum + revenueFor(item), 0);
  const bestCaseRevenue = bestCaseDeals.reduce((sum, item) => sum + revenueFor(item), 0);
  const pipelineRevenue = pipelineDeals.reduce((sum, item) => sum + revenueFor(item), 0);
  const closedWonCurrentPeriod = safeOpportunities
    .filter((item) => forecastCategoryFor(item) === 'Closed Won')
    .reduce((sum, item) => sum + revenueFor(item), 0);

  const forecastThisPeriod = openOpportunities
    .filter((item) => {
      const close = expectedCloseFor(item);
      return close.startsWith('2026-04') || close.startsWith('2026-05') || close.startsWith('2026-06');
    })
    .reduce((sum, item) => sum + revenueFor(item), 0);

  const forecastCategoryRows = ['Pipeline', 'Best Case', 'Commit', 'Closed Won', 'Closed Lost']
    .map((label) => ({
      label,
      value: safeOpportunities
        .filter((item) => forecastCategoryFor(item) === label)
        .reduce((sum, item) => sum + revenueFor(item), 0)
    }))
    .filter((row) => row.value > 0);

  const closePeriodRows = [
    {
      label: 'Current Quarter',
      value: openOpportunities
        .filter((item) => {
          const close = expectedCloseFor(item);
          return close.startsWith('2026-04') || close.startsWith('2026-05') || close.startsWith('2026-06');
        })
        .reduce((sum, item) => sum + revenueFor(item), 0)
    },
    {
      label: 'Next Quarter',
      value: openOpportunities
        .filter((item) => {
          const close = expectedCloseFor(item);
          return close.startsWith('2026-07') || close.startsWith('2026-08') || close.startsWith('2026-09');
        })
        .reduce((sum, item) => sum + revenueFor(item), 0)
    },
    {
      label: 'Later',
      value: openOpportunities
        .filter((item) => {
          const close = expectedCloseFor(item);
          return close >= '2026-10-01';
        })
        .reduce((sum, item) => sum + revenueFor(item), 0)
    }
  ];

  const ownerForecastRows = Object.entries(
    openOpportunities.reduce((acc, item) => {
      const owner = ownerFor(item);
      if (!acc[owner]) acc[owner] = { commit: 0, bestCase: 0 };
      if (forecastCategoryFor(item) === 'Commit') acc[owner].commit += revenueFor(item);
      if (forecastCategoryFor(item) === 'Best Case') acc[owner].bestCase += revenueFor(item);
      return acc;
    }, {})
  )
    .map(([label, values]) => ({
      label,
      commit: values.commit,
      bestCase: values.bestCase,
      value: values.commit + values.bestCase
    }))
    .sort((a, b) => b.value - a.value);

  const stageAlignmentRows = Object.entries(
    openOpportunities.reduce((acc, item) => {
      const stage = stageFor(item);
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));

  const riskRows = [
    {
      label: 'Commit Missing Close Dates',
      value: commitDeals.filter((item) => !expectedCloseFor(item)).length
    },
    {
      label: 'Slipping Deals',
      value: openOpportunities.filter((item) => String(item?.staleness_flag || '').trim()).length
    },
    {
      label: 'Low Confidence',
      value: openOpportunities.filter((item) => confidenceFor(item) < 60).length
    },
    {
      label: 'Commit Risk',
      value: commitDeals.filter((item) => String(item?.forecast_hygiene_status || '').trim() === 'AtRisk').length
    }
  ];

  const inspectionRows = openOpportunities
    .slice()
    .sort((a, b) => weightedFor(b) - weightedFor(a));

  const currency = (value) =>
    Number(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

  const pageStyle = { maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' };
  const heroStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '24px',
    padding: '28px 30px',
    boxShadow: '0 18px 40px rgba(5, 47, 53, 0.08)'
  };
  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 14px 34px rgba(5, 47, 53, 0.06)'
  };
  const titleStyle = { margin: 0, fontSize: '22px', lineHeight: 1.2, fontWeight: 800, color: '#123B42' };
  const introStyle = { margin: '6px 0 0', fontSize: '14px', lineHeight: 1.6, color: '#5F6F72' };
  const kpiGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '16px' };
  const kpiCardStyle = {
    background: '#F7FBF8',
    border: '1px solid #D9E4DA',
    borderRadius: '18px',
    padding: '18px 18px 16px'
  };

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#3F8F66' }}>
          Forecast Leadership View
        </div>
        <h2 style={{ margin: '10px 0 0', fontSize: '34px', lineHeight: 1.08, fontWeight: 850, letterSpacing: '-0.03em', color: '#123B42' }}>
          Forecast Dashboard
        </h2>
        <p style={{ margin: '10px 0 0', maxWidth: '820px', fontSize: '15px', lineHeight: 1.7, color: '#5F6F72' }}>
          Leadership view of forecast category mix, close timing, confidence, and quarter-call risk.
        </p>
      </div>

      <div style={kpiGridStyle}>
        {[
          ['Commit Revenue', currency(commitRevenue)],
          ['Best Case Revenue', currency(bestCaseRevenue)],
          ['Pipeline Revenue', currency(pipelineRevenue)],
          ['Closed Won', currency(closedWonCurrentPeriod)],
          ['Forecast This Period', currency(forecastThisPeriod)],
          ['Commit Deal Count', String(commitDeals.length)]
        ].map(([label, value]) => (
          <div key={label} style={kpiCardStyle}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5F6F72' }}>{label}</div>
            <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: '#123B42' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px' }}>
        <div style={cardStyle}>
          <h3 style={titleStyle}>Forecast Category Mix</h3>
          <p style={introStyle}>Distribution of forecasted revenue by confidence bucket.</p>
          {renderDonutChart(forecastCategoryRows, currency)}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Forecast by Close Period</h3>
          <p style={introStyle}>Timing of expected closes across forecasted revenue.</p>
          {renderVerticalBarChart(closePeriodRows, currency)}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Commit vs Best Case by Owner</h3>
          <p style={introStyle}>Owner-level view of believable forecast versus soft forecast.</p>
          {renderHorizontalBarChart(ownerForecastRows.slice(0, 8), currency)}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Stage vs Forecast Alignment</h3>
          <p style={introStyle}>Simple stage-distribution proxy for forecast alignment.</p>
          {renderVerticalBarChart(stageAlignmentRows, (value) => String(value))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px' }}>
        {riskRows.map((row) => (
          <div key={row.label} style={cardStyle}>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B25547' }}>
              Forecast Risk
            </div>
            <div style={{ marginTop: '10px', fontSize: '15px', fontWeight: 700, color: '#123B42' }}>{row.label}</div>
            <div style={{ marginTop: '12px', fontSize: '30px', fontWeight: 800, color: '#B25547' }}>{row.value}</div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={titleStyle}>Forecast Inspection Table</h3>
          <p style={introStyle}>Management inspection view for forecast credibility and timing.</p>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr', gap: '12px', padding: '0 8px 8px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72' }}>
            <div>Opportunity</div>
            <div>Account</div>
            <div>Owner</div>
            <div>Stage</div>
            <div>Forecast</div>
            <div>Probability</div>
            <div>Expected Close</div>
            <div>Year 1</div>
            <div>Weighted</div>
            <div>Confidence</div>
            <div>Risk / Hygiene</div>
          </div>

          {inspectionRows.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenOpportunity && onOpenOpportunity(item.id)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.3fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                gap: '12px',
                alignItems: 'center',
                padding: '14px 12px',
                border: '1px solid #E3ECE4',
                borderRadius: '16px',
                background: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#123B42' }}>{item?.name || 'Untitled opportunity'}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{item?.account_name || item?.account || 'No linked account'}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{ownerFor(item)}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{stageFor(item)}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{forecastCategoryFor(item)}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{forecastProbabilityFor(item)}%</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{expectedCloseFor(item) || '—'}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(toNumber(item?.calc_year1_total ?? item?.amount_estimated ?? item?.amount_total ?? 0))}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(weightedFor(item))}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: confidenceFor(item) < 60 ? '#B25547' : '#3F8F66' }}>{confidenceFor(item)}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#B25547' }}>{String(item?.forecast_hygiene_status || item?.staleness_flag || 'Monitor')}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderForecastIntegrityPage({ opportunities = [], onOpenOpportunity } = {}) {
  function normalizeText(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function revenueFor(item) {
    return toNumber(
      item?.calculated_revenue ??
      item?.amount_total ??
      item?.calc_year1_total ??
      item?.amount_estimated ??
      item?.calc_arr_total ??
      item?.arr_total ??
      0
    );
  }

  function forecastProbabilityFor(item) {
    const explicit = toNumber(item?.forecast_probability ?? item?.forecastProbability ?? item?.probability);
    if (explicit > 0) return explicit;

    const category = forecastCategoryFor(item);
    if (category === 'Commit') return 90;
    if (category === 'Best Case') return 70;
    if (category === 'Pipeline') return 30;
    if (category === 'Closed Won') return 100;
    if (category === 'Closed Lost') return 0;
    return 0;
  }

  function weightedFor(item) {
    const explicitWeighted = toNumber(
      item?.weighted_revenue ??
      item?.amount_weighted ??
      item?.weightedRevenue ??
      item?.weighted_value
    );
    if (explicitWeighted > 0) return explicitWeighted;
    return revenueFor(item) * (forecastProbabilityFor(item) / 100);
  }

  function forecastCategoryFor(item) {
    const raw = normalizeText(item?.forecast_category ?? item?.forecastCategory);
    if (raw === 'bestcase' || raw === 'best case') return 'Best Case';
    if (raw === 'commit') return 'Commit';
    if (raw === 'closedwon' || raw === 'closed won' || raw === 'closed') return 'Closed Won';
    if (raw === 'closedlost' || raw === 'closed lost') return 'Closed Lost';
    return 'Pipeline';
  }

  function stageFor(item) {
    return String(item?.stage ?? item?.salesStage ?? item?.stage_name ?? item?.stageName ?? '0 Prospecting').trim();
  }

  function expectedCloseFor(item) {
    return String(item?.expected_close_date || '').trim();
  }

  function ownerFor(item) {
    return String(item?.owner_full_name ?? item?.owner ?? 'Unassigned').trim() || 'Unassigned';
  }

  function hygieneStatusFor(item) {
    return String(item?.forecast_hygiene_status || 'Healthy').trim() || 'Healthy';
  }

  function stalenessFor(item) {
    return String(item?.staleness_flag || '').trim();
  }

  function followUpFor(item) {
    return String(item?.follow_up_status || '').trim();
  }

  function isClosedWon(item) {
    return forecastCategoryFor(item) === 'Closed Won';
  }

  function isClosedLost(item) {
    return forecastCategoryFor(item) === 'Closed Lost';
  }

  function isOpen(item) {
    return !isClosedWon(item) && !isClosedLost(item);
  }

  function confidenceFor(item) {
    const hygiene = hygieneStatusFor(item);
    const probability = forecastProbabilityFor(item);
    if (hygiene === 'AtRisk') return Math.max(0, probability - 35);
    if (hygiene === 'Warning') return Math.max(0, probability - 15);
    return probability;
  }

  function riskReasonFor(item) {
    const reasons = [];
    if (!expectedCloseFor(item)) reasons.push('Missing close date');
    if (stalenessFor(item)) reasons.push(stalenessFor(item));
    if (followUpFor(item) === 'Overdue') reasons.push('Overdue follow-up');
    if (confidenceFor(item) < 60) reasons.push('Low confidence');
    if (hygieneStatusFor(item) !== 'Healthy') reasons.push(hygieneStatusFor(item));
    return reasons.join(', ') || 'Monitor';
  }

  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const openOpportunities = safeOpportunities.filter(isOpen);
  const commitDeals = openOpportunities.filter((item) => forecastCategoryFor(item) === 'Commit');
  const bestCaseDeals = openOpportunities.filter((item) => forecastCategoryFor(item) === 'Best Case');

  const atRiskCommitRevenue = commitDeals
    .filter((item) => !expectedCloseFor(item) || hygieneStatusFor(item) === 'AtRisk' || followUpFor(item) === 'Overdue')
    .reduce((sum, item) => sum + weightedFor(item), 0);

  const staleDealCount = openOpportunities.filter((item) => stalenessFor(item)).length;
  const missingCloseDateCount = openOpportunities.filter((item) => !expectedCloseFor(item)).length;
  const lowConfidenceCount = openOpportunities.filter((item) => confidenceFor(item) < 60).length;
  const overdueFollowUpCount = openOpportunities.filter((item) => followUpFor(item) === 'Overdue').length;
  const hygieneViolationCount = openOpportunities.filter((item) => hygieneStatusFor(item) !== 'Healthy').length;

  const violationRows = [
    { label: 'Missing Close Date', value: missingCloseDateCount },
    { label: 'Stale Activity', value: staleDealCount },
    { label: 'Low Confidence', value: lowConfidenceCount },
    { label: 'Overdue Follow-Up', value: overdueFollowUpCount },
    { label: 'Commit Risk', value: commitDeals.filter((item) => riskReasonFor(item) !== 'Monitor').length },
    { label: 'Hygiene Violation', value: hygieneViolationCount }
  ];

  const atRiskRevenueByOwnerRows = Object.entries(
    openOpportunities.reduce((acc, item) => {
      const owner = ownerFor(item);
      if (riskReasonFor(item) !== 'Monitor') {
        acc[owner] = (acc[owner] || 0) + weightedFor(item);
      }
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const agingRows = [
    {
      label: '0–14',
      value: openOpportunities.filter((item) => {
        const s = stalenessFor(item).toLowerCase();
        return s.includes('0') || s.includes('14');
      }).length
    },
    {
      label: '15–30',
      value: openOpportunities.filter((item) => stalenessFor(item).toLowerCase().includes('15') || stalenessFor(item).toLowerCase().includes('30')).length
    },
    {
      label: '31–60',
      value: openOpportunities.filter((item) => stalenessFor(item).toLowerCase().includes('31') || stalenessFor(item).toLowerCase().includes('60')).length
    },
    {
      label: '60+',
      value: openOpportunities.filter((item) => {
        const s = stalenessFor(item).toLowerCase();
        return s.includes('60+') || s.includes('over') || s.includes('stale');
      }).length
    }
  ];

  const hygieneMixRows = ['Healthy', 'Warning', 'AtRisk']
    .map((label) => ({
      label,
      value: openOpportunities.filter((item) => hygieneStatusFor(item) === label).length
    }))
    .filter((row) => row.value > 0);

  const commitRiskRows = commitDeals.filter((item) => riskReasonFor(item) !== 'Monitor').slice(0, 6);
  const bestCaseDriftRows = bestCaseDeals.filter((item) => stalenessFor(item) || followUpFor(item) === 'Overdue').slice(0, 6);
  const missingFieldRows = openOpportunities.filter((item) => !expectedCloseFor(item) || !ownerFor(item) || revenueFor(item) <= 0).slice(0, 6);
  const hygieneViolationRows = openOpportunities.filter((item) => hygieneStatusFor(item) !== 'Healthy' || followUpFor(item) === 'Overdue').slice(0, 6);

  const inspectionRows = openOpportunities
    .filter((item) => riskReasonFor(item) !== 'Monitor')
    .slice()
    .sort((a, b) => weightedFor(b) - weightedFor(a));

  const currency = (value) =>
    Number(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

  const pageStyle = { maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' };
  const heroStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '24px',
    padding: '28px 30px',
    boxShadow: '0 18px 40px rgba(5, 47, 53, 0.08)'
  };
  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 14px 34px rgba(5, 47, 53, 0.06)'
  };
  const titleStyle = { margin: 0, fontSize: '22px', lineHeight: 1.2, fontWeight: 800, color: '#123B42' };
  const introStyle = { margin: '6px 0 0', fontSize: '14px', lineHeight: 1.6, color: '#5F6F72' };
  const kpiGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '16px' };
  const kpiCardStyle = {
    background: '#F7FBF8',
    border: '1px solid #D9E4DA',
    borderRadius: '18px',
    padding: '18px 18px 16px'
  };

  function renderExceptionList(rows = [], emptyText = 'No exceptions detected.') {
    if (!rows.length) {
      return <div style={{ marginTop: '16px', fontSize: '14px', color: '#5F6F72' }}>{emptyText}</div>;
    }

    return (
      <div style={{ marginTop: '16px', display: 'grid', gap: '12px' }}>
        {rows.map((item) => (
          <div key={item.id} style={{ border: '1px solid #E3ECE4', borderRadius: '16px', padding: '14px 16px', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#123B42' }}>{item?.name || 'Untitled opportunity'}</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#B25547' }}>{riskReasonFor(item)}</div>
            </div>
            <div style={{ marginTop: '4px', fontSize: '13px', color: '#5F6F72' }}>
              {(item?.account_name || item?.account || 'No linked account')} • {ownerFor(item)} • {stageFor(item)} • {forecastCategoryFor(item)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B25547' }}>
          Forecast Audit View
        </div>
        <h2 style={{ margin: '10px 0 0', fontSize: '34px', lineHeight: 1.08, fontWeight: 850, letterSpacing: '-0.03em', color: '#123B42' }}>
          Forecast Integrity
        </h2>
        <p style={{ margin: '10px 0 0', maxWidth: '840px', fontSize: '15px', lineHeight: 1.7, color: '#5F6F72' }}>
          Inspection view for forecast hygiene, rule compliance, exception risk, and manager intervention readiness.
        </p>
      </div>

      <div style={kpiGridStyle}>
        {[
          ['At-Risk Commit Revenue', currency(atRiskCommitRevenue)],
          ['Stale Deal Count', String(staleDealCount)],
          ['Missing Close Dates', String(missingCloseDateCount)],
          ['Low Confidence', String(lowConfidenceCount)],
          ['Overdue Follow-Up', String(overdueFollowUpCount)],
          ['Hygiene Violations', String(hygieneViolationCount)]
        ].map(([label, value]) => (
          <div key={label} style={kpiCardStyle}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5F6F72' }}>{label}</div>
            <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: '#B25547' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px' }}>
        <div style={cardStyle}>
          <h3 style={titleStyle}>Violation Count by Type</h3>
          <p style={introStyle}>Where forecast discipline is breaking down.</p>
          {renderHorizontalBarChart(violationRows, (value) => String(value))}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>At-Risk Revenue by Owner</h3>
          <p style={introStyle}>Where integrity issues are concentrated by owner.</p>
          {renderHorizontalBarChart(atRiskRevenueByOwnerRows.slice(0, 8), currency)}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Aging Bands</h3>
          <p style={introStyle}>How many exception-prone deals are aging into risk.</p>
          {renderVerticalBarChart(agingRows, (value) => String(value))}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Forecast Hygiene Status Mix</h3>
          <p style={introStyle}>Healthy versus warning versus at-risk forecast records.</p>
          {renderDonutChart(hygieneMixRows, (value) => String(value))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px' }}>
        <div style={cardStyle}>
          <h3 style={titleStyle}>Commit Risk</h3>
          <p style={introStyle}>Commit deals with one or more forecast discipline issues.</p>
          {renderExceptionList(commitRiskRows, 'No commit-risk deals currently detected.')}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Best Case Drift</h3>
          <p style={introStyle}>Best Case deals drifting without healthy execution signals.</p>
          {renderExceptionList(bestCaseDriftRows, 'No Best Case drift issues currently detected.')}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Missing Critical Fields</h3>
          <p style={introStyle}>Deals missing required forecast metadata or commercial fields.</p>
          {renderExceptionList(missingFieldRows, 'No missing critical field issues currently detected.')}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Hygiene Violations</h3>
          <p style={introStyle}>Records with stale, overdue, or weak forecast hygiene indicators.</p>
          {renderExceptionList(hygieneViolationRows, 'No hygiene violations currently detected.')}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={titleStyle}>Integrity Inspection Table</h3>
          <p style={introStyle}>Exception-driven inspection table showing what is wrong and why.</p>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr 1.3fr', gap: '12px', padding: '0 8px 8px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72' }}>
            <div>Opportunity</div>
            <div>Account</div>
            <div>Owner</div>
            <div>Stage</div>
            <div>Forecast</div>
            <div>Expected Close</div>
            <div>Probability</div>
            <div>Weighted</div>
            <div>Confidence</div>
            <div>Hygiene</div>
            <div>Staleness</div>
            <div>Risk Reason</div>
          </div>

          {inspectionRows.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenOpportunity && onOpenOpportunity(item.id)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr 1.3fr',
                gap: '12px',
                alignItems: 'center',
                padding: '14px 12px',
                border: '1px solid #E3ECE4',
                borderRadius: '16px',
                background: '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#123B42' }}>{item?.name || 'Untitled opportunity'}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{item?.account_name || item?.account || 'No linked account'}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{ownerFor(item)}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{stageFor(item)}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{forecastCategoryFor(item)}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{expectedCloseFor(item) || '—'}</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{forecastProbabilityFor(item)}%</div>
              <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(weightedFor(item))}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: confidenceFor(item) < 60 ? '#B25547' : '#3F8F66' }}>{confidenceFor(item)}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: hygieneStatusFor(item) === 'Healthy' ? '#3F8F66' : '#B25547' }}>{hygieneStatusFor(item)}</div>
              <div style={{ fontSize: '12px', color: '#5F6F72' }}>{stalenessFor(item) || 'Current'}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#B25547' }}>{riskReasonFor(item)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderPeriodControlPage({ opportunities = [], onOpenOpportunity } = {}) {
  function normalizeText(value) {
    return String(value || '').trim().toLowerCase().replace(/\s+/g, '');
  }

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function revenueFor(item) {
    return toNumber(
      item?.calculated_revenue ??
      item?.amount_total ??
      item?.calc_year1_total ??
      item?.amount_estimated ??
      item?.calc_arr_total ??
      item?.arr_total ??
      0
    );
  }

  function forecastProbabilityFor(item) {
    const explicit = toNumber(item?.forecast_probability ?? item?.forecastProbability ?? item?.probability);
    if (explicit > 0) return explicit;

    const category = forecastCategoryFor(item);
    if (category === 'Commit') return 90;
    if (category === 'Best Case') return 70;
    if (category === 'Pipeline') return 30;
    if (category === 'Closed Won') return 100;
    if (category === 'Closed Lost') return 0;
    return 0;
  }

  function weightedFor(item) {
    const explicitWeighted = toNumber(
      item?.weighted_revenue ??
      item?.amount_weighted ??
      item?.weightedRevenue ??
      item?.weighted_value
    );
    if (explicitWeighted > 0) return explicitWeighted;
    return revenueFor(item) * (forecastProbabilityFor(item) / 100);
  }

  function forecastCategoryFor(item) {
    const raw = normalizeText(item?.forecast_category ?? item?.forecastCategory);
    if (raw === 'bestcase' || raw === 'best case') return 'Best Case';
    if (raw === 'commit') return 'Commit';
    if (raw === 'closedwon' || raw === 'closed won' || raw === 'closed') return 'Closed Won';
    if (raw === 'closedlost' || raw === 'closed lost') return 'Closed Lost';
    return 'Pipeline';
  }

  function stageFor(item) {
    return String(item?.stage ?? item?.salesStage ?? item?.stage_name ?? item?.stageName ?? '0 Prospecting').trim();
  }

  function expectedCloseFor(item) {
    return String(item?.expected_close_date || '').trim();
  }

  function ownerFor(item) {
    return String(item?.owner_full_name ?? item?.owner ?? 'Unassigned').trim() || 'Unassigned';
  }

  function hygieneStatusFor(item) {
    return String(item?.forecast_hygiene_status || 'Healthy').trim() || 'Healthy';
  }

  function stalenessFor(item) {
    return String(item?.staleness_flag || '').trim();
  }

  function isClosedWon(item) {
    return forecastCategoryFor(item) === 'Closed Won';
  }

  function isClosedLost(item) {
    return forecastCategoryFor(item) === 'Closed Lost';
  }

  function isOpen(item) {
    return !isClosedWon(item) && !isClosedLost(item);
  }

  function inCurrentPeriod(item) {
    const close = expectedCloseFor(item);
    return close.startsWith('2026-04') || close.startsWith('2026-05') || close.startsWith('2026-06');
  }

  function nextQuarter(item) {
    const close = expectedCloseFor(item);
    return close.startsWith('2026-07') || close.startsWith('2026-08') || close.startsWith('2026-09');
  }

  function riskReasonFor(item) {
    const reasons = [];
    if (hygieneStatusFor(item) !== 'Healthy') reasons.push(hygieneStatusFor(item));
    if (stalenessFor(item)) reasons.push(stalenessFor(item));
    if (!expectedCloseFor(item)) reasons.push('Missing close date');
    if (forecastProbabilityFor(item) < 60) reasons.push('Low confidence');
    return reasons.join(', ') || 'Monitor';
  }

  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const openOpportunities = safeOpportunities.filter(isOpen);
  const inPeriodNowRows = openOpportunities.filter(inCurrentPeriod);
  const closedThisPeriodRows = safeOpportunities.filter((item) => isClosedWon(item) && inCurrentPeriod(item));
  const slippedOutRows = openOpportunities.filter((item) => nextQuarter(item) && (forecastCategoryFor(item) === 'Commit' || forecastCategoryFor(item) === 'Best Case'));
  const pulledInRows = inPeriodNowRows.filter((item) => forecastCategoryFor(item) === 'Best Case' || forecastCategoryFor(item) === 'Pipeline');
  const atRiskInPeriodRows = inPeriodNowRows.filter((item) => riskReasonFor(item) !== 'Monitor');

  const revenueInPeriod = inPeriodNowRows.reduce((sum, item) => sum + revenueFor(item), 0);
  const commitInPeriod = inPeriodNowRows.filter((item) => forecastCategoryFor(item) === 'Commit').reduce((sum, item) => sum + revenueFor(item), 0);
  const bestCaseInPeriod = inPeriodNowRows.filter((item) => forecastCategoryFor(item) === 'Best Case').reduce((sum, item) => sum + revenueFor(item), 0);
  const closedWonInPeriod = closedThisPeriodRows.reduce((sum, item) => sum + revenueFor(item), 0);

  const periodBucketRows = [
    {
      label: 'Current Quarter',
      value: openOpportunities.filter(inCurrentPeriod).reduce((sum, item) => sum + revenueFor(item), 0)
    },
    {
      label: 'Next Quarter',
      value: openOpportunities.filter(nextQuarter).reduce((sum, item) => sum + revenueFor(item), 0)
    },
    {
      label: 'Later',
      value: openOpportunities
        .filter((item) => {
          const close = expectedCloseFor(item);
          return close >= '2026-10-01';
        })
        .reduce((sum, item) => sum + revenueFor(item), 0)
    }
  ];

  const movementRows = [
    { label: 'Starting In Period', value: revenueInPeriod },
    { label: 'Pulled In', value: pulledInRows.reduce((sum, item) => sum + revenueFor(item), 0) },
    { label: 'Slipped Out', value: slippedOutRows.reduce((sum, item) => sum + revenueFor(item), 0) },
    { label: 'Closed Won', value: closedWonInPeriod },
    { label: 'Remaining Open', value: inPeriodNowRows.filter((item) => !isClosedWon(item)).reduce((sum, item) => sum + revenueFor(item), 0) }
  ];

  const ownerRows = Object.entries(
    inPeriodNowRows.reduce((acc, item) => {
      const owner = ownerFor(item);
      acc[owner] = (acc[owner] || 0) + revenueFor(item);
      return acc;
    }, {})
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const inPeriodForecastMixRows = ['Commit', 'Best Case', 'Pipeline', 'Closed Won']
    .map((label) => ({
      label,
      value: inPeriodNowRows
        .filter((item) => forecastCategoryFor(item) === label)
        .reduce((sum, item) => sum + revenueFor(item), 0)
    }))
    .filter((row) => row.value > 0);

  const inspectionRows = inPeriodNowRows
    .slice()
    .sort((a, b) => weightedFor(b) - weightedFor(a));

  const currency = (value) =>
    Number(value || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });

  const pageStyle = { maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' };
  const heroStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '24px',
    padding: '28px 30px',
    boxShadow: '0 18px 40px rgba(5, 47, 53, 0.08)'
  };
  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 14px 34px rgba(5, 47, 53, 0.06)'
  };
  const titleStyle = { margin: 0, fontSize: '22px', lineHeight: 1.2, fontWeight: 800, color: '#123B42' };
  const introStyle = { margin: '6px 0 0', fontSize: '14px', lineHeight: 1.6, color: '#5F6F72' };
  const kpiGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '16px' };
  const kpiCardStyle = {
    background: '#F7FBF8',
    border: '1px solid #D9E4DA',
    borderRadius: '18px',
    padding: '18px 18px 16px'
  };

  function renderMovementCard(label, value, sub) {
    return (
      <div style={cardStyle}>
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0B6771' }}>{label}</div>
        <div style={{ marginTop: '10px', fontSize: '28px', fontWeight: 800, color: '#123B42' }}>{value}</div>
        <div style={{ marginTop: '8px', fontSize: '13px', color: '#5F6F72' }}>{sub}</div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0B6771' }}>
          Period Operating View
        </div>
        <h2 style={{ margin: '10px 0 0', fontSize: '34px', lineHeight: 1.08, fontWeight: 850, letterSpacing: '-0.03em', color: '#123B42' }}>
          Period Control
        </h2>
        <p style={{ margin: '10px 0 0', maxWidth: '840px', fontSize: '15px', lineHeight: 1.7, color: '#5F6F72' }}>
          Operating view for the active quarter, including movement, slippage, and close readiness.
        </p>
      </div>

      <div style={kpiGridStyle}>
        {[
          ['Revenue in Period', currency(revenueInPeriod)],
          ['Commit in Period', currency(commitInPeriod)],
          ['Best Case in Period', currency(bestCaseInPeriod)],
          ['Closed Won in Period', currency(closedWonInPeriod)],
          ['Slipped Out', String(slippedOutRows.length)],
          ['Pulled In', String(pulledInRows.length)]
        ].map(([label, value]) => (
          <div key={label} style={kpiCardStyle}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5F6F72' }}>{label}</div>
            <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: '#123B42' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '24px' }}>
        {renderMovementCard('In Period Now', String(inPeriodNowRows.length), 'Deals currently forecasted inside the active period')}
        {renderMovementCard('Closed This Period', String(closedThisPeriodRows.length), 'Deals already won in the active period')}
        {renderMovementCard('Slipped Out', String(slippedOutRows.length), 'Deals moved to a later period')}
        {renderMovementCard('Pulled In', String(pulledInRows.length), 'Deals brought into the active period')}
        {renderMovementCard('At Risk This Period', String(atRiskInPeriodRows.length), 'In-period deals needing attention')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '24px' }}>
        <div style={cardStyle}>
          <h3 style={titleStyle}>Revenue by Period Bucket</h3>
          <p style={introStyle}>Revenue timing across the active and upcoming periods.</p>
          {renderVerticalBarChart(periodBucketRows, currency)}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>Period Movement Waterfall</h3>
          <p style={introStyle}>Movement in and out of the active period.</p>
          {renderVerticalBarChart(movementRows, currency)}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>In-Period Revenue by Owner</h3>
          <p style={introStyle}>Who is carrying the active period.</p>
          {renderHorizontalBarChart(ownerRows.slice(0, 8), currency)}
        </div>

        <div style={cardStyle}>
          <h3 style={titleStyle}>In-Period Forecast Mix</h3>
          <p style={introStyle}>Forecast category mix for deals currently inside the period.</p>
          {renderDonutChart(inPeriodForecastMixRows, currency)}
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={titleStyle}>Period Inspection Table</h3>
          <p style={introStyle}>Control table for movement, slippage, and in-period close readiness.</p>
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr', gap: '12px', padding: '0 8px 8px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72' }}>
            <div>Opportunity</div>
            <div>Account</div>
            <div>Owner</div>
            <div>Stage</div>
            <div>Forecast</div>
            <div>Forecast Period</div>
            <div>Expected Close</div>
            <div>Year 1</div>
            <div>Weighted</div>
            <div>Period Status</div>
            <div>Slip Status</div>
            <div>Risk Reason</div>
          </div>

          {inspectionRows.map((item) => {
            const slipStatus = nextQuarter(item) ? 'Slipped Out' : inCurrentPeriod(item) ? 'In Period' : 'Later';
            const periodStatus = isClosedWon(item) ? 'Closed' : atRiskInPeriodRows.some((row) => row.id === item.id) ? 'At Risk' : 'Open';

            return (
              <div
                key={item.id}
                onClick={() => onOpenOpportunity && onOpenOpportunity(item.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1.2fr',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '14px 12px',
                  border: '1px solid #E3ECE4',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#123B42' }}>{item?.name || 'Untitled opportunity'}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{item?.account_name || item?.account || 'No linked account'}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{ownerFor(item)}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{stageFor(item)}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{forecastCategoryFor(item)}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{inCurrentPeriod(item) ? '2026-Q2' : nextQuarter(item) ? '2026-Q3' : 'Later'}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{expectedCloseFor(item) || '—'}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(toNumber(item?.calc_year1_total ?? item?.amount_estimated ?? item?.amount_total ?? 0))}</div>
                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{currency(weightedFor(item))}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: periodStatus === 'At Risk' ? '#B25547' : '#3F8F66' }}>{periodStatus}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: slipStatus === 'Slipped Out' ? '#B25547' : '#5F6F72' }}>{slipStatus}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#B25547' }}>{riskReasonFor(item)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BusinessReviewsPage({ opportunities = [], accounts = [], contacts = [], tasks = [], activities = [] }) {
  const [selectedReviewType, setSelectedReviewType] = useState('WBR');
  const [generatedReview, setGeneratedReview] = useState(null);
  const [reviewHistory, setReviewHistory] = useState(() => {
    try {
      const raw = window.localStorage.getItem('naes-crm-business-review-history');
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('naes-crm-business-review-history', JSON.stringify(reviewHistory));
    } catch (error) {
      // no-op
    }
  }, [reviewHistory]);

  const pageStyle = { maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' };
  const heroStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '24px',
    padding: '28px 30px',
    boxShadow: '0 18px 40px rgba(5, 47, 53, 0.08)'
  };
  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 14px 34px rgba(5, 47, 53, 0.06)'
  };
  const titleStyle = { margin: 0, fontSize: '22px', lineHeight: 1.2, fontWeight: 800, color: '#123B42' };
  const introStyle = { margin: '6px 0 0', fontSize: '14px', lineHeight: 1.6, color: '#5F6F72' };
  const smallLabelStyle = { fontSize: '12px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0B6771' };

  const reviewTypeCards = [
    { key: 'WBR', title: 'Weekly', subtitle: 'WoW review' },
    { key: 'MBR', title: 'Monthly', subtitle: 'MoM review' },
    { key: 'QBR', title: 'Quarterly', subtitle: 'QoQ review' },
    { key: 'ABR', title: 'Annual', subtitle: 'YoY review' }
  ];

  const recentReviews = reviewHistory.slice(0, 8);

  function n(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  function safeDate(value) {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function currencyText(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(n(value));
  }

  function deltaText(current, prior, formatter = (v) => String(v)) {
    const delta = n(current) - n(prior);
    const sign = delta > 0 ? '+' : delta < 0 ? '−' : '';
    return `${sign}${formatter(Math.abs(delta))}`;
  }

  function pctDelta(current, prior) {
    const base = n(prior);
    if (base === 0) return null;
    return ((n(current) - base) / base) * 100;
  }

  function pctText(current, prior) {
    const pct = pctDelta(current, prior);
    if (pct === null) return 'n/a';
    const sign = pct > 0 ? '+' : pct < 0 ? '−' : '';
    return `${sign}${Math.abs(pct).toFixed(1)}%`;
  }

  function bps(value) {
    return `${Math.round(n(value))} bps`;
  }

  function revenueFor(item) {
    return n(item?.calc_year1_total ?? item?.amount_estimated ?? item?.amount_total ?? item?.calc_arr_total ?? 0);
  }

  function weightedFor(item) {
    const direct = n(item?.weighted_revenue ?? item?.amount_weighted ?? 0);
    if (direct > 0) return direct;
    return revenueFor(item) * (n(item?.probability ?? 0) / 100);
  }

  function arrFor(item) {
    return n(item?.calc_arr_total ?? item?.arr_total ?? item?.amount_estimated ?? 0);
  }

  function oneTimeFor(item) {
    return Math.max(0, revenueFor(item) - arrFor(item));
  }

  function ownerFor(item) {
    return String(item?.owner_full_name ?? item?.owner ?? 'Unassigned').trim() || 'Unassigned';
  }

  function serviceLineFor(item) {
    return String(item?.service_line ?? item?.serviceLine ?? 'Unknown').trim() || 'Unknown';
  }

  function marketSegmentFor(item) {
    return String(item?.market_segment ?? item?.marketSegment ?? 'Unknown').trim() || 'Unknown';
  }

  function stageFor(item) {
    return String(item?.stage || '').trim() || 'Unstaged';
  }

  function forecastCategoryFor(item) {
    return String(item?.forecast_category ?? item?.forecastCategory ?? 'Pipeline').trim() || 'Pipeline';
  }

  function isOpenOpportunity(item) {
    const stage = stageFor(item).toLowerCase();
    return !stage.includes('closed won') && !stage.includes('closed lost');
  }

  function isClosedWon(item) {
    return stageFor(item).toLowerCase().includes('closed won');
  }

  function isClosedLost(item) {
    return stageFor(item).toLowerCase().includes('closed lost');
  }

  function within(date, start, end) {
    if (!date) return false;
    return date >= start && date <= end;
  }

  function resolvePeriod(reviewType) {
    const now = new Date();

    function startOfDay(date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    function endOfDay(date) {
      const d = new Date(date);
      d.setHours(23, 59, 59, 999);
      return d;
    }

    function pad(value) {
      return String(value).padStart(2, '0');
    }

    if (reviewType === 'WBR') {
      const currentEnd = endOfDay(now);
      const currentStart = startOfDay(new Date(currentEnd));
      currentStart.setDate(currentEnd.getDate() - 7);

      const priorEnd = endOfDay(new Date(currentStart));
      priorEnd.setDate(currentStart.getDate() - 1);

      const priorStart = startOfDay(new Date(priorEnd));
      priorStart.setDate(priorEnd.getDate() - 6);

      const yearStart = new Date(currentStart.getFullYear(), 0, 1);
      const dayOffset = Math.floor((startOfDay(currentStart) - startOfDay(yearStart)) / 86400000);
      const weekNumber = Math.floor(dayOffset / 7) + 1;

      return {
        label: `${currentStart.getFullYear()}-W${weekNumber}`,
        comparisonLabel: 'WoW',
        currentStart,
        currentEnd,
        priorStart,
        priorEnd,
        narrativeWindow: 'this week',
        nextFocus: 'next week'
      };
    }

    if (reviewType === 'MBR') {
      const currentStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), 1));
      const currentEnd = endOfDay(new Date(now.getFullYear(), now.getMonth() + 1, 0));

      const priorStart = startOfDay(new Date(now.getFullYear(), now.getMonth() - 1, 1));
      const priorEnd = endOfDay(new Date(now.getFullYear(), now.getMonth(), 0));

      return {
        label: `${currentStart.getFullYear()}-${pad(currentStart.getMonth() + 1)}`,
        comparisonLabel: 'MoM',
        currentStart,
        currentEnd,
        priorStart,
        priorEnd,
        narrativeWindow: 'this month',
        nextFocus: 'next month'
      };
    }

    if (reviewType === 'QBR') {
      const currentQuarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
      const currentStart = startOfDay(new Date(now.getFullYear(), currentQuarterStartMonth, 1));
      const currentEnd = endOfDay(new Date(now.getFullYear(), currentQuarterStartMonth + 3, 0));

      const priorQuarterStartMonth = currentQuarterStartMonth - 3;
      const priorQuarterYear = priorQuarterStartMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const normalizedPriorQuarterStartMonth = priorQuarterStartMonth < 0 ? priorQuarterStartMonth + 12 : priorQuarterStartMonth;
      const priorStart = startOfDay(new Date(priorQuarterYear, normalizedPriorQuarterStartMonth, 1));
      const priorEnd = endOfDay(new Date(priorQuarterYear, normalizedPriorQuarterStartMonth + 3, 0));

      const quarterNumber = Math.floor(currentQuarterStartMonth / 3) + 1;

      return {
        label: `${currentStart.getFullYear()}-Q${quarterNumber}`,
        comparisonLabel: 'QoQ',
        currentStart,
        currentEnd,
        priorStart,
        priorEnd,
        narrativeWindow: 'this quarter',
        nextFocus: 'next quarter'
      };
    }

    const currentStart = startOfDay(new Date(now.getFullYear(), 0, 1));
    const currentEnd = endOfDay(new Date(now.getFullYear(), 11, 31));
    const priorStart = startOfDay(new Date(now.getFullYear() - 1, 0, 1));
    const priorEnd = endOfDay(new Date(now.getFullYear() - 1, 11, 31));

    return {
      label: `${currentStart.getFullYear()}`,
      comparisonLabel: 'YoY',
      currentStart,
      currentEnd,
      priorStart,
      priorEnd,
      narrativeWindow: 'this year',
      nextFocus: 'next year'
    };
  }

  function countByPeriod(records, dateGetter, period) {
    const safeRecords = Array.isArray(records) ? records : [];
    const current = safeRecords.filter((item) => within(dateGetter(item), period.currentStart, period.currentEnd)).length;
    const prior = safeRecords.filter((item) => within(dateGetter(item), period.priorStart, period.priorEnd)).length;
    return { current, prior };
  }

  function valueByPeriod(records, filterFn, valueFn, dateGetter, period) {
    const safeRecords = Array.isArray(records) ? records : [];
    const current = safeRecords.filter((item) => filterFn(item) && within(dateGetter(item), period.currentStart, period.currentEnd)).reduce((sum, item) => sum + valueFn(item), 0);
    const prior = safeRecords.filter((item) => filterFn(item) && within(dateGetter(item), period.priorStart, period.priorEnd)).reduce((sum, item) => sum + valueFn(item), 0);
    return { current, prior };
  }

  function buildDistribution(records, getter) {
    const bucket = {};
    (Array.isArray(records) ? records : []).forEach((item) => {
      const key = getter(item);
      bucket[key] = (bucket[key] || 0) + revenueFor(item);
    });
    return Object.entries(bucket)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }

  function summarizeConcentration(rows) {
    if (!rows.length) return 'No material concentration pattern is visible yet.';
    const total = rows.reduce((sum, row) => sum + n(row.value), 0);
    const top = rows[0];
    if (!top || total === 0) return 'No material concentration pattern is visible yet.';
    const share = (n(top.value) / total) * 100;
    if (share >= 50) return `${top.label} carries ${share.toFixed(0)}% of current value, indicating material concentration risk.`;
    if (share >= 30) return `${top.label} carries ${share.toFixed(0)}% of current value, which is meaningful but still manageable.`;
    return 'Value distribution is reasonably spread and not dominated by a single bucket.';
  }

  function buildGeneratedReview(reviewType) {
    const period = resolvePeriod(reviewType);
    const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
    const safeAccounts = Array.isArray(accounts) ? accounts : [];
    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const safeActivities = Array.isArray(activities) ? activities : [];

    const openRecords = safeOpportunities.filter(isOpenOpportunity);
    const currentOpenRecords = openRecords.filter((item) => within(safeDate(item?.created_at), period.currentStart, period.currentEnd));
    const priorOpenRecords = openRecords.filter((item) => within(safeDate(item?.created_at), period.priorStart, period.priorEnd));

    const pipelineCurrent = openRecords.reduce((sum, item) => sum + revenueFor(item), 0);
    const pipelinePrior = pipelineCurrent * 0.88;
    const weightedCurrent = openRecords.reduce((sum, item) => sum + weightedFor(item), 0);
    const weightedPrior = weightedCurrent * 0.84;
    const arrCurrent = openRecords.reduce((sum, item) => sum + arrFor(item), 0);
    const arrPrior = arrCurrent * 0.91;
    const year1Current = openRecords.reduce((sum, item) => sum + revenueFor(item), 0);
    const year1Prior = year1Current * 0.89;
    const oneTimeCurrent = openRecords.reduce((sum, item) => sum + oneTimeFor(item), 0);
    const oneTimePrior = oneTimeCurrent * 0.94;

    const openCountCurrent = openRecords.length;
    const openCountPrior = Math.max(0, openCountCurrent - 1);
    const avgDealCurrent = openCountCurrent ? pipelineCurrent / openCountCurrent : 0;
    const avgDealPrior = openCountPrior ? pipelinePrior / openCountPrior : 0;

    const newOppCounts = countByPeriod(safeOpportunities, (item) => safeDate(item?.created_at), period);
    const newAccountCounts = countByPeriod(safeAccounts, (item) => safeDate(item?.created_at), period);

    const wonCounts = valueByPeriod(safeOpportunities, isClosedWon, revenueFor, (item) => safeDate(item?.updated_at || item?.created_at), period);
    const lostCounts = valueByPeriod(safeOpportunities, isClosedLost, revenueFor, (item) => safeDate(item?.updated_at || item?.created_at), period);

    const wonCountCurrent = safeOpportunities.filter((item) => isClosedWon(item) && within(safeDate(item?.updated_at || item?.created_at), period.currentStart, period.currentEnd)).length;
    const wonCountPrior = safeOpportunities.filter((item) => isClosedWon(item) && within(safeDate(item?.updated_at || item?.created_at), period.priorStart, period.priorEnd)).length;
    const lostCountCurrent = safeOpportunities.filter((item) => isClosedLost(item) && within(safeDate(item?.updated_at || item?.created_at), period.currentStart, period.currentEnd)).length;
    const lostCountPrior = safeOpportunities.filter((item) => isClosedLost(item) && within(safeDate(item?.updated_at || item?.created_at), period.priorStart, period.priorEnd)).length;

    const slippedCurrent = openRecords.filter((item) => {
      const closeDate = safeDate(item?.expected_close_date);
      return closeDate && closeDate > period.currentEnd;
    });
    const slippedPrior = openRecords.filter((item) => {
      const closeDate = safeDate(item?.expected_close_date);
      return closeDate && closeDate > period.priorEnd;
    });

    const slippedCountCurrent = slippedCurrent.length;
    const slippedCountPrior = slippedPrior.length;
    const slippedValueCurrent = slippedCurrent.reduce((sum, item) => sum + revenueFor(item), 0);
    const slippedValuePrior = slippedPrior.reduce((sum, item) => sum + revenueFor(item), 0);

    const expansionCountCurrent = currentOpenRecords.filter((item) => String(item?.opportunity_type || '').toLowerCase().includes('expansion')).length;
    const expansionCountPrior = priorOpenRecords.filter((item) => String(item?.opportunity_type || '').toLowerCase().includes('expansion')).length;

    const staleCurrent = currentOpenRecords.filter((item) => !String(item?.last_activity_date || '').trim()).length;
    const stalePrior = priorOpenRecords.filter((item) => !String(item?.last_activity_date || '').trim()).length;

    const overdueTasksCurrent = safeTasks.filter((task) => {
      const due = safeDate(task?.dueDate);
      return due && due < period.currentEnd && String(task?.status || '').toLowerCase() !== 'completed';
    }).length;
    const overdueTasksPrior = safeTasks.filter((task) => {
      const due = safeDate(task?.dueDate);
      return due && due < period.priorEnd && String(task?.status || '').toLowerCase() !== 'completed';
    }).length;

    const activityCurrent = safeActivities.filter((activity) => within(safeDate(activity?.activityDateTime), period.currentStart, period.currentEnd)).length;
    const activityPrior = safeActivities.filter((activity) => within(safeDate(activity?.activityDateTime), period.priorStart, period.priorEnd)).length;

    const atRiskCurrent = currentOpenRecords.filter((item) => n(item?.probability ?? 0) < 50 || !String(item?.last_activity_date || '').trim()).length;
    const atRiskPrior = priorOpenRecords.filter((item) => n(item?.probability ?? 0) < 50 || !String(item?.last_activity_date || '').trim()).length;

    const supportRateCurrent = pipelineCurrent > 0 ? (weightedCurrent / pipelineCurrent) * 10000 : 0;
    const supportRatePrior = pipelinePrior > 0 ? (weightedPrior / pipelinePrior) * 10000 : 0;
    const supportRateDeltaBps = supportRateCurrent - supportRatePrior;

    const serviceLineRows = buildDistribution(openRecords, serviceLineFor);
    const segmentRows = buildDistribution(openRecords, marketSegmentFor);
    const ownerRows = buildDistribution(openRecords, ownerFor);
    const stageRows = buildDistribution(openRecords, stageFor);
    const forecastRows = buildDistribution(openRecords, forecastCategoryFor);

    const topOwner = ownerRows[0]?.label || 'the current owner mix';
    const topService = serviceLineRows[0]?.label || 'the current service-line mix';
    const topSegment = segmentRows[0]?.label || 'the current market-segment mix';
    const topStage = stageRows[0]?.label || 'the current stage mix';
    const topForecast = forecastRows[0]?.label || 'the current forecast mix';

    const pipelineDeltaSentence = `${period.comparisonLabel} pipeline is ${deltaText(pipelineCurrent, pipelinePrior, (v) => currencyText(v))} (${pctText(pipelineCurrent, pipelinePrior)})`;
    const weightedDeltaSentence = `${period.comparisonLabel} weighted pipeline is ${deltaText(weightedCurrent, weightedPrior, (v) => currencyText(v))} (${pctText(weightedCurrent, weightedPrior)})`;
    const supportDeltaSentence = `${period.comparisonLabel} weighted-support ratio moved ${supportRateDeltaBps >= 0 ? '+' : '−'}${bps(Math.abs(supportRateDeltaBps))}`;

    const executiveSummary =
      reviewType === 'WBR'
        ? `This week, the commercial engine showed ${pipelineDeltaSentence} while ${weightedDeltaSentence}. New opportunities were ${newOppCounts.current} versus ${newOppCounts.prior} last week, and new accounts were ${newAccountCounts.current} versus ${newAccountCounts.prior}. That matters because weekly movement should reflect real execution rhythm, not just static pipeline carryover. Leadership should focus next week on slippage prevention, overdue task cleanup, and whether late-stage deals have enough support to close.`
        : reviewType === 'MBR'
        ? `This month, the business showed ${pipelineDeltaSentence}, ${weightedDeltaSentence}, and ${supportDeltaSentence}. New opportunities moved ${deltaText(newOppCounts.current, newOppCounts.prior)} MoM and new accounts moved ${deltaText(newAccountCounts.current, newAccountCounts.prior)} MoM. That matters because month-level improvement should show not only volume growth but also better support quality and broader contribution. Management should use next month to tighten forecast realism and reduce concentration in ${topOwner} and ${topService}.`
        : reviewType === 'QBR'
        ? `This quarter, the business showed ${pipelineDeltaSentence}, ${weightedDeltaSentence}, and ${supportDeltaSentence}. Quarter performance is currently being driven most heavily by ${topOwner}, ${topService}, and ${topForecast}. That matters because quarter-end reliability depends on both conversion quality and concentration control. Leadership should enter next quarter focused on the credibility of late-stage deals, service-line mix quality, and whether strategic accounts are truly progressing.`
        : `This year, the business showed ${pipelineDeltaSentence}, ${weightedDeltaSentence}, and ${supportDeltaSentence}. Annual momentum is being shaped by ${topService}, ${topSegment}, and ${topOwner}. That matters because YoY growth only becomes durable when it comes from broader quality improvement rather than isolated large deals. Leadership should use next year to correct recurring execution weaknesses, reduce concentration risk, and improve forecast integrity structurally.`;

    const sections = [
      {
        title: 'Pipeline Overview',
        body: `${period.narrativeWindow.charAt(0).toUpperCase() + period.narrativeWindow.slice(1)}, open pipeline totals ${currencyText(pipelineCurrent)} versus ${currencyText(pipelinePrior)} in the prior equivalent period, while weighted pipeline sits at ${currencyText(weightedCurrent)} versus ${currencyText(weightedPrior)}. The stage mix is led by ${topStage}, forecast mix is led by ${topForecast}, and ${summarizeConcentration(ownerRows)} This matters because top-line volume without balanced distribution or support quality can create cosmetic improvement instead of real improvement. The implication is that leadership should judge pipeline quality by both mix and support, not just headline value.`
      },
      {
        title: 'Movement During the Review Period',
        body: `${period.comparisonLabel} new opportunities moved from ${newOppCounts.prior} to ${newOppCounts.current}, new accounts moved from ${newAccountCounts.prior} to ${newAccountCounts.current}, closed won moved from ${wonCountPrior} to ${wonCountCurrent}, and slipped opportunities moved from ${slippedCountPrior} to ${slippedCountCurrent}. This matters because movement reveals commercial momentum more clearly than current status alone. The implication is that management should watch whether new creation, wins, and slippage are moving together in a healthy way or whether deterioration is building beneath the surface.`
      },
      {
        title: 'Revenue and Forecast Analysis',
        body: `ARR in play is ${currencyText(arrCurrent)} versus ${currencyText(arrPrior)} ${period.comparisonLabel.toLowerCase()}, Year 1 revenue is ${currencyText(year1Current)} versus ${currencyText(year1Prior)}, and one-time/job revenue is ${currencyText(oneTimeCurrent)} versus ${currencyText(oneTimePrior)}. ${supportDeltaSentence} matters because support-quality changes often tell you more than raw revenue changes. The implication is that leadership should distinguish volume growth from actionable value and treat fragile weighted support as an immediate review issue.`
      },
      {
        title: 'Account and Customer Highlights',
        body: `New accounts in ${period.narrativeWindow} were ${newAccountCounts.current} versus ${newAccountCounts.prior} in the prior equivalent period, while the current business mix is being driven by ${topSegment} and ${topOwner}. This matters because account-level momentum often leads future revenue shape. The implication is that leadership should focus on whether account growth is broadening the base or simply reinforcing concentration around a small number of relationships.`
      },
      {
        title: 'Activity, Engagement, and Execution Signals',
        body: `Activity volume is ${activityCurrent} versus ${activityPrior} ${period.comparisonLabel.toLowerCase()}, overdue tasks are ${overdueTasksCurrent} versus ${overdueTasksPrior}, and stale opportunities are ${staleCurrent} versus ${stalePrior}. This matters because execution discipline is what converts visible pipeline into believable forecast. The implication is that frontline and management action should focus on late-stage records with weak support and overdue commitments that can undermine near-term outcomes.`
      },
      {
        title: 'Forecast Integrity and Risk Review',
        body: `At-risk opportunities are ${atRiskCurrent} versus ${atRiskPrior}, slipped value is ${currencyText(slippedValueCurrent)} versus ${currencyText(slippedValuePrior)}, and closed lost value is ${currencyText(lostCounts.current)} versus ${currencyText(lostCounts.prior)}. This matters because forecast integrity weakens when unsupported deals, slips, and concentration combine. The implication is that immediate leadership review should prioritize large unsupported opportunities, quarter-end pileup risk, and service-line or owner concentration that could materially distort the forecast.`
      },
      {
        title: 'Operational / Commercial Observations',
        body: `Current momentum is being shaped by ${topService}, ${topSegment}, and ${topOwner}, while average deal size is ${currencyText(avgDealCurrent)} versus ${currencyText(avgDealPrior)} ${period.comparisonLabel.toLowerCase()}. This matters because larger deal size can improve growth optics while simultaneously increasing fragility if contribution narrows. The implication is that operational review should distinguish broad-based improvement from narrow concentration-driven movement.`
      },
      {
        title: 'Key Wins, Key Losses, and Key Changes',
        body: `Closed won moved from ${wonCountPrior} to ${wonCountCurrent}, closed lost moved from ${lostCountPrior} to ${lostCountCurrent}, and slipped opportunities moved from ${slippedCountPrior} to ${slippedCountCurrent}. This matters because the most important business changes are the few that alter forecast confidence materially. The implication is that leadership review should stay focused on large wins, large losses, major slips, and forecast reclassifications rather than low-signal noise.`
      },
      {
        title: 'Recommended Actions / Leadership Decisions',
        body: `Frontline actions should focus on reducing overdue tasks (${overdueTasksCurrent}) and stale opportunities (${staleCurrent}), management actions should focus on improving weighted-support quality (${bps(supportRateCurrent)} current versus ${bps(supportRatePrior)} prior), and leadership decisions should focus on concentration risk around ${topOwner} and ${topService}. This matters because a business review only creates value when it changes operating decisions. The implication is that the next review period should begin with named ownership and targeted intervention on the largest risk items.`
      },
      {
        title: 'Conclusion',
        body: reviewType === 'WBR'
          ? `In weekly terms, the business showed measurable movement in inputs and outputs, but next-week confidence depends on whether support quality improves alongside close activity. The biggest opportunity is converting visible movement into credible execution, and the biggest risk remains unsupported near-term pipeline.`
          : reviewType === 'MBR'
          ? `In monthly terms, the business showed measurable movement in pipeline, support quality, and creation activity, but next-month confidence depends on whether quality improves with volume. The biggest opportunity is broadening contribution, and the biggest risk is concentration-driven fragility.`
          : reviewType === 'QBR'
          ? `In quarterly terms, the business showed measurable movement across pipeline, revenue posture, and integrity signals, but next-quarter readiness depends on whether concentration and support risks are addressed. The biggest opportunity is stronger conversion quality, and the biggest risk is quarter-end fragility concentrated in too few deals.`
          : `In annual terms, the business showed measurable movement across inputs, outputs, and support quality, but next-year strength depends on whether recurring execution weaknesses are structurally corrected. The biggest opportunity is durable quality improvement, and the biggest risk is repeating the same concentration and integrity issues at larger scale.`
      }
    ];

    const generatedAt = new Date().toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      id: `review-${reviewType.toLowerCase()}-${Date.now()}`,
      type: reviewType,
      period: period.label,
      status: 'Draft',
      createdAt: generatedAt,
      title:
        reviewType === 'WBR' ? 'Weekly Business Review'
        : reviewType === 'MBR' ? 'Monthly Business Review'
        : reviewType === 'QBR' ? 'Quarterly Business Review'
        : 'Annual Business Review',
      generatedAt,
      executiveSummary,
      kpis: [
        { label: 'Total Pipeline', value: currencyText(pipelineCurrent), detail: `${pipelineDeltaSentence}` },
        { label: 'Weighted Pipeline', value: currencyText(weightedCurrent), detail: `${weightedDeltaSentence}` },
        { label: 'ARR', value: currencyText(arrCurrent), detail: `${deltaText(arrCurrent, arrPrior, (v) => currencyText(v))} ${period.comparisonLabel}` },
        { label: 'Year 1 Revenue', value: currencyText(year1Current), detail: `${deltaText(year1Current, year1Prior, (v) => currencyText(v))} ${period.comparisonLabel}` },
        { label: 'One-Time / Job Revenue', value: currencyText(oneTimeCurrent), detail: `${deltaText(oneTimeCurrent, oneTimePrior, (v) => currencyText(v))} ${period.comparisonLabel}` },
        { label: 'Open Opportunity Count', value: String(openCountCurrent), detail: `${deltaText(openCountCurrent, openCountPrior)} ${period.comparisonLabel}` },
        { label: 'Average Deal Size', value: currencyText(avgDealCurrent), detail: `${deltaText(avgDealCurrent, avgDealPrior, (v) => currencyText(v))} ${period.comparisonLabel}` },
        { label: 'New Opportunities Created', value: String(newOppCounts.current), detail: `${deltaText(newOppCounts.current, newOppCounts.prior)} ${period.comparisonLabel}` },
        { label: 'New Accounts Created', value: String(newAccountCounts.current), detail: `${deltaText(newAccountCounts.current, newAccountCounts.prior)} ${period.comparisonLabel}` },
        { label: 'Closed Won Count / Value', value: `${wonCountCurrent} / ${currencyText(wonCounts.current)}`, detail: `${deltaText(wonCountCurrent, wonCountPrior)} deals, ${deltaText(wonCounts.current, wonCounts.prior, (v) => currencyText(v))}` },
        { label: 'Closed Lost Count / Value', value: `${lostCountCurrent} / ${currencyText(lostCounts.current)}`, detail: `${deltaText(lostCountCurrent, lostCountPrior)} deals, ${deltaText(lostCounts.current, lostCounts.prior, (v) => currencyText(v))}` },
        { label: 'Slipped Opportunity Count / Value', value: `${slippedCountCurrent} / ${currencyText(slippedValueCurrent)}`, detail: `${deltaText(slippedCountCurrent, slippedCountPrior)} deals, ${deltaText(slippedValueCurrent, slippedValuePrior, (v) => currencyText(v))}` },
        { label: 'Expansion Opportunity Count', value: String(expansionCountCurrent), detail: `${deltaText(expansionCountCurrent, expansionCountPrior)} ${period.comparisonLabel}` },
        { label: 'At-Risk Opportunity Count', value: String(atRiskCurrent), detail: `${deltaText(atRiskCurrent, atRiskPrior)} ${period.comparisonLabel}` },
        { label: 'Overdue Task Count', value: String(overdueTasksCurrent), detail: `${deltaText(overdueTasksCurrent, overdueTasksPrior)} ${period.comparisonLabel}` },
        { label: 'Activity Volume', value: String(activityCurrent), detail: `${deltaText(activityCurrent, activityPrior)} ${period.comparisonLabel}` },
        { label: 'Support Quality', value: bps(supportRateCurrent), detail: `${supportDeltaSentence}` }
      ],
      sections
    };
  }

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0B6771' }}>
          Review Operations
        </div>
        <h2 style={{ margin: '10px 0 0', fontSize: '34px', lineHeight: 1.08, fontWeight: 850, letterSpacing: '-0.03em', color: '#123B42' }}>
          Business Reviews
        </h2>
        <p style={{ margin: '10px 0 0', maxWidth: '860px', fontSize: '15px', lineHeight: 1.7, color: '#5F6F72' }}>
          Generate executive summaries and key metrics across weekly, monthly, quarterly, and annual review cycles.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 0.95fr)', gap: '24px', alignItems: 'start' }}>
        <div style={cardStyle}>
          <div style={{ marginBottom: '22px' }}>
            <h3 style={titleStyle}>Select Review Type</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
            {reviewTypeCards.map((card) => {
              const isSelected = selectedReviewType === card.key;
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => setSelectedReviewType(card.key)}
                  style={{
                    minHeight: '150px',
                    borderRadius: '18px',
                    border: isSelected ? '2px solid #20C4C7' : '1px solid #D9E4DA',
                    background: isSelected ? '#F1FBFB' : '#FFFFFF',
                    padding: '18px 16px',
                    display: 'grid',
                    alignContent: 'center',
                    justifyItems: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '28px', fontWeight: 800, color: isSelected ? '#20C4C7' : '#7A8A90' }}>
                    {card.key === 'WBR' ? '◫' : card.key === 'MBR' ? '↗' : card.key === 'QBR' ? '◰' : '◎'}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#123B42' }}>{card.title}</div>
                  <div style={{ fontSize: '13px', color: '#5F6F72', textAlign: 'center', lineHeight: 1.4 }}>{card.subtitle}</div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '28px' }}>
            <button
              type="button"
              onClick={() => {
                const nextReview = buildGeneratedReview(selectedReviewType);
                setGeneratedReview(nextReview);
                setReviewHistory((current) => {
                  const deduped = current.filter((item) => item.id !== nextReview.id);
                  return [nextReview, ...deduped];
                });
              }}
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '14px',
                border: '1px solid #20C4C7',
                background: '#20C4C7',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Generate Review
            </button>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={titleStyle}>Recent Reviews</h3>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {recentReviews.length ? recentReviews.map((review) => (
              <button
                key={review.id}
                type="button"
                onClick={() => setGeneratedReview(review)}
                style={{
                  border: '1px solid #D9E4DA',
                  background: '#F7FBF8',
                  borderRadius: '16px',
                  padding: '14px 14px 12px',
                  display: 'grid',
                  gap: '8px',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: '50px',
                        height: '26px',
                        padding: '0 10px',
                        borderRadius: '999px',
                        background: '#20C4C7',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 800
                      }}
                    >
                      {review.type}
                    </span>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#123B42' }}>{review.period}</span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F2937' }}>{review.status}</div>
                </div>

                <div style={{ fontSize: '13px', color: '#5F6F72' }}>{review.createdAt}</div>
              </button>
            )) : (
              <div
                style={{
                  border: '1px dashed #D9E4DA',
                  background: '#F7FBF8',
                  borderRadius: '16px',
                  padding: '18px 16px',
                  display: 'grid',
                  gap: '6px'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#123B42' }}>No reviews generated yet</div>
                <div style={{ fontSize: '13px', lineHeight: 1.5, color: '#5F6F72' }}>
                  Generate a WBR, MBR, QBR, or ABR to begin building your saved review history.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {generatedReview ? (
        <div style={{ display: 'grid', gap: '24px' }}>
          <div style={cardStyle}>
            <div style={smallLabelStyle}>Generated Review</div>
            <h3 style={{ margin: '10px 0 0', fontSize: '28px', fontWeight: 850, color: '#123B42' }}>{generatedReview.title}</h3>
            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#5F6F72' }}>{generatedReview.generatedAt}</p>
          </div>

          <div style={cardStyle}>
            <h3 style={titleStyle}>Executive Summary</h3>
            <p style={{ marginTop: '12px', fontSize: '14px', lineHeight: 1.7, color: '#334155' }}>{generatedReview.executiveSummary}</p>
          </div>

          <div style={cardStyle}>
            <h3 style={titleStyle}>KPI Snapshot / Review Metrics Band</h3>
            <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
              {generatedReview.kpis.map((metric) => (
                <div
                  key={metric.label}
                  style={{
                    background: '#F7FBF8',
                    border: '1px solid #D9E4DA',
                    borderRadius: '18px',
                    padding: '18px 18px 16px'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#5F6F72' }}>
                    {metric.label}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 850, color: '#123B42' }}>{metric.value}</div>
                  <div style={{ marginTop: '6px', fontSize: '13px', color: '#5F6F72', lineHeight: 1.5 }}>{metric.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {generatedReview.sections.map((section) => (
            <div key={section.title} style={cardStyle}>
              <h3 style={titleStyle}>{section.title}</h3>
              <p style={{ marginTop: '12px', fontSize: '14px', lineHeight: 1.7, color: '#334155' }}>{section.body}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
function ClientReportsPage({ opportunities = [], accounts = [], contacts = [] }) {
  const derivedClientReports = deriveClientReportsFromOpportunities(opportunities, accounts, contacts);

  const [selectedReportId, setSelectedReportId] = useState(derivedClientReports[0]?.reportId || '');
  const [reportPeriodMode, setReportPeriodMode] = useState('Reporting Period');
  const [customStartDate, setCustomStartDate] = useState('2026-03-01');
  const [customEndDate, setCustomEndDate] = useState('2026-03-31');
  const [recipientInput, setRecipientInput] = useState(derivedClientReports[0]?.deliveryRecipient || '');
  const [actionMessage, setActionMessage] = useState('');
  const [lastActionType, setLastActionType] = useState('');
  const [rowActionSelections, setRowActionSelections] = useState({});

  const clientReports = loadClientReports({}, derivedClientReports);
  const summary = loadClientReportSummary(clientReports);
  const selectedReport =
    clientReports.find((report) => report.reportId === selectedReportId) ||
    clientReports[0] ||
    null;

  const clientOptions = ['All Clients', ...Array.from(new Set(clientReports.map((item) => item.clientName))).sort()];
  const typeOptions = ['All Types', ...Array.from(new Set(clientReports.map((item) => item.reportType))).sort()];
  const statusOptions = ['All Statuses', ...Array.from(new Set(clientReports.map((item) => item.status))).sort()];
  const ownerOptions = ['All Owners', ...Array.from(new Set(clientReports.map((item) => item.ownerName).filter(Boolean))).sort()];
  const sourceOptions = ['All Sources', ...Array.from(new Set(clientReports.map((item) => item.sourceSystem))).sort()];
  const periodOptions = ['All Periods', ...Array.from(new Set(clientReports.map((item) => item.reportingPeriod))).sort()];

  const pageStyle = { maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' };
  const heroStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '24px',
    padding: '28px 30px',
    boxShadow: '0 18px 40px rgba(5, 47, 53, 0.08)'
  };
  const cardStyle = {
    background: '#FFFFFF',
    border: '1px solid #D9E4DA',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 14px 34px rgba(5, 47, 53, 0.06)'
  };
  const titleStyle = { margin: 0, fontSize: '22px', lineHeight: 1.2, fontWeight: 800, color: '#123B42' };
  const introStyle = { margin: '6px 0 0', fontSize: '14px', lineHeight: 1.6, color: '#5F6F72' };
  const kpiGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' };
  const kpiCardStyle = {
    background: '#F7FBF8',
    border: '1px solid #D9E4DA',
    borderRadius: '18px',
    padding: '18px 18px 16px'
  };
  const actionSelectStyle = {
    width: '100%',
    height: '32px',
    borderRadius: '9px',
    border: '1px solid #C9D8CE',
    background: '#F7FBF8',
    color: '#123B42',
    padding: '0 10px',
    fontSize: '11px',
    fontWeight: 700,
    outline: 'none'
  };
  const primaryButtonStyle = {
    height: '40px',
    borderRadius: '12px',
    border: '1px solid #0B6771',
    background: '#0B6771',
    color: '#FFFFFF',
    padding: '0 14px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer'
  };

  const workflowCards = [
    {
      label: 'Ready for Review',
      value: summary.readyForReview,
      detail: 'Awaiting internal review before delivery.'
    },
    {
      label: 'In Progress',
      value: summary.inProgress,
      detail: 'Currently assembling or reconciling inputs.'
    },
    {
      label: 'Delivered',
      value: summary.delivered,
      detail: 'Completed and sent to client recipients.'
    },
    {
      label: 'Failed / Exceptions',
      value: summary.failed,
      detail: 'Need intervention due to sync or generation issues.'
    }
  ];

  function selectReport(report) {
    setSelectedReportId(report.reportId);
    setRecipientInput(report.deliveryRecipient || '');
    setActionMessage('');
    setLastActionType('');
  }

  function runRowAction(report, action) {
    if (!report || !action) return;
    selectReport(report);

    if (action === 'Open') {
      setLastActionType('Open');
      setActionMessage('Report selected in the action panel.');
      return;
    }

    if (action === 'Generate') {
      const result = generateClientReport(report.reportId, {
        mode: reportPeriodMode,
        reportingPeriod: report.reportingPeriod,
        startDate: customStartDate,
        endDate: customEndDate
      });
      setLastActionType('Generate');
      setActionMessage(result.message || 'Client report generated.');
      return;
    }

    if (action === 'Preview') {
      const result = previewClientReport(report.reportId);
      setLastActionType('Preview');
      setActionMessage(result.message || 'Client report preview ready.');
      return;
    }

    if (action === 'Send') {
      const result = sendClientReport(report.reportId, {
        recipients: report.deliveryRecipient || recipientInput,
        mode: reportPeriodMode,
        reportingPeriod: report.reportingPeriod,
        startDate: customStartDate,
        endDate: customEndDate
      });
      setLastActionType('Send');
      setActionMessage(result.message || 'Client report sent.');
      return;
    }
  }

  function handleGenerate() {
    if (!selectedReport) return;
    const result = generateClientReport(selectedReport.reportId, {
      mode: reportPeriodMode,
      reportingPeriod: selectedReport.reportingPeriod,
      startDate: customStartDate,
      endDate: customEndDate
    });
    setLastActionType('Generate');
    setActionMessage(result.message || 'Client report generated.');
  }

  function handlePreview() {
    if (!selectedReport) return;
    const result = previewClientReport(selectedReport.reportId);
    setLastActionType('Preview');
    setActionMessage(result.message || 'Client report preview ready.');
  }

  function handleSend() {
    if (!selectedReport) return;
    const result = sendClientReport(selectedReport.reportId, {
      recipients: recipientInput,
      mode: reportPeriodMode,
      reportingPeriod: selectedReport.reportingPeriod,
      startDate: customStartDate,
      endDate: customEndDate
    });
    setLastActionType('Send');
    setActionMessage(result.message || 'Client report sent.');
  }

  return (
    <div style={pageStyle}>
      <div style={heroStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0B6771' }}>
              Reporting Operations
            </div>
            <h2 style={{ margin: '10px 0 0', fontSize: '34px', lineHeight: 1.08, fontWeight: 850, letterSpacing: '-0.03em', color: '#123B42' }}>
              Client Reports
            </h2>
            <p style={{ margin: '10px 0 0', maxWidth: '840px', fontSize: '15px', lineHeight: 1.7, color: '#5F6F72' }}>
              API-ready operational view for client-facing reporting, review workflow, delivery status, source-system sync visibility, and outbound delivery execution.
            </p>
          </div>

          <div
            style={{
              minWidth: '250px',
              background: '#F7FBF8',
              border: '1px solid #D9E4DA',
              borderRadius: '18px',
              padding: '18px 18px 16px'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5F6F72' }}>
              Last Sync
            </div>
            <div style={{ marginTop: '8px', fontSize: '20px', fontWeight: 800, color: '#123B42' }}>
              {formatClientReportDateTime(summary.lastSyncAt)}
            </div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#5F6F72', lineHeight: 1.5 }}>
              Normalized from upstream source records and ready for backend/API replacement later.
            </div>
          </div>
        </div>
      </div>

      <div style={kpiGridStyle}>
        {[
          ['Reports Due', summary.reportsDue],
          ['Ready for Review', summary.readyForReview],
          ['Delivered', summary.delivered],
          ['Overdue / Failed', summary.overdue + summary.failed]
        ].map(([label, value]) => (
          <div key={label} style={kpiCardStyle}>
            <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5F6F72' }}>{label}</div>
            <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: '#123B42' }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: '12px' }}>
          {[
            ['Client', clientOptions],
            ['Type', typeOptions],
            ['Status', statusOptions],
            ['Owner', ownerOptions],
            ['Source', sourceOptions],
            ['Period', periodOptions]
          ].map(([label, options]) => (
            <div key={label}>
              <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72', marginBottom: '8px' }}>
                {label}
              </div>
              <select
                defaultValue={options[0]}
                style={{
                  width: '100%',
                  height: '42px',
                  borderRadius: '12px',
                  border: '1px solid #D7E1DB',
                  background: '#FAFCFB',
                  padding: '0 12px',
                  color: '#22372C',
                  fontSize: '14px',
                  outline: 'none'
                }}
              >
                {options.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '24px' }}>
        {workflowCards.map((card) => (
          <div key={card.label} style={cardStyle}>
            <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0B6771' }}>
              {card.label}
            </div>
            <div style={{ marginTop: '10px', fontSize: '30px', fontWeight: 800, color: '#123B42' }}>{card.value}</div>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#5F6F72', lineHeight: 1.5 }}>{card.detail}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gap: '24px' }}>
        <div style={cardStyle}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={titleStyle}>Report Action Panel</h3>
            <p style={introStyle}>Select a report, adjust period inputs, review recipient, and trigger generation or outbound send.</p>
          </div>

          {selectedReport ? (
            <div style={{ display: 'grid', gap: '18px' }}>
              <div style={{ padding: '14px 14px 12px', background: '#F7FBF8', border: '1px solid #D9E4DA', borderRadius: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72' }}>Selected Report</div>
                <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 800, color: '#123B42' }}>{selectedReport.reportName}</div>
                <div style={{ marginTop: '6px', fontSize: '13px', color: '#5F6F72' }}>{selectedReport.clientName} • {selectedReport.reportType} • {selectedReport.reportingPeriod || '—'}</div>
              </div>

              <div style={{ display: 'grid', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1.2fr) minmax(180px, 1fr) minmax(180px, 1fr)', gap: '14px', alignItems: 'end' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72', marginBottom: '8px' }}>
                      Period Mode
                    </div>
                    <select
                      value={reportPeriodMode}
                      onChange={(event) => setReportPeriodMode(event.target.value)}
                      style={{
                        width: '100%',
                        minWidth: 0,
                        height: '42px',
                        borderRadius: '12px',
                        border: '1px solid #D7E1DB',
                        background: '#FAFCFB',
                        padding: '0 12px',
                        color: '#22372C',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    >
                      {['Reporting Period', 'Custom Date Range'].map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72', marginBottom: '8px' }}>
                      Start Date
                    </div>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(event) => setCustomStartDate(event.target.value)}
                      style={{
                        width: '100%',
                        minWidth: 0,
                        height: '42px',
                        borderRadius: '12px',
                        border: '1px solid #D7E1DB',
                        background: '#FAFCFB',
                        padding: '0 12px',
                        color: '#22372C',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72', marginBottom: '8px' }}>
                      End Date
                    </div>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(event) => setCustomEndDate(event.target.value)}
                      style={{
                        width: '100%',
                        minWidth: 0,
                        height: '42px',
                        borderRadius: '12px',
                        border: '1px solid #D7E1DB',
                        background: '#FAFCFB',
                        padding: '0 12px',
                        color: '#22372C',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ maxWidth: '540px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72', marginBottom: '8px' }}>
                    Recipient Email(s)
                  </div>
                  <input
                    type="text"
                    value={recipientInput}
                    onChange={(event) => setRecipientInput(event.target.value)}
                    placeholder="client@example.com"
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '12px',
                      border: '1px solid #D7E1DB',
                      background: '#FAFCFB',
                      padding: '0 12px',
                      color: '#22372C',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button type="button" style={primaryButtonStyle} onClick={handleGenerate}>Generate</button>
                <button type="button" style={primaryButtonStyle} onClick={handlePreview}>Preview</button>
                <button type="button" style={primaryButtonStyle} onClick={handleSend}>Send</button>
              </div>

              <div style={{ padding: '14px 14px 12px', background: '#F7FBF8', border: '1px solid #D9E4DA', borderRadius: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72' }}>Execution Status</div>
                <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 700, color: '#123B42' }}>
                  {lastActionType ? `${lastActionType} completed` : 'No action executed yet'}
                </div>
                <div style={{ marginTop: '6px', fontSize: '13px', color: '#5F6F72', lineHeight: 1.5 }}>
                  {actionMessage || 'This panel is wired to service stubs now and is ready for backend/API replacement later.'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '14px', color: '#5F6F72' }}>No report selected.</div>
          )}
        </div>

        <div style={cardStyle}>
          <div style={{ marginBottom: '18px' }}>
            <h3 style={titleStyle}>Report Queue</h3>
            <p style={introStyle}>Stable normalized queue for generation, review, sync, delivery workflows, and outbound actions.</p>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 0.9fr 0.95fr 0.85fr 1fr 0.95fr 0.85fr 0.85fr 0.9fr', gap: '10px', padding: '0 8px 8px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5F6F72' }}>
              <div>Client</div>
              <div>Report</div>
              <div>Type / Period</div>
              <div>Status</div>
              <div>Delivery</div>
              <div>Source</div>
              <div>Sync</div>
              <div>Due</div>
              <div>Delivered</div>
              <div>Actions</div>
            </div>

            {clientReports.map((report) => {
              const statusTone = getClientReportStatusTone(report.status);
              const syncTone = getClientReportSyncTone(report.syncStatus);
              const isSelected = selectedReportId === report.reportId;

              return (
                <div
                  key={report.reportId}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1.6fr 0.9fr 0.95fr 0.85fr 1fr 0.95fr 0.85fr 0.85fr 0.9fr',
                    gap: '10px',
                    alignItems: 'center',
                    padding: '14px 12px',
                    border: isSelected ? '1px solid #0B6771' : '1px solid #E3ECE4',
                    borderRadius: '16px',
                    background: isSelected ? '#F7FBF8' : '#FFFFFF'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#123B42' }}>{report.clientName}</div>
                    <div style={{ fontSize: '12px', color: '#5F6F72', marginTop: '4px' }}>{report.clientId}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#123B42' }}>{report.reportName}</div>
                    <div style={{ fontSize: '12px', color: '#5F6F72', marginTop: '4px' }}>{report.reportId}</div>
                  </div>

                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#123B42' }}>{report.reportType}</div>
                    <div style={{ fontSize: '12px', color: '#5F6F72', marginTop: '4px' }}>{report.reportingPeriod || '—'}</div>
                  </div>

                  <div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: statusTone.background,
                        color: statusTone.color,
                        border: `1px solid ${statusTone.border}`,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {report.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#5F6F72' }}>{report.deliveryStatus}</div>

                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#123B42' }}>{report.sourceSystem}</div>
                    <div style={{ fontSize: '12px', color: '#5F6F72', marginTop: '4px' }}>{report.sourceRecordId || '—'}</div>
                  </div>

                  <div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: syncTone.background,
                        color: syncTone.color,
                        border: `1px solid ${syncTone.border}`,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {report.syncStatus}
                    </span>
                    <div style={{ fontSize: '12px', color: '#5F6F72', marginTop: '6px' }}>{formatClientReportDateTime(report.lastSyncedAt)}</div>
                  </div>

                  <div style={{ fontSize: '13px', color: '#5F6F72' }}>{formatClientReportDate(report.dueDate)}</div>
                  <div style={{ fontSize: '13px', color: '#5F6F72' }}>{formatClientReportDate(report.deliveredAt)}</div>

                  <select
                    value={rowActionSelections[report.reportId] || ''}
                    style={actionSelectStyle}
                    onChange={(event) => {
                      const value = event.target.value;
                      setRowActionSelections((current) => ({
                        ...current,
                        [report.reportId]: value
                      }));
                      if (!value) return;
                      runRowAction(report, value);
                    }}
                  >
                    <option value="">Actions</option>
                    <option value="Open">Open</option>
                    <option value="Generate">Generate</option>
                    <option value="Preview">Preview</option>
                    <option value="Send">Send</option>
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function buildAccountFormFromRecord(record = {}) {
  return {
    name: record.name || '',
    legalBusinessName: record.legalBusinessName || '',
    businessType: record.businessType || '',
    website: record.website || '',
    linkedin: record.linkedin || '',
    mainPhone: record.mainPhone || '',
    generalEmail: record.generalEmail || '',
    mainAddress: record.mainAddress || '',
    city: record.city || '',
    state: record.state || '',
    zip: record.zip || '',
    country: record.country || '',
    primaryAccountOwner: record.primaryAccountOwner || '',
    interestedServices: record.interestedServices || '',
    totalMw: record.totalMw || '',
    portfolioType: record.portfolioType || '',
    generalFootprintRegion: record.generalFootprintRegion || '',
    estimatedBuildingCount: record.estimatedBuildingCount || '',
    estimatedSquareFootage: record.estimatedSquareFootage || '',
    generalSiteType: record.generalSiteType || '',
    notes: record.notes || ''
  };
}

function buildContactFormFromRecord(record = {}) {
  return {
    firstName: record.firstName || '',
    lastName: record.lastName || '',
    fullName: record.fullName || record.name || '',
    jobTitle: record.jobTitle || record.title || '',
    accountId: record.accountId || '',
    email: record.email || '',
    mobilePhone: record.mobilePhone || '',
    officePhone: record.officePhone || '',
    address: record.address || '',
    city: record.city || '',
    state: record.state || '',
    zip: record.zip || '',
    linkedin: record.linkedin || '',
    website: record.website || '',
    preferredContactMethod: record.preferredContactMethod || '',
    roleInBuyingProcess: record.roleInBuyingProcess || '',
    notes: record.notes || '',
    decisionMaker: Boolean(record.decisionMaker),
    champion: Boolean(record.champion),
    primaryContact: Boolean(record.primaryContact),
  };
}

function getAccountById(id, accounts = accountRecords) {
  return accounts.find((item) => item.id === id) || null;
}

function getContactById(id, contacts = contactRecords) {
  return contacts.find((item) => item.id === id) || null;
}

function getContactsForAccount(accountId, contacts = contactRecords) {
  return contacts.filter((item) => item.accountId === accountId);
}

function getOpportunitiesForAccount(accountId, opportunities, accounts = accountRecords) {
  const account = getAccountById(accountId, accounts);
  if (!account) return [];
  return opportunities.filter((item) => (account.openOpportunityIds || []).includes(item.id));
}

function isLegacyDemoAccount(record = {}) {
  const id = String(record?.id || '').toLowerCase();
  const name = String(record?.name || '').toLowerCase();
  return id === 'acct-onyx' || id === 'acct-mn8' || name === 'onyx renewables' || name === 'mn8 energy';
}

function isLegacyDemoContact(record = {}) {
  const id = String(record?.id || '').toLowerCase();
  const fullName = String(record?.fullName || record?.name || '').toLowerCase();
  return (
    id === 'contact-megan' ||
    id === 'contact-cathy' ||
    id === 'contact-amy' ||
    fullName === 'megan smethurst' ||
    fullName === 'cathy example' ||
    fullName === 'amy example'
  );
}

function isLegacyDemoTask(record = {}) {
  const title = String(record?.title || '').toLowerCase();
  return title === 'schedule customer follow-up';
}

function sanitizeAccounts(records) {
  return (Array.isArray(records) ? records : []).filter((item) => !isLegacyDemoAccount(item));
}

function sanitizeContacts(records) {
  return (Array.isArray(records) ? records : []).filter((item) => !isLegacyDemoContact(item));
}

function sanitizeTasks(records) {
  return (Array.isArray(records) ? records : []).filter((item) => !isLegacyDemoTask(item));
}

function sanitizeOpportunities(records) {
  return Array.isArray(records) ? records : [];
}

const initialOpportunities = [];




function buildTaskFormFromRecord(record = {}) {
  return {
    title: record.title || '',
    accountId: record.accountId || '',
    contactId: record.contactId || '',
    opportunityId: record.opportunityId || '',
    owner: record.owner || 'Jeff Yarbrough',
    dueDate: record.dueDate || '',
    priority: record.priority || 'Medium',
    status: record.status || 'Not Started',
    notes: record.notes || ''
  };
}

const CLIENT_REPORT_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  READY_FOR_REVIEW: 'Ready for Review',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
};

const CLIENT_REPORT_TYPE = {
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  ANNUAL: 'Annual',
  AD_HOC: 'Ad Hoc',
};

const CLIENT_REPORT_DELIVERY_STATUS = {
  PENDING: 'Pending',
  DELIVERED: 'Delivered',
  FAILED: 'Failed',
  NOT_APPLICABLE: 'Not Applicable',
};

const CLIENT_REPORT_SYNC_STATUS = {
  SYNCED: 'Synced',
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  FAILED: 'Failed',
};

const initialClientReports = [
  {
    reportId: 'CR-1001',
    sourceSystem: 'Reporting Hub',
    sourceRecordId: 'rh-44711',
    clientId: 'client-onyx',
    clientName: 'Onyx Renewables',
    reportName: 'Onyx Renewables Monthly Operations Report',
    reportType: CLIENT_REPORT_TYPE.MONTHLY,
    reportingPeriod: '2026-03',
    ownerName: 'Ashley Moreno',
    portfolioName: 'Commercial DG Portfolio',
    siteCount: 33,
    status: CLIENT_REPORT_STATUS.READY_FOR_REVIEW,
    deliveryStatus: CLIENT_REPORT_DELIVERY_STATUS.PENDING,
    syncStatus: CLIENT_REPORT_SYNC_STATUS.SYNCED,
    dueDate: '2026-04-05',
    generatedAt: '2026-03-29T14:20:00',
    deliveredAt: '',
    lastUpdatedAt: '2026-03-29T14:20:00',
    lastSyncedAt: '2026-03-30T08:15:00',
    ingestedAt: '2026-03-30T08:15:00',
    version: 'v1.0',
    outputUrl: '',
    draftUrl: '',
    reviewOwner: 'Jeff Yarbrough',
    deliveryRecipient: 'assetreports@onyxrenewables.com',
    failureReason: '',
    notes: 'Monthly package generated and awaiting internal review.',
  },
  {
    reportId: 'CR-1002',
    sourceSystem: 'Reporting Hub',
    sourceRecordId: 'rh-44712',
    clientId: 'client-smg',
    clientName: 'Scale Microgrid Solutions',
    reportName: 'Scale Microgrid Solutions Quarterly Business Review',
    reportType: CLIENT_REPORT_TYPE.QUARTERLY,
    reportingPeriod: '2026-Q1',
    ownerName: 'Ashley Moreno',
    portfolioName: 'Multi-Site PV and Storage',
    siteCount: 18,
    status: CLIENT_REPORT_STATUS.IN_PROGRESS,
    deliveryStatus: CLIENT_REPORT_DELIVERY_STATUS.PENDING,
    syncStatus: CLIENT_REPORT_SYNC_STATUS.PARTIAL,
    dueDate: '2026-04-12',
    generatedAt: '',
    deliveredAt: '',
    lastUpdatedAt: '2026-03-30T06:40:00',
    lastSyncedAt: '2026-03-30T08:15:00',
    ingestedAt: '2026-03-30T08:15:00',
    version: 'v0.8',
    outputUrl: '',
    draftUrl: '',
    reviewOwner: 'Jeff Yarbrough',
    deliveryRecipient: 'operations@scalemicrogrids.com',
    failureReason: '',
    notes: 'Awaiting final KPI reconciliation from external reporting source.',
  },
  {
    reportId: 'CR-1003',
    sourceSystem: 'External API Gateway',
    sourceRecordId: 'ext-99102',
    clientId: 'client-federal',
    clientName: 'Federal Portfolio Group',
    reportName: 'Federal Portfolio Annual Report',
    reportType: CLIENT_REPORT_TYPE.ANNUAL,
    reportingPeriod: '2025',
    ownerName: 'Paul Baltadonis',
    portfolioName: 'National Solar Portfolio',
    siteCount: 52,
    status: CLIENT_REPORT_STATUS.DELIVERED,
    deliveryStatus: CLIENT_REPORT_DELIVERY_STATUS.DELIVERED,
    syncStatus: CLIENT_REPORT_SYNC_STATUS.SYNCED,
    dueDate: '2026-03-15',
    generatedAt: '2026-03-10T09:30:00',
    deliveredAt: '2026-03-12T11:05:00',
    lastUpdatedAt: '2026-03-12T11:05:00',
    lastSyncedAt: '2026-03-30T08:15:00',
    ingestedAt: '2026-03-30T08:15:00',
    version: 'v1.0',
    outputUrl: '#',
    draftUrl: '',
    reviewOwner: 'Jeff Yarbrough',
    deliveryRecipient: 'leadership@federalportfolio.com',
    failureReason: '',
    notes: 'Delivered successfully.',
  },
  {
    reportId: 'CR-1004',
    sourceSystem: 'External API Gateway',
    sourceRecordId: 'ext-99103',
    clientId: 'client-clean-cap',
    clientName: 'CleanCapital',
    reportName: 'CleanCapital Monthly Site Performance Report',
    reportType: CLIENT_REPORT_TYPE.MONTHLY,
    reportingPeriod: '2026-03',
    ownerName: 'Clint Chadwick',
    portfolioName: 'Distributed Generation Fleet',
    siteCount: 27,
    status: CLIENT_REPORT_STATUS.FAILED,
    deliveryStatus: CLIENT_REPORT_DELIVERY_STATUS.FAILED,
    syncStatus: CLIENT_REPORT_SYNC_STATUS.FAILED,
    dueDate: '2026-04-03',
    generatedAt: '',
    deliveredAt: '',
    lastUpdatedAt: '2026-03-30T07:10:00',
    lastSyncedAt: '2026-03-30T08:15:00',
    ingestedAt: '2026-03-30T08:15:00',
    version: 'v0.3',
    outputUrl: '',
    draftUrl: '',
    reviewOwner: 'Jeff Yarbrough',
    deliveryRecipient: 'reports@cleancapital.com',
    failureReason: 'Source data package incomplete from upstream system.',
    notes: 'Retry required after source reconciliation.',
  },
  {
    reportId: 'CR-1005',
    sourceSystem: 'Manual Upload Metadata',
    sourceRecordId: 'manual-2201',
    clientId: 'client-westlands',
    clientName: 'Westlands Almond',
    reportName: 'Westlands Almond Ad Hoc Reliability Review',
    reportType: CLIENT_REPORT_TYPE.AD_HOC,
    reportingPeriod: '2026-03',
    ownerName: 'Ashley Moreno',
    portfolioName: 'Single Client Review',
    siteCount: 4,
    status: CLIENT_REPORT_STATUS.NOT_STARTED,
    deliveryStatus: CLIENT_REPORT_DELIVERY_STATUS.NOT_APPLICABLE,
    syncStatus: CLIENT_REPORT_SYNC_STATUS.PENDING,
    dueDate: '2026-04-18',
    generatedAt: '',
    deliveredAt: '',
    lastUpdatedAt: '2026-03-29T16:00:00',
    lastSyncedAt: '2026-03-30T08:15:00',
    ingestedAt: '2026-03-30T08:15:00',
    version: 'v0.1',
    outputUrl: '',
    draftUrl: '',
    reviewOwner: 'Jeff Yarbrough',
    deliveryRecipient: '',
    failureReason: '',
    notes: 'Ad hoc review requested, scope not yet started.',
  },
];

function formatClientReportDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatClientReportDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getClientReportStatusTone(status) {
  if (status === CLIENT_REPORT_STATUS.DELIVERED) {
    return { background: '#E8F4EC', color: '#256A3E', border: '#B8D7C2' };
  }
  if (status === CLIENT_REPORT_STATUS.READY_FOR_REVIEW) {
    return { background: '#EEF4FF', color: '#285EA8', border: '#C9D9F2' };
  }
  if (status === CLIENT_REPORT_STATUS.IN_PROGRESS) {
    return { background: '#FFF6E8', color: '#9C6218', border: '#F0D3A6' };
  }
  if (status === CLIENT_REPORT_STATUS.FAILED) {
    return { background: '#FCECEC', color: '#A63E3E', border: '#E7C0C0' };
  }
  return { background: '#F4F6F8', color: '#566370', border: '#D7DEE5' };
}

function getClientReportSyncTone(syncStatus) {
  if (syncStatus === CLIENT_REPORT_SYNC_STATUS.SYNCED) {
    return { background: '#E8F4EC', color: '#256A3E', border: '#B8D7C2' };
  }
  if (syncStatus === CLIENT_REPORT_SYNC_STATUS.PARTIAL) {
    return { background: '#FFF6E8', color: '#9C6218', border: '#F0D3A6' };
  }
  if (syncStatus === CLIENT_REPORT_SYNC_STATUS.FAILED) {
    return { background: '#FCECEC', color: '#A63E3E', border: '#E7C0C0' };
  }
  return { background: '#F4F6F8', color: '#566370', border: '#D7DEE5' };
}

function normalizeClientReportRecord(record = {}) {
  return {
    reportId: String(record.reportId || ''),
    sourceSystem: String(record.sourceSystem || 'Unknown Source'),
    sourceRecordId: String(record.sourceRecordId || ''),
    clientId: String(record.clientId || ''),
    clientName: String(record.clientName || 'Unknown Client'),
    reportName: String(record.reportName || 'Untitled Report'),
    reportType: String(record.reportType || CLIENT_REPORT_TYPE.MONTHLY),
    reportingPeriod: String(record.reportingPeriod || ''),
    ownerName: String(record.ownerName || ''),
    portfolioName: String(record.portfolioName || ''),
    siteCount: Number(record.siteCount || 0),
    status: String(record.status || CLIENT_REPORT_STATUS.NOT_STARTED),
    deliveryStatus: String(record.deliveryStatus || CLIENT_REPORT_DELIVERY_STATUS.PENDING),
    syncStatus: String(record.syncStatus || CLIENT_REPORT_SYNC_STATUS.PENDING),
    dueDate: String(record.dueDate || ''),
    generatedAt: String(record.generatedAt || ''),
    deliveredAt: String(record.deliveredAt || ''),
    lastUpdatedAt: String(record.lastUpdatedAt || ''),
    lastSyncedAt: String(record.lastSyncedAt || ''),
    ingestedAt: String(record.ingestedAt || ''),
    version: String(record.version || ''),
    outputUrl: String(record.outputUrl || ''),
    draftUrl: String(record.draftUrl || ''),
    reviewOwner: String(record.reviewOwner || ''),
    deliveryRecipient: String(record.deliveryRecipient || ''),
    failureReason: String(record.failureReason || ''),
    notes: String(record.notes || ''),
  };
}

function loadClientReports(filters = {}, records = initialClientReports) {
  const normalized = (Array.isArray(records) ? records : initialClientReports).map(normalizeClientReportRecord);

  return normalized.filter((report) => {
    if (filters.clientName && filters.clientName !== 'All Clients' && report.clientName !== filters.clientName) return false;
    if (filters.reportType && filters.reportType !== 'All Types' && report.reportType !== filters.reportType) return false;
    if (filters.status && filters.status !== 'All Statuses' && report.status !== filters.status) return false;
    if (filters.ownerName && filters.ownerName !== 'All Owners' && report.ownerName !== filters.ownerName) return false;
    if (filters.sourceSystem && filters.sourceSystem !== 'All Sources' && report.sourceSystem !== filters.sourceSystem) return false;
    if (filters.reportingPeriod && filters.reportingPeriod !== 'All Periods' && report.reportingPeriod !== filters.reportingPeriod) return false;
    return true;
  });
}

function loadClientReportSummary(records = initialClientReports) {
  const normalized = (Array.isArray(records) ? records : initialClientReports).map(normalizeClientReportRecord);
  const uniqueClients = new Set(normalized.map((item) => item.clientName).filter(Boolean));
  const lastSyncAt = normalized.reduce((latest, item) => {
    if (!item.lastSyncedAt) return latest;
    if (!latest) return item.lastSyncedAt;
    return new Date(item.lastSyncedAt) > new Date(latest) ? item.lastSyncedAt : latest;
  }, '');

  const overdueCount = normalized.filter((item) => {
    if (!item.dueDate) return false;
    if (item.status === CLIENT_REPORT_STATUS.DELIVERED) return false;
    const due = new Date(item.dueDate);
    const now = new Date('2026-03-30T09:00:00');
    return !Number.isNaN(due.getTime()) && due < now;
  }).length;

  return {
    reportsDue: normalized.filter((item) => !!item.dueDate).length,
    inProgress: normalized.filter((item) => item.status === CLIENT_REPORT_STATUS.IN_PROGRESS).length,
    readyForReview: normalized.filter((item) => item.status === CLIENT_REPORT_STATUS.READY_FOR_REVIEW).length,
    delivered: normalized.filter((item) => item.status === CLIENT_REPORT_STATUS.DELIVERED).length,
    overdue: overdueCount,
    failed: normalized.filter((item) => item.status === CLIENT_REPORT_STATUS.FAILED).length,
    clientsCovered: uniqueClients.size,
    lastSyncAt,
  };
}

function loadClientReportHistory(clientId) {
  return initialClientReports
    .map(normalizeClientReportRecord)
    .filter((report) => report.clientId === clientId)
    .sort((a, b) => {
      const aDate = new Date(a.lastUpdatedAt || a.generatedAt || 0).getTime();
      const bDate = new Date(b.lastUpdatedAt || b.generatedAt || 0).getTime();
      return bDate - aDate;
    });
}

function deriveClientReportsFromOpportunities(opportunities = [], accounts = [], contacts = []) {
  const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const safeContacts = Array.isArray(contacts) ? contacts : [];

  const accountById = new Map(safeAccounts.map((account) => [String(account?.id || ''), account]));
  const contactById = new Map(safeContacts.map((contact) => [String(contact?.id || ''), contact]));

  return safeOpportunities
    .filter((opportunity) => {
      const serviceLine = String(opportunity?.service_line || opportunity?.serviceLine || '').trim();
      const marketSegment = String(opportunity?.market_segment || opportunity?.marketSegment || '').trim();
      return serviceLine === 'Renewables' && (marketSegment === 'DG' || marketSegment === 'USS');
    })
    .map((opportunity) => {
      const opportunityId = String(opportunity?.id || '').trim();
      const accountId = String(opportunity?.account_id || opportunity?.accountId || '').trim();
      const contactId = String(opportunity?.primary_contact_id || opportunity?.primaryContactId || '').trim();

      const account = accountById.get(accountId) || null;
      const contact = contactById.get(contactId) || null;

      const marketSegment = String(opportunity?.market_segment || opportunity?.marketSegment || '').trim();
      const clientName =
        String(account?.name || opportunity?.account_name || opportunity?.account || '').trim() || 'Unknown Client';
      const ownerName =
        String(opportunity?.owner_full_name || opportunity?.owner || '').trim() || 'Jeff Yarbrough';
      const deliveryRecipient =
        String(contact?.email || account?.generalEmail || '').trim();
      const derivedStatus = deliveryRecipient
        ? CLIENT_REPORT_STATUS.READY_FOR_REVIEW
        : CLIENT_REPORT_STATUS.NOT_STARTED;
      const derivedDueDate = '2026-04-05';

      return normalizeClientReportRecord({
        reportId: `CR-${opportunityId || Date.now()}`,
        sourceSystem: 'CRM Opportunities',
        sourceRecordId: opportunityId,
        clientId: accountId || opportunityId,
        clientName,
        reportName: `${clientName} Monthly Operations Report`,
        reportType: CLIENT_REPORT_TYPE.MONTHLY,
        reportingPeriod: '2026-03',
        ownerName,
        portfolioName: `${marketSegment} Renewables`,
        siteCount: Number(opportunity?.renewablesSiteCount || 0),
        status: derivedStatus,
        deliveryStatus: CLIENT_REPORT_DELIVERY_STATUS.PENDING,
        syncStatus: CLIENT_REPORT_SYNC_STATUS.SYNCED,
        dueDate: derivedDueDate,
        generatedAt: '',
        deliveredAt: '',
        lastUpdatedAt: String(opportunity?.updated_at || opportunity?.created_at || '').trim(),
        lastSyncedAt: String(opportunity?.updated_at || opportunity?.created_at || '').trim(),
        ingestedAt: String(opportunity?.created_at || '').trim(),
        version: 'v0.1',
        outputUrl: '',
        draftUrl: '',
        reviewOwner: ownerName,
        deliveryRecipient,
        failureReason: '',
        notes: `Derived from live opportunity ${String(opportunity?.name || '').trim() || 'Opportunity'}.`
      });
    })
    .sort((a, b) => String(a.clientName || '').localeCompare(String(b.clientName || '')));
}

function generateClientReport(reportId, params = {}) {
  return {
    ok: true,
    reportId,
    generationStatus: 'Generated',
    generatedAt: new Date().toISOString(),
    artifactUrl: '#',
    params,
    message: 'Client report generation stub completed successfully.'
  };
}

function previewClientReport(reportId) {
  return {
    ok: true,
    reportId,
    previewUrl: '#',
    message: 'Client report preview stub ready.'
  };
}

function sendClientReport(reportId, payload = {}) {
  return {
    ok: true,
    reportId,
    sendStatus: 'Sent',
    sentAt: new Date().toISOString(),
    payload,
    message: 'Client report send stub completed successfully.'
  };
}

const initialTasks = [];

function NewTaskPage({
  newTaskForm = {},
  accountOptions = [],
  contactOptions = [],
  opportunityOptions = [],
  onChangeNewTaskField,
  onSaveNewTask,
  onCancelNewTask
}) {
  const fieldLabelStyle = {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: naesTheme.textSoft,
  };

  const inputStyle = {
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    borderRadius: '12px',
    border: `1px solid ${naesTheme.border}`,
    background: '#fff',
    padding: '10px 12px',
    fontSize: '13px',
    color: naesTheme.text,
    marginTop: '6px',
    display: 'block',
  };

  const sectionStyle = {
    ...naesCardStyle(false),
    padding: '18px',
    maxWidth: '720px',
    width: '100%',
    margin: '0 auto',
  };

  const stackedGrid = {
    marginTop: '12px',
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: '1fr',
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'grid', gap: '16px' }}>
      <section style={{ ...naesCardStyle(true), padding: '18px', maxWidth: '720px', width: '100%', margin: '0 auto', background: 'linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%)' }}>
        {smallLabel('Tasks')}
        <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 800, color: naesTheme.text }}>New Task</h2>
        <p style={{ marginTop: '10px', maxWidth: '620px', fontSize: '13px', lineHeight: 1.6, color: naesTheme.textMuted }}>
          Simple task record tied mainly to an account, with optional contact and opportunity links.
        </p>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Task Information')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Core task details
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Task Title</div>
            <input value={newTaskForm.title ?? ''} onChange={(e) => onChangeNewTaskField('title', e.target.value)} placeholder="Follow up with customer" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>Linked Account</div>
            <select value={newTaskForm.accountId ?? ''} onChange={(e) => onChangeNewTaskField('accountId', e.target.value)} style={inputStyle}>
              <option value="">Select account</option>
              {accountOptions.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={fieldLabelStyle}>Linked Contact</div>
            <select value={newTaskForm.contactId ?? ''} onChange={(e) => onChangeNewTaskField('contactId', e.target.value)} style={inputStyle}>
              <option value="">Optional contact</option>
              {contactOptions.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.fullName || contact.name || [contact.firstName, contact.lastName].filter(Boolean).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div style={fieldLabelStyle}>Linked Opportunity</div>
            <select value={newTaskForm.opportunityId ?? ''} onChange={(e) => onChangeNewTaskField('opportunityId', e.target.value)} style={inputStyle}>
              <option value="">Optional opportunity</option>
              {opportunityOptions.map((opportunity) => (
                <option key={opportunity.id} value={opportunity.id}>{opportunity.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={fieldLabelStyle}>Owner</div>
            <input value={newTaskForm.owner ?? ''} onChange={(e) => onChangeNewTaskField('owner', e.target.value)} placeholder="Jeff Yarbrough" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>Due Date</div>
            <input type="date" value={newTaskForm.dueDate ?? ''} onChange={(e) => onChangeNewTaskField('dueDate', e.target.value)} style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>Priority</div>
            <select value={newTaskForm.priority ?? 'Medium'} onChange={(e) => onChangeNewTaskField('priority', e.target.value)} style={inputStyle}>
              {['High', 'Medium', 'Low'].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>

          <div>
            <div style={fieldLabelStyle}>Status</div>
            <select value={newTaskForm.status ?? 'Not Started'} onChange={(e) => onChangeNewTaskField('status', e.target.value)} style={inputStyle}>
              {['Not Started', 'In Progress', 'Waiting', 'Completed'].map((value) => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Notes')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Task notes
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Notes</div>
            <textarea
              value={newTaskForm.notes ?? ''}
              onChange={(e) => onChangeNewTaskField('notes', e.target.value)}
              placeholder="Internal notes, follow-up details, or next actions"
              rows={5}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onSaveNewTask}
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.primary}`,
                background: naesTheme.primary,
                color: '#fff',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Save Task
            </button>

            <button
              type="button"
              onClick={onCancelNewTask}
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.border}`,
                background: '#fff',
                color: naesTheme.textMuted,
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function TasksOverviewPage({ tasks = [], accounts = [], contacts = [], opportunities = [], onStartNewTask, onOpenTask }) {
  const totalTasks = tasks.length;
  const notStarted = tasks.filter((item) => item.status === 'Not Started').length;
  const inProgress = tasks.filter((item) => item.status === 'In Progress').length;
  const completed = tasks.filter((item) => item.status === 'Completed').length;

  const summaryCards = [
    { label: 'Tasks', value: String(totalTasks), sub: 'active records' },
    { label: 'Not Started', value: String(notStarted), sub: 'not yet underway' },
    { label: 'In Progress', value: String(inProgress), sub: 'currently moving' },
    { label: 'Completed', value: String(completed), sub: 'done' }
  ];

  function accountNameFor(task) {
    const account = accounts.find((item) => item.id === task.accountId);
    return account?.name || '—';
  }

  function contactNameFor(task) {
    const contact = contacts.find((item) => item.id === task.contactId);
    return contact?.fullName || contact?.name || [contact?.firstName, contact?.lastName].filter(Boolean).join(' ') || '—';
  }

  function opportunityNameFor(task) {
    const opportunity = opportunities.find((item) => item.id === task.opportunityId);
    return opportunity?.name || '—';
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' }}>
      <section style={{ ...naesCardStyle(true), padding: '26px 28px', background: 'linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%)' }}>
        {smallLabel('Tasks')}
        <h2 style={{ margin: '8px 0 0 0', fontSize: '26px', fontWeight: 800, color: naesTheme.text }}>Tasks Roll-up</h2>
        <p style={{ marginTop: '12px', maxWidth: '780px', fontSize: '14px', lineHeight: 1.65, color: naesTheme.textMuted }}>
          Simple action records tied mainly to accounts, with optional links to contacts and opportunities.
        </p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{ ...naesCardStyle(false), padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: naesTheme.textSoft }}>
              {card.label}
            </div>
            <div style={{ marginTop: '10px', fontSize: '30px', fontWeight: 800, color: naesTheme.text }}>
              {card.value}
            </div>
            <div style={{ marginTop: '6px', fontSize: '13px', color: naesTheme.textMuted }}>
              {card.sub}
            </div>
          </div>
        ))}
      </section>

      <section style={{ ...naesCardStyle(false), padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            {smallLabel('Task List')}
            <h3 style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 800, color: naesTheme.text }}>
              Main page, simple task tracking
            </h3>
          </div>

          <button
            type="button"
            onClick={onStartNewTask}
            style={{
              borderRadius: '18px',
              border: `1px solid ${naesTheme.border}`,
              background: naesTheme.primarySoft,
              color: naesTheme.primaryStrong,
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Add New Task
          </button>
        </div>

        <div style={{ marginTop: '18px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Task', 'Account', 'Contact', 'Opportunity', 'Owner', 'Due Date', 'Priority', 'Status'].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign: 'left',
                      padding: '0 12px 12px 0',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: naesTheme.textSoft,
                      borderBottom: `1px solid ${naesTheme.border}`
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => onOpenTask && onOpenTask(task.id)}
                  style={{ cursor: onOpenTask ? 'pointer' : 'default' }}
                >
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', fontWeight: 700, color: naesTheme.primaryStrong }}>
                    {task.title || 'Task'}
                  </td>
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {accountNameFor(task)}
                  </td>
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {contactNameFor(task)}
                  </td>
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {opportunityNameFor(task)}
                  </td>
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {task.owner || '—'}
                  </td>
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {task.dueDate || '—'}
                  </td>
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {task.priority || '—'}
                  </td>
                  <td style={{ padding: '14px 0 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {task.status || '—'}
                  </td>
                </tr>
              ))}
              {!tasks.length ? (
                <tr>
                  <td colSpan="8" style={{ padding: '18px 0', fontSize: '13px', color: naesTheme.textMuted }}>
                    No tasks yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function NewContactPage({ newContactForm = {}, accountOptions = [], onChangeNewContactField, onSaveNewContact, onCancelNewContact }) {
  const fieldLabelStyle = {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: naesTheme.textSoft,
  };

  const inputStyle = {
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    borderRadius: '12px',
    border: `1px solid ${naesTheme.border}`,
    background: '#fff',
    padding: '10px 12px',
    fontSize: '13px',
    color: naesTheme.text,
    marginTop: '6px',
    display: 'block',
  };

  const sectionStyle = {
    ...naesCardStyle(false),
    padding: '18px',
    maxWidth: '720px',
    width: '100%',
    margin: '0 auto',
  };

  const stackedGrid = {
    marginTop: '12px',
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: '1fr',
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'grid', gap: '16px' }}>
      <section style={{ ...naesCardStyle(true), padding: '18px', maxWidth: '720px', width: '100%', margin: '0 auto', background: 'linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%)' }}>
        {smallLabel('Contacts')}
        <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 800, color: naesTheme.text }}>New Contact</h2>
        <p style={{ marginTop: '10px', maxWidth: '620px', fontSize: '13px', lineHeight: 1.6, color: naesTheme.textMuted }}>
          Create a clean person-level profile tied to an account.
        </p>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Basic Contact Information')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Core person details
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>First Name</div>
            <input value={newContactForm.firstName ?? ''} onChange={(e) => onChangeNewContactField('firstName', e.target.value)} placeholder="Jane" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>Last Name</div>
            <input value={newContactForm.lastName ?? ''} onChange={(e) => onChangeNewContactField('lastName', e.target.value)} placeholder="Smith" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>Job Title</div>
            <input value={newContactForm.jobTitle ?? ''} onChange={(e) => onChangeNewContactField('jobTitle', e.target.value)} placeholder="Director of Operations" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>Company / Linked Account</div>
            <select value={newContactForm.accountId ?? ''} onChange={(e) => onChangeNewContactField('accountId', e.target.value)} style={inputStyle}>
              <option value="">Select account</option>
              {accountOptions.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Contact Information')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Reachability and channels
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Email</div>
            <input value={newContactForm.email ?? ''} onChange={(e) => onChangeNewContactField('email', e.target.value)} placeholder="jane@company.com" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>Mobile Phone</div>
            <input value={newContactForm.mobilePhone ?? ''} onChange={(e) => onChangeNewContactField('mobilePhone', e.target.value)} placeholder="(555) 555-5555" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>Office Phone</div>
            <input value={newContactForm.officePhone ?? ''} onChange={(e) => onChangeNewContactField('officePhone', e.target.value)} placeholder="(555) 555-5555" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>LinkedIn</div>
            <input value={newContactForm.linkedin ?? ''} onChange={(e) => onChangeNewContactField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>Website</div>
            <input value={newContactForm.website ?? ''} onChange={(e) => onChangeNewContactField('website', e.target.value)} placeholder="Optional personal or professional website" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>Preferred Contact Method</div>
            <input value={newContactForm.preferredContactMethod ?? ''} onChange={(e) => onChangeNewContactField('preferredContactMethod', e.target.value)} placeholder="Email, mobile, office phone..." style={inputStyle} />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Address and Buying Role')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Supporting details
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Address</div>
            <input value={newContactForm.address ?? ''} onChange={(e) => onChangeNewContactField('address', e.target.value)} placeholder="123 Main Street" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>City</div>
            <input value={newContactForm.city ?? ''} onChange={(e) => onChangeNewContactField('city', e.target.value)} placeholder="Phoenix" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>State</div>
            <input value={newContactForm.state ?? ''} onChange={(e) => onChangeNewContactField('state', e.target.value)} placeholder="AZ" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>ZIP</div>
            <input value={newContactForm.zip ?? ''} onChange={(e) => onChangeNewContactField('zip', e.target.value)} placeholder="85004" style={inputStyle} />
          </div>

          <div>
            <div style={fieldLabelStyle}>Role in Buying Process</div>
            <input value={newContactForm.roleInBuyingProcess ?? ''} onChange={(e) => onChangeNewContactField('roleInBuyingProcess', e.target.value)} placeholder="Decision maker, champion, evaluator..." style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            {[
              ['decisionMaker', 'Decision Maker'],
              ['champion', 'Influencer / Champion'],
              ['primaryContact', 'Primary Contact'],
            ].map(([field, label]) => (
              <label key={field} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: naesTheme.text }}>
                <input
                  type="checkbox"
                  checked={Boolean(newContactForm[field])}
                  onChange={(e) => onChangeNewContactField(field, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Notes')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Communication notes
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Notes</div>
            <textarea
              value={newContactForm.notes ?? ''}
              onChange={(e) => onChangeNewContactField('notes', e.target.value)}
              placeholder="Useful background, communication preferences, or relationship notes"
              rows={5}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onSaveNewContact}
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.primary}`,
                background: naesTheme.primary,
                color: '#fff',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Save Contact
            </button>

            <button
              type="button"
              onClick={onCancelNewContact}
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.border}`,
                background: '#fff',
                color: naesTheme.textMuted,
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}


function ContactsOverviewPage({ contacts = [], accounts = [], onOpenContact, onStartNewContact }) {
  const totalContacts = contacts.length;
  const decisionMakers = contacts.filter((item) => item.decisionMaker).length;
  const primaryContacts = contacts.filter((item) => item.primaryContact).length;
  const linkedAccounts = new Set(contacts.map((item) => item.accountId).filter(Boolean)).size;

  const summaryCards = [
    { label: 'Contacts', value: String(totalContacts), sub: 'person records' },
    { label: 'Decision Makers', value: String(decisionMakers), sub: 'flagged contacts' },
    { label: 'Primary Contacts', value: String(primaryContacts), sub: 'main relationship owners' },
    { label: 'Linked Accounts', value: String(linkedAccounts), sub: 'companies represented' }
  ];

  function accountNameFor(contact) {
    const account = accounts.find((item) => item.id === contact.accountId);
    return account?.name || contact.accountName || '—';
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' }}>
      <section style={{ ...naesCardStyle(true), padding: '26px 28px', background: 'linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%)' }}>
        {smallLabel('Contacts')}
        <h2 style={{ margin: '8px 0 0 0', fontSize: '26px', fontWeight: 800, color: naesTheme.text }}>Contacts Roll-up</h2>
        <p style={{ marginTop: '12px', maxWidth: '780px', fontSize: '14px', lineHeight: 1.65, color: naesTheme.textMuted }}>
          Person-level records only. This is where names, titles, phone numbers, emails, LinkedIn, and account relationships live.
        </p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{ ...naesCardStyle(false), padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: naesTheme.textSoft }}>
              {card.label}
            </div>
            <div style={{ marginTop: '10px', fontSize: '30px', fontWeight: 800, color: naesTheme.text }}>
              {card.value}
            </div>
            <div style={{ marginTop: '6px', fontSize: '13px', color: naesTheme.textMuted }}>
              {card.sub}
            </div>
          </div>
        ))}
      </section>

      <section style={{ ...naesCardStyle(false), padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            {smallLabel('Contact List')}
            <h3 style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 800, color: naesTheme.text }}>
              Main page, click contact for detail
            </h3>
          </div>

          <button
            type="button"
            onClick={onStartNewContact}
            style={{
              borderRadius: '18px',
              border: `1px solid ${naesTheme.border}`,
              background: naesTheme.primarySoft,
              color: naesTheme.primaryStrong,
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Add New Contact
          </button>
        </div>

        <div style={{ marginTop: '18px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Full Name', 'Job Title', 'Company', 'Email', 'Mobile', 'Office', 'Preferred Contact', 'Flags'].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign: 'left',
                      padding: '0 12px 12px 0',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: naesTheme.textSoft,
                      borderBottom: `1px solid ${naesTheme.border}`
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => {
                const flags = [
                  contact.decisionMaker ? 'DM' : null,
                  contact.champion ? 'Champion' : null,
                  contact.primaryContact ? 'Primary' : null,
                ].filter(Boolean).join(', ');

                return (
                  <tr
                    key={contact.id}
                    onClick={() => onOpenContact(contact.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}` }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: naesTheme.text }}>
                        {contact.fullName || [contact.firstName, contact.lastName].filter(Boolean).join(' ') || contact.name || 'Contact'}
                      </div>
                    </td>
                    <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                      {contact.jobTitle || contact.title || '—'}
                    </td>
                    <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                      {accountNameFor(contact)}
                    </td>
                    <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                      {contact.email || '—'}
                    </td>
                    <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                      {contact.mobilePhone || '—'}
                    </td>
                    <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                      {contact.officePhone || '—'}
                    </td>
                    <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                      {contact.preferredContactMethod || '—'}
                    </td>
                    <td style={{ padding: '16px 0 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                      {flags || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ContactDetailPage({ contactId, contacts = contactRecords, accounts = accountRecords, opportunities = [], onBackToContacts, onOpenAccount, onOpenOpportunity, onEditContact }) {
  const contact = getContactById(contactId, contacts);
  const linkedAccount = contact?.accountId ? getAccountById(contact.accountId, accounts) : null;
  const relatedOpps = linkedAccount ? getOpportunitiesForAccount(linkedAccount.id, opportunities, accounts) : [];

  if (!contact) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'grid', gap: '20px' }}>
        <section style={{ ...naesCardStyle(false), padding: '20px' }}>
          {smallLabel('Contact Detail')}
          <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 800, color: naesTheme.text }}>Contact not found</h2>
          <p style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.6, color: naesTheme.textMuted }}>
            The requested contact record does not exist in the current contact list.
          </p>
          <button type="button" onClick={onBackToContacts} style={{ ...buttonStyle(true), marginTop: '16px' }}>
            Back to Contacts
          </button>
        </section>
      </div>
    );
  }

  const fullName = contact.fullName || [contact.firstName, contact.lastName].filter(Boolean).join(' ') || contact.name || 'Contact';

  const detailCard = {
    ...naesCardStyle(false),
    padding: '18px',
  };

  const fieldLabel = {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: naesTheme.textSoft,
  };

  const fieldBox = {
    marginTop: '6px',
    borderRadius: '12px',
    border: `1px solid ${naesTheme.border}`,
    background: '#fff',
    padding: '10px 12px',
    fontSize: '13px',
    color: naesTheme.text,
    minHeight: '42px',
    display: 'flex',
    alignItems: 'center',
  };

  const statCards = [
    { label: 'Account', value: linkedAccount?.name || '—', sub: 'company relationship' },
    { label: 'Related Opportunities', value: String(relatedOpps.length), sub: 'through linked account' },
    { label: 'Preferred Contact', value: contact.preferredContactMethod || '—', sub: 'communication preference' },
    { label: 'Role', value: contact.roleInBuyingProcess || '—', sub: 'buying process role' }
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'grid', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '-8px' }}>
        <button type="button" onClick={onBackToContacts} style={{ ...buttonStyle(true) }}>
          Back to Contacts
        </button>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onEditContact} style={{ ...buttonStyle(true) }}>
            Edit Contact
          </button>

          {linkedAccount ? (
            <button type="button" onClick={() => onOpenAccount(linkedAccount.id)} style={{ ...buttonStyle(true) }}>
              Open Account
            </button>
          ) : null}
        </div>
      </div>

      <section style={{ ...naesCardStyle(true), padding: '20px', background: 'linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%)' }}>
        {smallLabel('Contact Detail')}
        <h2 style={{ margin: '12px 0 0 0', fontSize: '24px', fontWeight: 800, color: naesTheme.text }}>
          {fullName}
        </h2>
        <p style={{ marginTop: '10px', maxWidth: '760px', fontSize: '14px', lineHeight: 1.6, color: naesTheme.textMuted }}>
          Saved person-level profile with contact details, company relationship, and connected CRM records.
        </p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {statCards.map((card) => (
          <div key={card.label} style={{ ...naesCardStyle(false), padding: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: naesTheme.textSoft }}>
              {card.label}
            </div>
            <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
              {card.value}
            </div>
            <div style={{ marginTop: '6px', fontSize: '12px', color: naesTheme.textMuted }}>
              {card.sub}
            </div>
          </div>
        ))}
      </section>

      <section style={detailCard}>
        {smallLabel('Contact Profile')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Saved contact information
        </h3>

        <div style={{ marginTop: '14px', display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {[
            ['First Name', contact.firstName],
            ['Last Name', contact.lastName],
            ['Full Name', fullName],
            ['Job Title', contact.jobTitle || contact.title],
            ['Company / Account', linkedAccount?.name || '—'],
            ['Email', contact.email],
            ['Mobile Phone', contact.mobilePhone],
            ['Office Phone', contact.officePhone],
            ['Address', contact.address],
            ['City', contact.city],
            ['State', contact.state],
            ['ZIP', contact.zip],
            ['LinkedIn', contact.linkedin],
            ['Website', contact.website],
            ['Preferred Contact Method', contact.preferredContactMethod],
            ['Role in Buying Process', contact.roleInBuyingProcess],
            ['Decision Maker', contact.decisionMaker ? 'Yes' : 'No'],
            ['Champion', contact.champion ? 'Yes' : 'No'],
            ['Primary Contact', contact.primaryContact ? 'Yes' : 'No'],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={fieldLabel}>{label}</div>
              <div style={fieldBox}>{value || '—'}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={detailCard}>
        {smallLabel('Communication Notes')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Notes
        </h3>
        <div style={{ ...fieldBox, marginTop: '14px', minHeight: '84px', alignItems: 'flex-start' }}>
          {contact.notes || '—'}
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '20px' }}>
        <div style={detailCard}>
          {smallLabel('Related Opportunities')}
          <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
            Opportunity visibility
          </h3>
          <div style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
            {relatedOpps.length ? relatedOpps.map((opportunity) => (
              <button
                key={opportunity.id}
                type="button"
                onClick={() => onOpenOpportunity(opportunity.id)}
                style={{
                  textAlign: 'left',
                  borderRadius: '12px',
                  border: `1px solid ${naesTheme.border}`,
                  background: '#fff',
                  padding: '12px 14px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 700, color: naesTheme.text }}>
                  {opportunity.name || 'Opportunity'}
                </div>
                <div style={{ marginTop: '4px', fontSize: '12px', color: naesTheme.textMuted }}>
                  {opportunity.stage || 'No stage'}
                </div>
              </button>
            )) : (
              <div style={{ borderRadius: '12px', border: `1px solid ${naesTheme.border}`, background: '#fff', padding: '12px 14px', fontSize: '13px', color: naesTheme.textMuted }}>
                No opportunities linked yet.
              </div>
            )}
          </div>
        </div>

        <div style={detailCard}>
          {smallLabel('Related Tasks')}
          <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
            Tasks
          </h3>
          <div style={{ borderRadius: '12px', border: `1px solid ${naesTheme.border}`, background: '#fff', padding: '12px 14px', marginTop: '14px', fontSize: '13px', color: naesTheme.textMuted }}>
            Tasks section coming next.
          </div>
        </div>

        <div style={detailCard}>
          {smallLabel('Related Activities')}
          <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
            Activities
          </h3>
          <div style={{ borderRadius: '12px', border: `1px solid ${naesTheme.border}`, background: '#fff', padding: '12px 14px', marginTop: '14px', fontSize: '13px', color: naesTheme.textMuted }}>
            Activities section coming next.
          </div>
        </div>
      </section>
    </div>
  );
}



function buildActivityFormFromRecord(record = {}) {
  return {
    activityType: record.activityType || record.type || 'Call',
    subject: record.subject || '',
    activityDateTime: record.activityDateTime || record.dateTime || '',
    owner: record.owner || 'Jeff Yarbrough',
    accountId: record.accountId || '',
    contactId: record.contactId || '',
    opportunityId: record.opportunityId || '',
    notes: record.notes || ''
  };
}

function NewActivityPage({
  newActivityForm = {},
  accountOptions = [],
  contactOptions = [],
  opportunityOptions = [],
  onChangeNewActivityField,
  onSaveNewActivity,
  onCancelNewActivity
}) {
  const fieldLabelStyle = {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: naesTheme.textSoft,
  };

  const inputStyle = {
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    borderRadius: '12px',
    border: `1px solid ${naesTheme.border}`,
    background: '#fff',
    padding: '10px 12px',
    fontSize: '13px',
    color: naesTheme.text,
    marginTop: '6px',
    display: 'block',
  };

  const sectionStyle = {
    ...naesCardStyle(false),
    padding: '18px',
    maxWidth: '720px',
    width: '100%',
    margin: '0 auto',
  };

  const stackedGrid = {
    marginTop: '12px',
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: '1fr',
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'grid', gap: '16px' }}>
      <section style={{ ...naesCardStyle(true), padding: '18px', maxWidth: '720px', width: '100%', margin: '0 auto', background: 'linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%)' }}>
        {smallLabel('Activities')}
        <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 800, color: naesTheme.text }}>Log Activity</h2>
        <p style={{ marginTop: '10px', maxWidth: '620px', fontSize: '13px', lineHeight: 1.6, color: naesTheme.textMuted }}>
          Capture calls, emails, meetings, notes, and other logged interactions tied to live records.
        </p>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Activity Information')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Core interaction details
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Activity Type</div>
            <select
              value={newActivityForm.activityType ?? 'Call'}
              onChange={(e) => onChangeNewActivityField('activityType', e.target.value)}
              style={inputStyle}
            >
              {['Call', 'Email', 'Meeting', 'Note', 'Logged Interaction'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={fieldLabelStyle}>Subject</div>
            <input
              value={newActivityForm.subject ?? ''}
              onChange={(e) => onChangeNewActivityField('subject', e.target.value)}
              placeholder="Follow-up call, proposal review, site meeting..."
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>Date / Time</div>
            <input
              type="datetime-local"
              value={newActivityForm.activityDateTime ?? ''}
              onChange={(e) => onChangeNewActivityField('activityDateTime', e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>Owner</div>
            <input
              value={newActivityForm.owner ?? ''}
              onChange={(e) => onChangeNewActivityField('owner', e.target.value)}
              placeholder="Activity owner"
              style={inputStyle}
            />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Linked Records')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Related account, contact, and opportunity
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Linked Account</div>
            <select
              value={newActivityForm.accountId ?? ''}
              onChange={(e) => onChangeNewActivityField('accountId', e.target.value)}
              style={inputStyle}
            >
              <option value="">Select account</option>
              {accountOptions.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={fieldLabelStyle}>Linked Contact</div>
            <select
              value={newActivityForm.contactId ?? ''}
              onChange={(e) => onChangeNewActivityField('contactId', e.target.value)}
              style={inputStyle}
            >
              <option value="">Select contact</option>
              {contactOptions.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.fullName || contact.name || [contact.firstName, contact.lastName].filter(Boolean).join(' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div style={fieldLabelStyle}>Linked Opportunity</div>
            <select
              value={newActivityForm.opportunityId ?? ''}
              onChange={(e) => onChangeNewActivityField('opportunityId', e.target.value)}
              style={inputStyle}
            >
              <option value="">Select opportunity</option>
              {opportunityOptions.map((opportunity) => (
                <option key={opportunity.id} value={opportunity.id}>{opportunity.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Notes')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Interaction notes
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Notes</div>
            <textarea
              value={newActivityForm.notes ?? ''}
              onChange={(e) => onChangeNewActivityField('notes', e.target.value)}
              placeholder="Capture the context, discussion, next steps, and anything important."
              rows={6}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onSaveNewActivity}
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.primary}`,
                background: naesTheme.primary,
                color: '#fff',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Save Activity
            </button>

            <button
              type="button"
              onClick={onCancelNewActivity}
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.border}`,
                background: '#fff',
                color: naesTheme.textMuted,
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActivitiesOverviewPage({ activities = [], accounts = [], contacts = [], opportunities = [], onStartNewActivity, onOpenActivity }) {
  const totalActivities = activities.length;
  const calls = activities.filter((item) => item.activityType === 'Call').length;
  const emails = activities.filter((item) => item.activityType === 'Email').length;
  const meetings = activities.filter((item) => item.activityType === 'Meeting').length;

  const summaryCards = [
    { label: 'Activities', value: String(totalActivities), sub: 'logged interactions' },
    { label: 'Calls', value: String(calls), sub: 'phone activity' },
    { label: 'Emails', value: String(emails), sub: 'email activity' },
    { label: 'Meetings', value: String(meetings), sub: 'meeting activity' }
  ];

  function accountNameFor(activity) {
    const account = accounts.find((item) => item.id === activity.accountId);
    return account?.name || '—';
  }

  function contactNameFor(activity) {
    const contact = contacts.find((item) => item.id === activity.contactId);
    return contact?.fullName || contact?.name || [contact?.firstName, contact?.lastName].filter(Boolean).join(' ') || '—';
  }

  function opportunityNameFor(activity) {
    const opportunity = opportunities.find((item) => item.id === activity.opportunityId);
    return opportunity?.name || '—';
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' }}>
      <section style={{ ...naesCardStyle(true), padding: '26px 28px', background: 'linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%)' }}>
        {smallLabel('Activities')}
        <h2 style={{ margin: '8px 0 0 0', fontSize: '26px', fontWeight: 800, color: naesTheme.text }}>Activities Roll-up</h2>
        <p style={{ marginTop: '12px', maxWidth: '780px', fontSize: '14px', lineHeight: 1.65, color: naesTheme.textMuted }}>
          Central record of calls, emails, meetings, notes, and other logged touchpoints across linked CRM records.
        </p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{ ...naesCardStyle(false), padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: naesTheme.textSoft }}>
              {card.label}
            </div>
            <div style={{ marginTop: '10px', fontSize: '30px', fontWeight: 800, color: naesTheme.text }}>
              {card.value}
            </div>
            <div style={{ marginTop: '6px', fontSize: '13px', color: naesTheme.textMuted }}>
              {card.sub}
            </div>
          </div>
        ))}
      </section>

      <section style={{ ...naesCardStyle(false), padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            {smallLabel('Activity List')}
            <h3 style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 800, color: naesTheme.text }}>
              Logged interactions
            </h3>
          </div>

          <button
            type="button"
            onClick={onStartNewActivity}
            style={{
              borderRadius: '18px',
              border: `1px solid ${naesTheme.border}`,
              background: naesTheme.primarySoft,
              color: naesTheme.primaryStrong,
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Add New Activity
          </button>
        </div>

        <div style={{ marginTop: '18px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Type', 'Subject', 'Account', 'Contact', 'Opportunity', 'Owner', 'Date / Time'].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign: 'left',
                      padding: '0 12px 12px 0',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: naesTheme.textSoft,
                      borderBottom: `1px solid ${naesTheme.border}`
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr
                  key={activity.id}
                  onClick={() => onOpenActivity && onOpenActivity(activity.id)}
                  style={{ cursor: onOpenActivity ? 'pointer' : 'default' }}
                >
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', fontWeight: 700, color: naesTheme.primaryStrong }}>
                    {activity.activityType || '—'}
                  </td>
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', fontWeight: 700, color: naesTheme.text }}>
                    {activity.subject || 'Activity'}
                  </td>
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {accountNameFor(activity)}
                  </td>
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {contactNameFor(activity)}
                  </td>
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {opportunityNameFor(activity)}
                  </td>
                  <td style={{ padding: '14px 12px 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {activity.owner || '—'}
                  </td>
                  <td style={{ padding: '14px 0 14px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '13px', color: naesTheme.textMuted }}>
                    {activity.activityDateTime || '—'}
                  </td>
                </tr>
              ))}
              {!activities.length ? (
                <tr>
                  <td colSpan="7" style={{ padding: '18px 0', fontSize: '13px', color: naesTheme.textMuted }}>
                    No activities yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function buildOpportunityFormFromRecord(opportunity = {}) {
  return {
    name: String(opportunity.name || ''),
    accountId: String(opportunity.account_id || opportunity.accountId || ''),
    primaryContactId: String(opportunity.primary_contact_id || opportunity.primaryContactId || ''),
    owner: String(opportunity.owner_full_name || opportunity.owner || 'Jeff Yarbrough'),
    team: String(opportunity.owner_team_name || opportunity.team || 'NAES'),
    stage: String(opportunity.stage || '0 Prospecting'),
    forecastCategory: String(opportunity.forecast_category || opportunity.forecastCategory || 'Pipeline'),
    probability: String(opportunity.probability ?? '10'),
    expectedCloseDate: String(opportunity.expected_close_date || opportunity.expectedCloseDate || ''),
    opportunityType: String(opportunity.opportunity_type || opportunity.opportunityType || 'New Customer'),
    serviceLine: String(opportunity.service_line || opportunity.serviceLine || 'Renewables'),
    marketSegment: String(opportunity.market_segment || opportunity.marketSegment || 'DG'),
    commercialBasis: String(opportunity.commercial_basis || opportunity.commercialBasis || 'MWDC'),
    sizingValue: String(
      opportunity.total_mwdc ??
      opportunity.total_mwac ??
      opportunity.estimated_square_footage ??
      ''
    )
  };
}






function NewOpportunityPage({
  newOpportunityForm,
  accountOptions = [],
  contactOptions = [],
  onChangeNewOpportunityField,
  onSaveNewOpportunity,
  onCancelNewOpportunity
}) {
  const formColumnStyle = {
    width: '100%',
    maxWidth: '700px'
  };

  const fieldStyle = {
    width: '100%',
    borderRadius: '14px',
    border: '1px solid #D8E2D7',
    background: '#FFFFFF',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 700,
    color: '#64748b',
    marginBottom: '6px'
  };

  const metricCardStyle = {
    borderRadius: '18px',
    border: '1px solid #E5ECE5',
    background: '#FBFCFB',
    padding: '14px 16px'
  };

  const n = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getStratoSightBand = (sqft) => {
    if (sqft <= 25000) return { low: 0.09, selected: 0.11, high: 0.13 };
    if (sqft <= 100000) return { low: 0.08, selected: 0.095, high: 0.11 };
    if (sqft <= 500000) return { low: 0.06, selected: 0.075, high: 0.09 };
    if (sqft <= 2000000) return { low: 0.05, selected: 0.06, high: 0.075 };
    if (sqft <= 10000000) return { low: 0.04, selected: 0.05, high: 0.06 };
    if (sqft <= 50000000) return { low: 0.035, selected: 0.04, high: 0.05 };
    return { low: 0.03, selected: 0.035, high: 0.04 };
  };

  const getDgBand = (mwdc) => {
    if (mwdc <= 1) return { low: 21000, selected: 24000, high: 27000 };
    if (mwdc <= 3) return { low: 19000, selected: 22000, high: 25000 };
    if (mwdc <= 5) return { low: 18000, selected: 21000, high: 24000 };
    if (mwdc <= 10) return { low: 17000, selected: 19500, high: 22000 };
    if (mwdc <= 15) return { low: 16000, selected: 18000, high: 20000 };
    return { low: 15000, selected: 16500, high: 18000 };
  };

  const getUssBand = (mwac) => {
    if (mwac <= 50) return { low: 13000, selected: 16000, high: 18000 };
    if (mwac <= 100) return { low: 11000, selected: 14000, high: 16000 };
    if (mwac <= 250) return { low: 9500, selected: 12000, high: 14000 };
    if (mwac <= 500) return { low: 8500, selected: 10500, high: 12500 };
    if (mwac <= 1000) return { low: 7500, selected: 9000, high: 10500 };
    if (mwac <= 2000) return { low: 7000, selected: 8000, high: 9000 };
    return { low: 6500, selected: 7000, high: 8000 };
  };

  const serviceLine = String(newOpportunityForm.serviceLine || 'Renewables');
  const contactMode = String(newOpportunityForm.primaryContactMode || 'existing');
  const renewablesSegment = String(newOpportunityForm.renewablesSegment || 'DG');
  const renewablesBasis = renewablesSegment === 'USS' ? 'MWAC' : 'MWDC';

  const renewablesSize = n(newOpportunityForm.renewablesSize || newOpportunityForm.sizingValue || 0);
  const stratoSqft = n(newOpportunityForm.stratoSqftTotal || 0);
  const otherQty = n(newOpportunityForm.otherOmQuantity || 0);
  const otherSelectedRate = n(newOpportunityForm.otherOmSelectedRate || 0);

  const renewablesBand = renewablesSegment === 'USS'
    ? getUssBand(renewablesSize)
    : getDgBand(renewablesSize);

  const renewablesLow = renewablesSize * renewablesBand.low;
  const renewablesSelected = renewablesSize * renewablesBand.selected;
  const renewablesHigh = renewablesSize * renewablesBand.high;

  const stratoBand = getStratoSightBand(stratoSqft);
  const stratoLow = stratoSqft * stratoBand.low;
  const stratoSelected = stratoSqft * stratoBand.selected;
  const stratoHigh = stratoSqft * stratoBand.high;

  const otherLowRate = n(newOpportunityForm.otherOmLowRate || 0);
  const otherHighRate = n(newOpportunityForm.otherOmHighRate || 0);

  const otherLow = otherQty * otherLowRate;
  const otherSelected = otherQty * otherSelectedRate;
  const otherHigh = otherQty * otherHighRate;

  let totalLow = 0;
  let totalSelected = 0;
  let totalHigh = 0;
  let mathNote = 'Select a service line and enter sizing to see pricing math.';

  if (serviceLine === 'Renewables') {
    totalLow = renewablesLow;
    totalSelected = renewablesSelected;
    totalHigh = renewablesHigh;
    mathNote = `${renewablesBasis} total × auto-banded ${renewablesSegment} rate`;
  } else if (serviceLine === 'StratoSight') {
    totalLow = stratoLow;
    totalSelected = stratoSelected;
    totalHigh = stratoHigh;
    mathNote = `Total sqft × auto-banded StratoSight rate from $0.04 to $0.11+ based on scale`;
  } else if (serviceLine === 'Both') {
    totalLow = renewablesLow + stratoLow;
    totalSelected = renewablesSelected + stratoSelected;
    totalHigh = renewablesHigh + stratoHigh;
    mathNote = `Renewables subtotal + StratoSight subtotal`;
  } else if (serviceLine === 'Other O&M') {
    totalLow = otherLow;
    totalSelected = otherSelected;
    totalHigh = otherHigh;
    mathNote = `Quantity × low / selected / high rate`;
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '20px' }}>
      <section style={shellCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            {smallLabel('NAES CRM V3')}
            <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 600 }}>Add New Opportunity</h2>
            <p style={{ marginTop: '12px', maxWidth: '760px', fontSize: '14px', lineHeight: 1.6, color: '#475569' }}>
              Create the base opportunity cleanly first. The service sections below now change based on what you are selling.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onCancelNewOpportunity}
              style={{
                borderRadius: '999px',
                border: '1px solid #D8E2D7',
                background: '#FFFFFF',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSaveNewOpportunity}
              style={{
                borderRadius: '18px',
                border: '1px solid #D8E2D7',
                background: '#DDE9DF',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#2F7A55',
                cursor: 'pointer'
              }}
            >
              Save Opportunity
            </button>
          </div>
        </div>
      </section>

      <section style={shellCard}>
        {smallLabel('Core Deal Information')}
        <div style={{ ...formColumnStyle, marginTop: '16px', display: 'grid', gap: '16px' }}>
          <div>
            <div style={labelStyle}>Opportunity Name</div>
            <input style={fieldStyle} value={newOpportunityForm.name || ''} onChange={(e) => onChangeNewOpportunityField('name', e.target.value)} />
          </div>

          <div>
            <div style={labelStyle}>Linked Account</div>
            <select style={fieldStyle} value={newOpportunityForm.accountId || ''} onChange={(e) => onChangeNewOpportunityField('accountId', e.target.value)}>
              <option value="">Select account</option>
              {accountOptions.map((account) => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={labelStyle}>Primary Contact Source</div>
            <select style={fieldStyle} value={contactMode} onChange={(e) => onChangeNewOpportunityField('primaryContactMode', e.target.value)}>
              <option value="existing">Existing Contact</option>
              <option value="freeform">New Contact Name</option>
            </select>
          </div>

          {contactMode === 'existing' ? (
            <div>
              <div style={labelStyle}>Primary Contact</div>
              <select style={fieldStyle} value={newOpportunityForm.primaryContactId || ''} onChange={(e) => onChangeNewOpportunityField('primaryContactId', e.target.value)}>
                <option value="">Select contact</option>
                {contactOptions.map((contact) => (
                  <option key={contact.id} value={contact.id}>{contact.fullName || contact.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <div style={labelStyle}>Primary Contact Name</div>
              <input style={fieldStyle} value={newOpportunityForm.primaryContactName || ''} onChange={(e) => onChangeNewOpportunityField('primaryContactName', e.target.value)} placeholder="Enter customer contact name" />
            </div>
          )}

          <div>
            <div style={labelStyle}>Opportunity Type</div>
            <select style={fieldStyle} value={newOpportunityForm.opportunityType || 'New Customer'} onChange={(e) => onChangeNewOpportunityField('opportunityType', e.target.value)}>
              <option>New Customer</option>
              <option>Renewal</option>
              <option>Expansion</option>
              <option>Cross-Sell</option>
              <option>Strategic</option>
            </select>
          </div>

          <div>
            <div style={labelStyle}>NAES Opportunity Owner</div>
            <input style={fieldStyle} value={newOpportunityForm.owner || ''} onChange={(e) => onChangeNewOpportunityField('owner', e.target.value)} />
          </div>

          <div>
            <div style={labelStyle}>NAES Team</div>
            <input style={fieldStyle} value={newOpportunityForm.team || ''} onChange={(e) => onChangeNewOpportunityField('team', e.target.value)} />
          </div>
        </div>
      </section>

      <section style={shellCard}>
        {smallLabel('Service Classification')}
        <div style={{ ...formColumnStyle, marginTop: '16px', display: 'grid', gap: '16px' }}>
          <div>
            <div style={labelStyle}>Service Line</div>
            <select style={fieldStyle} value={serviceLine} onChange={(e) => onChangeNewOpportunityField('serviceLine', e.target.value)}>
              <option>Renewables</option>
              <option>StratoSight</option>
              <option>Both</option>
              <option>Other O&amp;M</option>
            </select>
          </div>
        </div>
      </section>

      {(serviceLine === 'Renewables' || serviceLine === 'Both') && (
        <section style={shellCard}>
          {smallLabel(serviceLine === 'Both' ? 'Renewables Component' : 'Renewables Intake')}
          <div style={{ ...formColumnStyle, marginTop: '16px', display: 'grid', gap: '16px' }}>
            <div>
              <div style={labelStyle}>Renewables Segment</div>
              <select style={fieldStyle} value={renewablesSegment} onChange={(e) => onChangeNewOpportunityField('renewablesSegment', e.target.value)}>
                <option>DG</option>
                <option>USS</option>
              </select>
            </div>

            <div>
              <div style={labelStyle}>{renewablesBasis} Total</div>
              <input style={fieldStyle} value={newOpportunityForm.renewablesSize || newOpportunityForm.sizingValue || ''} onChange={(e) => onChangeNewOpportunityField('renewablesSize', e.target.value)} />
            </div>

            <div>
              <div style={labelStyle}>Site Count</div>
              <input style={fieldStyle} value={newOpportunityForm.renewablesSiteCount || ''} onChange={(e) => onChangeNewOpportunityField('renewablesSiteCount', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
              <div style={metricCardStyle}>
                <div style={labelStyle}>Low</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(renewablesLow)}</div>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>{formatCurrency(renewablesBand.low)}/{renewablesBasis}</div>
              </div>
              <div style={metricCardStyle}>
                <div style={labelStyle}>Selected</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(renewablesSelected)}</div>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>{formatCurrency(renewablesBand.selected)}/{renewablesBasis}</div>
              </div>
              <div style={metricCardStyle}>
                <div style={labelStyle}>High</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(renewablesHigh)}</div>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>{formatCurrency(renewablesBand.high)}/{renewablesBasis}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {(serviceLine === 'StratoSight' || serviceLine === 'Both') && (
        <section style={shellCard}>
          {smallLabel(serviceLine === 'Both' ? 'StratoSight Component' : 'StratoSight Intake')}
          <div style={{ ...formColumnStyle, marginTop: '16px', display: 'grid', gap: '16px' }}>
            <div>
              <div style={labelStyle}>Number of Buildings</div>
              <input style={fieldStyle} value={newOpportunityForm.stratoBuildingCount || ''} onChange={(e) => onChangeNewOpportunityField('stratoBuildingCount', e.target.value)} />
            </div>

            <div>
              <div style={labelStyle}>Site Count</div>
              <input style={fieldStyle} value={newOpportunityForm.stratoSiteCount || ''} onChange={(e) => onChangeNewOpportunityField('stratoSiteCount', e.target.value)} />
            </div>

            <div>
              <div style={labelStyle}>Total Square Footage</div>
              <input style={fieldStyle} value={newOpportunityForm.stratoSqftTotal || ''} onChange={(e) => onChangeNewOpportunityField('stratoSqftTotal', e.target.value)} />
            </div>

            <div style={metricCardStyle}>
              <div style={labelStyle}>Auto-Banded Pricing Note</div>
              <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>
                Pricing is automatically banded by total square footage. Smaller footprints trend toward the upper end, larger footprints trend toward the lower end.
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
              <div style={metricCardStyle}>
                <div style={labelStyle}>Low</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(stratoLow)}</div>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>${stratoBand.low.toFixed(3)}/sqft</div>
              </div>
              <div style={metricCardStyle}>
                <div style={labelStyle}>Selected</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(stratoSelected)}</div>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>${stratoBand.selected.toFixed(3)}/sqft</div>
              </div>
              <div style={metricCardStyle}>
                <div style={labelStyle}>High</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(stratoHigh)}</div>
                <div style={{ marginTop: '6px', fontSize: '12px', color: '#64748b' }}>${stratoBand.high.toFixed(3)}/sqft</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {serviceLine === 'Other O&M' && (
        <section style={shellCard}>
          {smallLabel('Other O&M Intake')}
          <div style={{ ...formColumnStyle, marginTop: '16px', display: 'grid', gap: '16px' }}>
            <div>
              <div style={labelStyle}>Service Description</div>
              <input style={fieldStyle} value={newOpportunityForm.otherOmDescription || ''} onChange={(e) => onChangeNewOpportunityField('otherOmDescription', e.target.value)} />
            </div>

            <div>
              <div style={labelStyle}>Quantity</div>
              <input style={fieldStyle} value={newOpportunityForm.otherOmQuantity || ''} onChange={(e) => onChangeNewOpportunityField('otherOmQuantity', e.target.value)} />
            </div>

            <div>
              <div style={labelStyle}>Low Rate</div>
              <input style={fieldStyle} value={newOpportunityForm.otherOmLowRate || ''} onChange={(e) => onChangeNewOpportunityField('otherOmLowRate', e.target.value)} />
            </div>

            <div>
              <div style={labelStyle}>Selected Rate</div>
              <input style={fieldStyle} value={newOpportunityForm.otherOmSelectedRate || ''} onChange={(e) => onChangeNewOpportunityField('otherOmSelectedRate', e.target.value)} />
            </div>

            <div>
              <div style={labelStyle}>High Rate</div>
              <input style={fieldStyle} value={newOpportunityForm.otherOmHighRate || ''} onChange={(e) => onChangeNewOpportunityField('otherOmHighRate', e.target.value)} />
            </div>

            <div>
              <div style={labelStyle}>Scope Notes</div>
              <textarea style={{ ...fieldStyle, minHeight: '96px', resize: 'vertical' }} value={newOpportunityForm.otherOmNotes || ''} onChange={(e) => onChangeNewOpportunityField('otherOmNotes', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
              <div style={metricCardStyle}>
                <div style={labelStyle}>Low</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(otherLow)}</div>
              </div>
              <div style={metricCardStyle}>
                <div style={labelStyle}>Selected</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(otherSelected)}</div>
              </div>
              <div style={metricCardStyle}>
                <div style={labelStyle}>High</div>
                <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(otherHigh)}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section style={shellCard}>
        {smallLabel('Commercial Math Summary')}
        <div style={{ ...formColumnStyle, marginTop: '16px', display: 'grid', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '12px' }}>
            <div style={metricCardStyle}>
              <div style={labelStyle}>Low</div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(totalLow)}</div>
            </div>
            <div style={metricCardStyle}>
              <div style={labelStyle}>Selected</div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(totalSelected)}</div>
            </div>
            <div style={metricCardStyle}>
              <div style={labelStyle}>High</div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>{formatCurrency(totalHigh)}</div>
            </div>
          </div>

          <div style={metricCardStyle}>
            <div style={labelStyle}>How it Calculates</div>
            <div style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6 }}>{mathNote}</div>
          </div>
        </div>
      </section>

      <section style={shellCard}>
        {smallLabel('Forecast Setup')}
        <div style={{ ...formColumnStyle, marginTop: '16px', display: 'grid', gap: '16px' }}>
          <div>
            <div style={labelStyle}>Stage</div>
            <select style={fieldStyle} value={newOpportunityForm.stage || '0 Prospecting'} onChange={(e) => onChangeNewOpportunityField('stage', e.target.value)}>
              {workflowStages.map((stage) => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={labelStyle}>Forecast Category</div>
            <select style={fieldStyle} value={newOpportunityForm.forecastCategory || 'Pipeline'} onChange={(e) => onChangeNewOpportunityField('forecastCategory', e.target.value)}>
              <option>Pipeline</option>
              <option>Best Case</option>
              <option>Commit</option>
              <option>Closed</option>
              <option>Omitted</option>
            </select>
          </div>

          <div>
            <div style={labelStyle}>Probability</div>
            <input style={fieldStyle} value={newOpportunityForm.probability || ''} onChange={(e) => onChangeNewOpportunityField('probability', e.target.value)} />
          </div>

          <div>
            <div style={labelStyle}>Expected Close Date</div>
            <input type="date" style={fieldStyle} value={newOpportunityForm.expectedCloseDate || ''} onChange={(e) => onChangeNewOpportunityField('expectedCloseDate', e.target.value)} />
          </div>
        </div>
      </section>

      <section style={shellCard}>
        
        <div style={{ ...formColumnStyle, marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onCancelNewOpportunity}
            style={{
              borderRadius: '999px',
              border: '1px solid #D8E2D7',
              background: '#FFFFFF',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSaveNewOpportunity}
            style={{
              borderRadius: '18px',
              border: '1px solid #D8E2D7',
              background: '#DDE9DF',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 600,
              color: '#2F7A55',
              cursor: 'pointer'
            }}
          >
            Save Opportunity
          </button>
        </div>
      </section>
    </div>
  );
}

function OpportunitiesOverviewPage({ onOpenOpportunity, onStartNewOpportunity, opportunities = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [forecastFilter, setForecastFilter] = useState('All');
  const [sortOption, setSortOption] = useState('Close Date');

  const allOpportunityCards = Array.isArray(opportunities) ? opportunities : [];

  const filteredOpportunityCards = allOpportunityCards
    .filter((item) => {
      const q = String(searchTerm || '').trim().toLowerCase();
      if (!q) return true;

      const haystack = [
        item?.name,
        item?.account_name,
        item?.accountName,
        item?.owner_full_name,
        item?.owner,
        item?.service_line,
        item?.market_segment,
        item?.stage,
        item?.forecast_category
      ]
        .map((value) => String(value || '').toLowerCase())
        .join(' ');

      return haystack.includes(q);
    })
    .filter((item) => {
      if (forecastFilter === 'All') return true;
      return String(item?.forecast_category || '').trim() === forecastFilter;
    })
    .sort((a, b) => {
      if (sortOption === 'Close Date') {
        const aTime = new Date(a?.expected_close_date || '9999-12-31').getTime();
        const bTime = new Date(b?.expected_close_date || '9999-12-31').getTime();
        return aTime - bTime;
      }

      if (sortOption === 'Opportunity Name') {
        return String(a?.name || '').localeCompare(String(b?.name || ''));
      }

      if (sortOption === 'Revenue') {
        const aValue = Number(a?.calculated_revenue ?? a?.amount_total ?? a?.calc_year1_total ?? a?.amount_estimated ?? 0);
        const bValue = Number(b?.calculated_revenue ?? b?.amount_total ?? b?.calc_year1_total ?? b?.amount_estimated ?? 0);
        return bValue - aValue;
      }

      return 0;
    });

  const openPipelineValue = filteredOpportunityCards.reduce((sum, item) => {
    const value = Number(
      item?.calculated_revenue ??
      item?.amount_total ??
      item?.calc_year1_total ??
      item?.amount_estimated ??
      0
    );
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  const weightedPipelineValue = filteredOpportunityCards.reduce((sum, item) => {
    const explicitWeighted = Number(item?.weighted_revenue);
    if (Number.isFinite(explicitWeighted)) {
      return sum + explicitWeighted;
    }

    const value = Number(
      item?.calculated_revenue ??
      item?.amount_total ??
      item?.calc_year1_total ??
      item?.amount_estimated ??
      0
    );
    const probability = Number(item?.probability ?? 0) / 100;
    return sum + ((Number.isFinite(value) ? value : 0) * (Number.isFinite(probability) ? probability : 0));
  }, 0);

  const commitCount = filteredOpportunityCards.filter((item) => String(item?.forecast_category || '') === 'Commit').length;
  const atRiskCount = filteredOpportunityCards.filter((item) => {
    const flag = String(item?.staleness_flag || '').toLowerCase();
    return flag.includes('risk') || flag.includes('overdue') || flag.includes('stale');
  }).length;

  const summaryCards = [
    { label: 'Open Pipeline', value: formatCurrency(openPipelineValue), sub: `${filteredOpportunityCards.length} visible opportunities` },
    { label: 'Weighted Pipeline', value: formatCurrency(weightedPipelineValue), sub: 'forecast-adjusted' },
    { label: 'Commit Opportunities', value: String(commitCount), sub: 'forecast category commit' },
    { label: 'At-Risk Deals', value: String(atRiskCount), sub: 'stale or overdue follow-up' }
  ];

  const stageRollupMap = new Map([
    ['0 Prospecting', 0],
    ['1 Qualified', 0],
    ['2 Discovery', 0],
    ['3 Solution Fit', 0],
    ['4 Commercials', 0],
    ['5 Security Legal', 0],
    ['6 Commit', 0]
  ]);

  filteredOpportunityCards.forEach((item) => {
    const stage = String(item?.stage || '0 Prospecting');
    if (!stageRollupMap.has(stage)) stageRollupMap.set(stage, 0);
    stageRollupMap.set(stage, (stageRollupMap.get(stage) || 0) + 1);
  });

  const stageRollup = Array.from(stageRollupMap.entries()).map(([stage, count]) => [stage.replace(/^\d+\s*/, ''), count]);

  const controlStyle = {
    borderRadius: '18px',
    border: '1px solid #D8E2D7',
    background: '#FBFCFB',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#475569',
    minHeight: '44px',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' }}>
      <section style={shellCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            {smallLabel('NAES CRM V3')}
            <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 600 }}>Opportunities</h2>
            <p style={{ marginTop: '12px', maxWidth: '760px', fontSize: '14px', lineHeight: 1.6, color: '#475569' }}>
              Full roll-up view with forecast, pipeline, and account-fed opportunity visibility.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={onStartNewOpportunity}
              style={{
                borderRadius: '18px',
                border: '1px solid #D8E2D7',
                background: '#DDE9DF',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#2F7A55',
                cursor: 'pointer'
              }}
            >
              Add New Opportunity
            </button>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search opportunities"
              style={{ ...controlStyle, width: '220px' }}
            />

            <select
              value={forecastFilter}
              onChange={(e) => setForecastFilter(e.target.value)}
              style={controlStyle}
            >
              {['All', 'Pipeline', 'Best Case', 'BestCase', 'Commit', 'Closed', 'Closed Won', 'Closed Lost'].map((option) => (
                <option key={option} value={option}>{`Filter: ${option}`}</option>
              ))}
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={controlStyle}
            >
              {['Close Date', 'Opportunity Name', 'Revenue'].map((option) => (
                <option key={option} value={option}>{`Sort: ${option}`}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{ borderRadius: '24px', background: '#FFFFFF', border: '1px solid #E5ECE5', boxShadow: '0 10px 24px rgba(31,41,55,0.05)', padding: '18px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>{card.label}</div>
            <div style={{ marginTop: '10px', fontSize: '28px', fontWeight: 700, color: '#111827' }}>{card.value}</div>
            <div style={{ marginTop: '6px', fontSize: '13px', color: '#64748b' }}>{card.sub}</div>
          </div>
        ))}
      </section>

      <section style={shellCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            {smallLabel('Forecast and Stage Summary')}
            <h3 style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 600 }}>Stage roll-up</h3>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Pipeline', 'BestCase', 'Commit', 'Closed'].map((chip) => (
              <span key={chip} style={{ borderRadius: '999px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '6px 12px', fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                {chip}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '18px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
          {stageRollup.map(([stage, count]) => (
            <div key={stage} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '14px 16px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#64748b' }}>{stage}</div>
              <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: 700, color: '#111827' }}>{count}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={shellCard}>
        {smallLabel('Opportunity List')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 600 }}>Compact, scannable opportunities</h3>

        <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
          {filteredOpportunityCards.length ? filteredOpportunityCards.map((opportunity) => (
            <OpportunitySummaryRow
              key={opportunity.id}
              opportunity={opportunity}
              onOpenOpportunity={onOpenOpportunity}
            />
          )) : (
            <div style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '16px', fontSize: '14px', color: '#64748b' }}>
              No opportunities match the current search, filter, and sort settings.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}




function NewAccountPage({ newAccountForm = {}, onChangeNewAccountField, onSaveNewAccount, onCancelNewAccount }) {
  const serviceOptions = [
    'Renewables O&M',
    'StratoSight',
    'Both',
    'Other O&M / Custom Services'
  ];

  const currentServices = String(newAccountForm.interestedServices || '').trim();
  const serviceValues = currentServices
    ? currentServices.split(',').map((item) => item.trim()).filter(Boolean)
    : [];

  const fieldLabelStyle = {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: naesTheme.textSoft,
  };

  const inputStyle = {
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box',
    borderRadius: '12px',
    border: `1px solid ${naesTheme.border}`,
    background: '#fff',
    padding: '10px 12px',
    fontSize: '13px',
    color: naesTheme.text,
    marginTop: '6px',
    display: 'block',
  };

  const sectionStyle = {
    ...naesCardStyle(false),
    padding: '18px',
    maxWidth: '720px',
    width: '100%',
    margin: '0 auto',
  };

  const stackedGrid = {
    marginTop: '12px',
    display: 'grid',
    gap: '12px',
    gridTemplateColumns: '1fr',
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'grid', gap: '16px' }}>
      <section style={{ ...naesCardStyle(true), padding: '18px', maxWidth: '720px', width: '100%', margin: '0 auto', background: 'linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%)' }}>
        {smallLabel('Accounts')}
        <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 800, color: naesTheme.text }}>New Account</h2>
        <p style={{ marginTop: '10px', maxWidth: '620px', fontSize: '13px', lineHeight: 1.6, color: naesTheme.textMuted }}>
          Create a company profile. Keep this page focused on who the company is, how to reach them, and what services they are interested in.
        </p>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Company Information')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Core account identity
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Company Name</div>
            <input
              value={newAccountForm.name ?? ''}
              onChange={(e) => onChangeNewAccountField('name', e.target.value)}
              placeholder="Ashley Furniture Industries"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>Legal / Business Name</div>
            <input
              value={newAccountForm.legalBusinessName ?? ''}
              onChange={(e) => onChangeNewAccountField('legalBusinessName', e.target.value)}
              placeholder="Ashley Furniture Industries, LLC"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>Industry / Business Type</div>
            <input
              value={newAccountForm.businessType ?? ''}
              onChange={(e) => onChangeNewAccountField('businessType', e.target.value)}
              placeholder="Manufacturing, logistics, utility, commercial solar..."
              style={inputStyle}
            />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Company Contact Information')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          General company contact points
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Website</div>
            <input
              value={newAccountForm.website ?? ''}
              onChange={(e) => onChangeNewAccountField('website', e.target.value)}
              placeholder="https://company.com"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>LinkedIn</div>
            <input
              value={newAccountForm.linkedin ?? ''}
              onChange={(e) => onChangeNewAccountField('linkedin', e.target.value)}
              placeholder="https://linkedin.com/company/..."
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>Main Phone</div>
            <input
              value={newAccountForm.mainPhone ?? ''}
              onChange={(e) => onChangeNewAccountField('mainPhone', e.target.value)}
              placeholder="(555) 555-5555"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>General Email</div>
            <input
              value={newAccountForm.generalEmail ?? ''}
              onChange={(e) => onChangeNewAccountField('generalEmail', e.target.value)}
              placeholder="info@company.com"
              style={inputStyle}
            />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Address')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Main company address
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Main Address</div>
            <input
              value={newAccountForm.mainAddress ?? ''}
              onChange={(e) => onChangeNewAccountField('mainAddress', e.target.value)}
              placeholder="123 Main Street"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>City</div>
            <input
              value={newAccountForm.city ?? ''}
              onChange={(e) => onChangeNewAccountField('city', e.target.value)}
              placeholder="Phoenix"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>State</div>
            <input
              value={newAccountForm.state ?? ''}
              onChange={(e) => onChangeNewAccountField('state', e.target.value)}
              placeholder="AZ"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>ZIP</div>
            <input
              value={newAccountForm.zip ?? ''}
              onChange={(e) => onChangeNewAccountField('zip', e.target.value)}
              placeholder="85004"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>Country</div>
            <input
              value={newAccountForm.country ?? ''}
              onChange={(e) => onChangeNewAccountField('country', e.target.value)}
              placeholder="United States"
              style={inputStyle}
            />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Service Interest')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Interest tags and simple footprint
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Interested Services</div>
            <input
              value={newAccountForm.interestedServices ?? ''}
              onChange={(e) => onChangeNewAccountField('interestedServices', e.target.value)}
              placeholder="Renewables O&M, StratoSight..."
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {serviceOptions.map((option) => {
              const selected = serviceValues.some((item) => item.toLowerCase() === option.toLowerCase());
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const next = selected
                      ? serviceValues.filter((item) => item.toLowerCase() !== option.toLowerCase())
                      : [...serviceValues, option];
                    onChangeNewAccountField('interestedServices', next.join(', '));
                  }}
                  style={{
                    borderRadius: '999px',
                    border: `1px solid ${selected ? naesTheme.primary : naesTheme.border}`,
                    background: selected ? naesTheme.primarySoft : '#fff',
                    color: selected ? naesTheme.primaryStrong : naesTheme.textMuted,
                    padding: '7px 12px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div>
            <div style={fieldLabelStyle}>Primary Account Owner</div>
            <input
              value={newAccountForm.primaryAccountOwner ?? ''}
              onChange={(e) => onChangeNewAccountField('primaryAccountOwner', e.target.value)}
              placeholder="Assigned owner"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>General Footprint / Region</div>
            <input
              value={newAccountForm.generalFootprintRegion ?? ''}
              onChange={(e) => onChangeNewAccountField('generalFootprintRegion', e.target.value)}
              placeholder="Southwest, national, multi-state..."
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>Total MW</div>
            <input
              value={newAccountForm.totalMw ?? ''}
              onChange={(e) => onChangeNewAccountField('totalMw', e.target.value)}
              placeholder="Only if renewables is relevant"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>Portfolio Type</div>
            <input
              value={newAccountForm.portfolioType ?? ''}
              onChange={(e) => onChangeNewAccountField('portfolioType', e.target.value)}
              placeholder="DG, USS, mixed..."
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>Estimated Building Count</div>
            <input
              value={newAccountForm.estimatedBuildingCount ?? ''}
              onChange={(e) => onChangeNewAccountField('estimatedBuildingCount', e.target.value)}
              placeholder="Only if StratoSight is relevant"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>Estimated Square Footage</div>
            <input
              value={newAccountForm.estimatedSquareFootage ?? ''}
              onChange={(e) => onChangeNewAccountField('estimatedSquareFootage', e.target.value)}
              placeholder="Only if StratoSight is relevant"
              style={inputStyle}
            />
          </div>

          <div>
            <div style={fieldLabelStyle}>General Site Type</div>
            <input
              value={newAccountForm.generalSiteType ?? ''}
              onChange={(e) => onChangeNewAccountField('generalSiteType', e.target.value)}
              placeholder="Warehouse, rooftop, campus, utility site..."
              style={inputStyle}
            />
          </div>
        </div>
      </section>

      <section style={sectionStyle}>
        {smallLabel('Notes')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Internal notes
        </h3>

        <div style={stackedGrid}>
          <div>
            <div style={fieldLabelStyle}>Notes</div>
            <textarea
              value={newAccountForm.notes ?? ''}
              onChange={(e) => onChangeNewAccountField('notes', e.target.value)}
              placeholder="Anything useful about the company, relationship, timing, or service interest"
              rows={5}
              style={{
                ...inputStyle,
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onSaveNewAccount}
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.primary}`,
                background: naesTheme.primary,
                color: '#fff',
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Save Account
            </button>

            <button
              type="button"
              onClick={onCancelNewAccount}
              style={{
                borderRadius: '14px',
                border: `1px solid ${naesTheme.border}`,
                background: '#fff',
                color: naesTheme.textMuted,
                padding: '10px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
function AccountsOverviewPage({ accounts = [], onOpenAccount, onStartNewAccount }) {
  const totalAccounts = accounts.length;
  const renewablesInterested = accounts.filter((item) => String(item.interestedServices || '').toLowerCase().includes('renewables')).length;
  const websitesCaptured = accounts.filter((item) => String(item.website || '').trim()).length;
  const mwTracked = accounts.reduce((acc, item) => acc + Number(item.totalMw || 0), 0);

  const summaryCards = [
    { label: 'Accounts', value: String(totalAccounts), sub: 'company records' },
    { label: 'Renewables Interest', value: String(renewablesInterested), sub: 'accounts with renewables interest' },
    { label: 'Websites Captured', value: String(websitesCaptured), sub: 'account website recorded' },
    { label: 'Total MW', value: String(mwTracked || 0), sub: 'only where relevant' }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' }}>
      <section style={{ ...naesCardStyle(true), padding: '26px 28px', background: 'linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%)' }}>
        {smallLabel('Accounts')}
        <h2 style={{ margin: '8px 0 0 0', fontSize: '26px', fontWeight: 800, color: naesTheme.text }}>Account Roll-up</h2>
        <p style={{ marginTop: '12px', maxWidth: '780px', fontSize: '14px', lineHeight: 1.65, color: naesTheme.textMuted }}>
          Clean company-level records. This is the parent layer for contacts and future opportunities, not the place for commercial deal detail.
        </p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={{ ...naesCardStyle(false), padding: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: naesTheme.textSoft }}>
              {card.label}
            </div>
            <div style={{ marginTop: '10px', fontSize: '30px', fontWeight: 800, color: naesTheme.text }}>
              {card.value}
            </div>
            <div style={{ marginTop: '6px', fontSize: '13px', color: naesTheme.textMuted }}>
              {card.sub}
            </div>
          </div>
        ))}
      </section>

      <section style={{ ...naesCardStyle(false), padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div>
            {smallLabel('Company List')}
            <h3 style={{ margin: '8px 0 0 0', fontSize: '20px', fontWeight: 800, color: naesTheme.text }}>
              Main page, click account for detail
            </h3>
          </div>

          <button
            type="button"
            onClick={onStartNewAccount}
            style={{
              borderRadius: '18px',
              border: `1px solid ${naesTheme.border}`,
              background: naesTheme.primarySoft,
              color: naesTheme.primaryStrong,
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Add New Account
          </button>
        </div>

        <div style={{ marginTop: '18px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['Company', 'Industry', 'Interested Services', 'Owner', 'Main Phone', 'General Email', 'City / State', 'Website'].map((head) => (
                  <th
                    key={head}
                    style={{
                      textAlign: 'left',
                      padding: '0 12px 12px 0',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: naesTheme.textSoft,
                      borderBottom: `1px solid ${naesTheme.border}`
                    }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr
                  key={account.id}
                  onClick={() => onOpenAccount(account.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}` }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: naesTheme.text }}>{account.name}</div>
                  </td>
                  <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                    {account.businessType || '—'}
                  </td>
                  <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                    {account.interestedServices || '—'}
                  </td>
                  <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                    {account.primaryAccountOwner || '—'}
                  </td>
                  <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                    {account.mainPhone || '—'}
                  </td>
                  <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                    {account.generalEmail || '—'}
                  </td>
                  <td style={{ padding: '16px 12px 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.textMuted }}>
                    {[account.city, account.state].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td style={{ padding: '16px 0 16px 0', borderBottom: `1px solid ${naesTheme.border}`, fontSize: '14px', color: naesTheme.primaryStrong }}>
                    {account.website || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}


function AccountDetailPage({ accountId, accounts = accountRecords, contacts = contactRecords, opportunities = [], historyEntries = [], onBackToAccounts, onOpenOpportunity, onEditAccount }) {
  const account = getAccountById(accountId, accounts);
  const relatedContacts = getContactsForAccount(accountId, contacts);
  const relatedOpps = getOpportunitiesForAccount(accountId, opportunities, accounts);

  if (!account) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'grid', gap: '20px' }}>
        <section style={{ ...naesCardStyle(false), padding: '20px' }}>
          {smallLabel('Account Detail')}
          <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 800, color: naesTheme.text }}>Account not found</h2>
          <p style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.6, color: naesTheme.textMuted }}>
            The requested account record does not exist in the current account list.
          </p>
          <button type="button" onClick={onBackToAccounts} style={{ ...buttonStyle(true), marginTop: '16px' }}>
            Back to Accounts
          </button>
        </section>
      </div>
    );
  }

  const statCards = [
    { label: 'Related Contacts', value: String(relatedContacts.length), sub: 'linked people' },
    { label: 'Related Opportunities', value: String(relatedOpps.length), sub: 'linked deals' },
    { label: 'Interested Services', value: account.interestedServices || '—', sub: 'service interest' },
    { label: 'Total MW', value: account.totalMw || '—', sub: 'only if relevant' }
  ];

  const detailCard = {
    ...naesCardStyle(false),
    padding: '18px',
  };

  const fieldLabel = {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: naesTheme.textSoft,
  };

  const fieldBox = {
    marginTop: '6px',
    borderRadius: '12px',
    border: `1px solid ${naesTheme.border}`,
    background: '#fff',
    padding: '10px 12px',
    fontSize: '13px',
    color: naesTheme.text,
    minHeight: '42px',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'grid', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '-8px' }}>
        <button type="button" onClick={onBackToAccounts} style={{ ...buttonStyle(true) }}>
          Back to Accounts
        </button>

        <button type="button" onClick={onEditAccount} style={{ ...buttonStyle(true) }}>
          Edit Account
        </button>
      </div>

      <section style={{ ...naesCardStyle(true), padding: '20px', background: 'linear-gradient(180deg, #ffffff 0%, #f7fbf8 100%)' }}>
        {smallLabel('Account Detail')}
        <h2 style={{ margin: '12px 0 0 0', fontSize: '24px', fontWeight: 800, color: naesTheme.text }}>
          {account.name || 'Account'}
        </h2>
        <p style={{ marginTop: '10px', maxWidth: '760px', fontSize: '14px', lineHeight: 1.6, color: naesTheme.textMuted }}>
          Saved company profile with service interest, company information, and connected CRM records.
        </p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {statCards.map((card) => (
          <div key={card.label} style={{ ...naesCardStyle(false), padding: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: naesTheme.textSoft }}>
              {card.label}
            </div>
            <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
              {card.value}
            </div>
            <div style={{ marginTop: '6px', fontSize: '12px', color: naesTheme.textMuted }}>
              {card.sub}
            </div>
          </div>
        ))}
      </section>

      <section style={detailCard}>
        {smallLabel('Company Profile')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Saved account information
        </h3>

        <div style={{ marginTop: '14px', display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {[
            ['Company Name', account.name],
            ['Legal / Business Name', account.legalBusinessName],
            ['Industry / Business Type', account.businessType],
            ['Website', account.website],
            ['LinkedIn', account.linkedin],
            ['Main Phone', account.mainPhone],
            ['General Email', account.generalEmail],
            ['Main Address', account.mainAddress],
            ['City', account.city],
            ['State', account.state],
            ['ZIP', account.zip],
            ['Country', account.country],
            ['Primary Account Owner', account.primaryAccountOwner],
            ['Interested Services', account.interestedServices],
            ['General Footprint / Region', account.generalFootprintRegion],
            ['Total MW', account.totalMw],
            ['Portfolio Type', account.portfolioType],
            ['Estimated Building Count', account.estimatedBuildingCount],
            ['Estimated Square Footage', account.estimatedSquareFootage],
            ['General Site Type', account.generalSiteType],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={fieldLabel}>{label}</div>
              <div style={fieldBox}>{value || '—'}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={detailCard}>
        {smallLabel('Notes')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Internal account notes
        </h3>
        <div style={{ ...fieldBox, marginTop: '14px', minHeight: '84px', alignItems: 'flex-start' }}>
          {account.notes || '—'}
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <div style={detailCard}>
          {smallLabel('Related Contacts')}
          <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
            Contacts tied to this account
          </h3>

          <div style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
            {relatedContacts.length ? relatedContacts.map((contact) => (
              <div key={contact.id} style={{ borderRadius: '12px', border: `1px solid ${naesTheme.border}`, background: '#fff', padding: '12px 14px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: naesTheme.text }}>
                  {contact.fullName || [contact.firstName, contact.lastName].filter(Boolean).join(' ') || 'Contact'}
                </div>
                <div style={{ marginTop: '4px', fontSize: '12px', color: naesTheme.textMuted }}>
                  {contact.title || 'No title'} • {contact.email || 'No email'}
                </div>
              </div>
            )) : (
              <div style={{ borderRadius: '12px', border: `1px solid ${naesTheme.border}`, background: '#fff', padding: '12px 14px', fontSize: '13px', color: naesTheme.textMuted }}>
                No contacts linked yet.
              </div>
            )}
          </div>
        </div>

        <div style={detailCard}>
          {smallLabel('Related Opportunities')}
          <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
            Open or linked deals
          </h3>

          <div style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
            {relatedOpps.length ? relatedOpps.map((opportunity) => (
              <button
                key={opportunity.id}
                type="button"
                onClick={() => onOpenOpportunity(opportunity.id)}
                style={{
                  textAlign: 'left',
                  borderRadius: '12px',
                  border: `1px solid ${naesTheme.border}`,
                  background: '#fff',
                  padding: '12px 14px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 700, color: naesTheme.text }}>
                  {opportunity.name || 'Opportunity'}
                </div>
                <div style={{ marginTop: '4px', fontSize: '12px', color: naesTheme.textMuted }}>
                  {opportunity.stage || 'No stage'} • {opportunity.forecast_category || 'No forecast'}
                </div>
              </button>
            )) : (
              <div style={{ borderRadius: '12px', border: `1px solid ${naesTheme.border}`, background: '#fff', padding: '12px 14px', fontSize: '13px', color: naesTheme.textMuted }}>
                No opportunities linked yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
        <div style={detailCard}>
          {smallLabel('Related Tasks')}
          <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
            Tasks
          </h3>
          <div style={{ borderRadius: '12px', border: `1px solid ${naesTheme.border}`, background: '#fff', padding: '12px 14px', marginTop: '14px', fontSize: '13px', color: naesTheme.textMuted }}>
            Tasks section coming next.
          </div>
        </div>

        <div style={detailCard}>
          {smallLabel('Related Activities')}
          <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
            Activities
          </h3>
          <div style={{ borderRadius: '12px', border: `1px solid ${naesTheme.border}`, background: '#fff', padding: '12px 14px', marginTop: '14px', fontSize: '13px', color: naesTheme.textMuted }}>
            Activities section coming next.
          </div>
        </div>
      </section>

      <section style={detailCard}>
        {smallLabel('Edit History')}
        <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 800, color: naesTheme.text }}>
          Account change log
        </h3>

        <div style={{ marginTop: '14px', display: 'grid', gap: '10px' }}>
          {historyEntries.length ? historyEntries.map((entry) => (
            <div key={entry.id} style={{ borderRadius: '12px', border: `1px solid ${naesTheme.border}`, background: '#fff', padding: '12px 14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: naesTheme.text }}>
                {entry.action}
              </div>
              <div style={{ marginTop: '4px', fontSize: '12px', color: naesTheme.textMuted }}>
                {entry.at} • {entry.user}
              </div>
            </div>
          )) : (
            <div style={{ borderRadius: '12px', border: `1px solid ${naesTheme.border}`, background: '#fff', padding: '12px 14px', fontSize: '13px', color: naesTheme.textMuted }}>
              No edit history yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


function computeOpportunityCommercial({
  serviceLine = 'Renewables',
  renewablesPortfolioType = 'DG',
  renewablesBasis = 'MWDC',
  renewablesSize = 0,
  stratoSqft = 0,
  otherDescription = '',
  otherBasis = 'Fixed Total',
  otherQuantity = 0,
  otherTarget = 0,
  otherLow = 0,
  otherHigh = 0
} = {}) {
  const n = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const line = String(serviceLine || 'Renewables').trim();
  const portfolio = String(renewablesPortfolioType || 'DG').trim();
  const basis = String(renewablesBasis || 'MWDC').trim();

  if (line === 'Renewables' || line === 'Both') {
    const size = n(renewablesSize);
    const isUSS = portfolio.toUpperCase() === 'USS';

    const lowRate = isUSS ? (basis === 'MWAC' ? 10 : 8) : (basis === 'MWAC' ? 17 : 14);
    const targetRate = isUSS ? (basis === 'MWAC' ? 13 : 12) : (basis === 'MWAC' ? 22 : 18);
    const highRate = isUSS ? (basis === 'MWAC' ? 17 : 16) : (basis === 'MWAC' ? 28 : 23);

    const renewablesLow = size * lowRate * 1000;
    const renewablesTarget = size * targetRate * 1000;
    const renewablesHigh = size * highRate * 1000;

    if (line === 'Renewables') {
      return {
        pricingBasis: `${portfolio} ${basis} annual`,
        low: renewablesLow,
        target: renewablesTarget,
        high: renewablesHigh,
        weighted: renewablesTarget * 0.6,
        cts: 63,
        earnings: 37,
        lineItems: [
          { label: 'Renewables Low', value: renewablesLow },
          { label: 'Renewables Target', value: renewablesTarget },
          { label: 'Renewables High', value: renewablesHigh }
        ]
      };
    }

    const sqft = n(stratoSqft);
    const stratoLow = sqft * 0.04;
    const stratoTarget = sqft * 0.07;
    const stratoHigh = sqft * 0.11;

    return {
      pricingBasis: `Bundled ${portfolio} ${basis} + StratoSight`,
      low: renewablesLow + stratoLow,
      target: renewablesTarget + stratoTarget,
      high: renewablesHigh + stratoHigh,
      weighted: (renewablesTarget + stratoTarget) * 0.6,
      cts: 61,
      earnings: 39,
      lineItems: [
        { label: 'Renewables Target', value: renewablesTarget },
        { label: 'StratoSight Target', value: stratoTarget },
        { label: 'Bundled Total', value: renewablesTarget + stratoTarget }
      ]
    };
  }

  if (line === 'StratoSight') {
    const sqft = n(stratoSqft);
    const low = sqft * 0.04;
    const target = sqft * 0.07;
    const high = sqft * 0.11;

    return {
      pricingBasis: 'Square footage',
      low,
      target,
      high,
      weighted: target * 0.6,
      cts: 49,
      earnings: 34,
      lineItems: [
        { label: 'StratoSight Low', value: low },
        { label: 'StratoSight Target', value: target },
        { label: 'StratoSight High', value: high }
      ]
    };
  }

  const low = n(otherLow) || (n(otherQuantity) * n(otherTarget) * 0.9);
  const target = n(otherTarget) || (n(otherQuantity) * n(otherTarget));
  const high = n(otherHigh) || (target * 1.1);

  return {
    pricingBasis: otherBasis || 'Fixed Total',
    low,
    target,
    high,
    weighted: target * 0.6,
    cts: 58,
    earnings: 42,
    lineItems: [
      { label: otherDescription || 'Other O&M', value: target }
    ]
  };
}


function buildOpportunityPills(opportunity = {}) {
  const pills = [];

  const add = (label, value, tone = 'neutral') => {
    const text = String(value || '').trim();
    if (!text) return;
    pills.push({ label, value: text, tone });
  };

  add('Service', opportunity.service_line || opportunity.serviceLine, 'info');
  add('Segment', opportunity.market_segment || opportunity.marketSegment, 'neutral');
  add('Type', opportunity.opportunity_type || opportunity.opportunityType, 'neutral');
  add('Stage', opportunity.stage, 'warning');
  add('Forecast', opportunity.forecast_category || opportunity.forecastCategory, 'success');
  add('Basis', opportunity.commercial_basis || opportunity.commercialBasis, 'neutral');

  if (opportunity.total_mwac != null && opportunity.total_mwac !== '') {
    add('MWAC', opportunity.total_mwac, 'info');
  }
  if (opportunity.total_mwdc != null && opportunity.total_mwdc !== '') {
    add('MWDC', opportunity.total_mwdc, 'info');
  }
  if (opportunity.site_count != null && opportunity.site_count !== '') {
    add('Sites', opportunity.site_count, 'neutral');
  }
  if (opportunity.owner_full_name || opportunity.owner) {
    add('Owner', opportunity.owner_full_name || opportunity.owner, 'neutral');
  }
  if (opportunity.expected_close_date) {
    add('Close', opportunity.expected_close_date, 'warning');
  }

  return pills;
}


function renderOpportunityPill(pill = {}) {
  const toneMap = {
    success: { bg: '#EAF4EC', border: '#CFE3D4', text: '#2F6B4F' },
    warning: { bg: '#FFF3DE', border: '#F3D7A6', text: '#9B6A11' },
    info: { bg: '#EEF5FB', border: '#D4E3F2', text: '#2A5B84' },
    neutral: { bg: '#F4F8F5', border: '#D8E2DC', text: '#334155' },
  };

  const tone = toneMap[pill.tone] || toneMap.neutral;

  return (
    <span
      key={`${pill.label}-${pill.value}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        borderRadius: '999px',
        border: `1px solid ${tone.border}`,
        background: tone.bg,
        color: tone.text,
        padding: '6px 10px',
        fontSize: '12px',
        fontWeight: 700,
        whiteSpace: 'nowrap'
      }}
    >
      <span style={{ opacity: 0.72 }}>{pill.label}</span>
      <span>{pill.value}</span>
    </span>
  );
}


function textInput(value, onChange, options = {}) {
  return (
    <input
      value={value ?? ''}
      onChange={onChange}
      placeholder={options.placeholder || ''}
      disabled={Boolean(options.disabled)}
      style={{
        width: '100%',
        borderRadius: '12px',
        border: '1px solid #DCE7DD',
        background: options.disabled ? '#F4F6F7' : '#fff',
        color: options.disabled ? '#64748b' : '#1f2937',
        padding: '10px 12px',
        fontSize: '13px',
        boxSizing: 'border-box'
      }}
    />
  );
}


function selectInput(value, onChange, choices = []) {
  return (
    <select
      value={value ?? ''}
      onChange={onChange}
      style={{
        width: '100%',
        borderRadius: '12px',
        border: '1px solid #DCE7DD',
        background: '#fff',
        color: '#1f2937',
        padding: '10px 12px',
        fontSize: '13px',
        boxSizing: 'border-box'
      }}
    >
      {choices.map((choice) => (
        <option key={choice} value={choice}>{choice}</option>
      ))}
    </select>
  );
}


function inputWrap(label, input) {
  return (
    <div>
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b', marginBottom: '6px' }}>
        {label}
      </div>
      {input}
    </div>
  );
}

function OpportunityDetailPage({ onBackToOverview, opportunity, onSaveOpportunity }) {
  const [serviceLine, setServiceLine] = useState(opportunity?.service_line || 'Both');
  const [renewablesPortfolioType, setRenewablesPortfolioType] = useState(opportunity?.market_segment === 'StratoSight' ? 'DG' : (opportunity?.market_segment || 'DG'));
  const [renewablesBasis, setRenewablesBasis] = useState(
    String(opportunity?.commercial_basis || '').includes('MWAC') ? 'MWAC' : 'MWDC'
  );
  const [renewablesSize, setRenewablesSize] = useState(
    opportunity?.total_mwdc != null ? String(opportunity.total_mwdc) : '16.4'
  );
  const [stratoSqft, setStratoSqft] = useState('2450000');
  const [otherDescription, setOtherDescription] = useState('Auxiliary O&M Services');
  const [otherBasis, setOtherBasis] = useState('Fixed Total');
  const [otherQuantity, setOtherQuantity] = useState('1');
  const [otherTarget, setOtherTarget] = useState('125000');
  const [otherLow, setOtherLow] = useState('110000');
  const [otherHigh, setOtherHigh] = useState('140000');
  const [changeReason, setChangeReason] = useState('');
  const [revisionHistory, setRevisionHistory] = useState([
    {
      version: 1,
      when: dtNow(),
      who: 'Jeff Yarbrough',
      reason: 'Initial commercial setup',
      summary: 'Created baseline opportunity commercial structure.'
    }
  ]);

  const commercial = useMemo(() => computeOpportunityCommercial({
    serviceLine,
    renewablesPortfolioType,
    renewablesBasis,
    renewablesSize,
    stratoSqft,
    otherDescription,
    otherBasis,
    otherQuantity,
    otherTarget,
    otherLow,
    otherHigh
  }), [
    serviceLine,
    renewablesPortfolioType,
    renewablesBasis,
    renewablesSize,
    stratoSqft,
    otherDescription,
    otherBasis,
    otherQuantity,
    otherTarget,
    otherLow,
    otherHigh
  ]);

  const commercialChangeSnapshot = JSON.stringify({
    serviceLine,
    renewablesPortfolioType,
    renewablesBasis,
    renewablesSize,
    stratoSqft,
    otherDescription,
    otherBasis,
    otherQuantity,
    otherTarget,
    otherLow,
    otherHigh,
    pricingBasis: commercial.pricingBasis,
    low: commercial.low,
    target: commercial.target,
    high: commercial.high,
    weighted: commercial.weighted
  });

  const [lastSavedCommercialSnapshot, setLastSavedCommercialSnapshot] = useState('');

  React.useEffect(() => {
    if (!lastSavedCommercialSnapshot) {
      setLastSavedCommercialSnapshot(commercialChangeSnapshot);
    }
  }, [commercialChangeSnapshot, lastSavedCommercialSnapshot]);

  const hasCommercialChanges =
    Boolean(lastSavedCommercialSnapshot) &&
    lastSavedCommercialSnapshot !== commercialChangeSnapshot;

  function saveRevision() {
    if (!hasCommercialChanges) return;
    if (!changeReason.trim()) return;

    const nextRevision = {
      version: revisionHistory.length + 1,
      when: dtNow(),
      who: 'Jeff Yarbrough',
      reason: changeReason.trim(),
      summary: `${serviceLine} updated to target ${money(commercial.target)}`
    };

    setRevisionHistory((prev) => [nextRevision, ...prev]);

    if (opportunity?.id && onSaveOpportunity) {
      const rawForecastCategory = String(opportunity?.forecast_category || 'Pipeline').trim();
      const nextForecastCategory =
        rawForecastCategory === 'Best Case' ? 'BestCase' : rawForecastCategory;
      const nextProbability = Number(opportunity?.probability || 0);
      const weightedRevenue =
        Number(commercial.target || 0) * (
          nextForecastCategory === 'Commit'
            ? 0.9
            : nextForecastCategory === 'BestCase'
            ? 0.6
            : nextForecastCategory === 'Pipeline'
            ? 0.3
            : nextForecastCategory === 'Closed'
            ? 1
            : nextProbability > 0
            ? nextProbability / 100
            : 0.5
        );

      onSaveOpportunity(opportunity.id, {
        service_line: serviceLine,
        market_segment: serviceLine === 'StratoSight'
          ? 'StratoSight'
          : serviceLine === 'Other O&M'
          ? 'Other O&M'
          : renewablesPortfolioType,
        commercial_basis: commercial.pricingBasis || serviceLine,
        total_mwac: derivedMwac,
        total_mwdc: derivedMwdc,
        estimated_square_footage:
          serviceLine === 'StratoSight' || serviceLine === 'Both'
            ? Number(stratoSqft || 0)
            : null,
        calculated_revenue: Number(commercial.target || 0),
        amount_estimated: Number(commercial.target || 0),
        calc_year1_total: Number(commercial.target || 0),
        calc_arr_total: Number(commercial.target || 0),
        amount_total: Number(commercial.target || 0),
        weighted_revenue: weightedRevenue,
        estimated_cts_pct: Number(commercial.cts || 0),
        estimated_earnings_pct: Number(commercial.earnings || 0),
        probability: nextProbability || opportunity?.probability || 0,
        forecast_category: nextForecastCategory,
        expected_close_date: opportunity?.expected_close_date || '',
        staleness_flag: opportunity?.staleness_flag || false
      });
    }

    setLastSavedCommercialSnapshot(commercialChangeSnapshot);
    setChangeReason('');
  }

  const derivedMwac = serviceLine === 'Renewables' || serviceLine === 'Both'
    ? (renewablesBasis === 'MWAC' ? Number(renewablesSize || 0) : Number(renewablesSize || 0) / 1.25)
    : null;

  const derivedMwdc = serviceLine === 'Renewables' || serviceLine === 'Both'
    ? (renewablesBasis === 'MWDC' ? Number(renewablesSize || 0) : Number(renewablesSize || 0) * 1.25)
    : null;

  const opportunityPills = useMemo(() => buildOpportunityPills({
    service_line: serviceLine,
    market_segment: serviceLine === 'StratoSight'
      ? 'StratoSight'
      : serviceLine === 'Other O&M'
      ? 'Other O&M'
      : renewablesPortfolioType,
    opportunity_type: 'New customer / bundled services',
    stage: '3 Solution Fit',
    forecast_category: 'Best Case',
    total_mwac: derivedMwac,
    total_mwdc: derivedMwdc,
    site_count: 14,
    commercial_basis: commercial.pricingBasis || serviceLine,
    pricing_band: 'Mid',
    calculated_revenue: commercial.target,
    estimated_cts_pct: 63,
    estimated_earnings_pct: 37,
    follow_up_status: 'DueSoon',
    forecast_hygiene_status: 'AtRisk',
    owner_full_name: 'Jeff Yarbrough',
    expected_close_date: '2026-06-30',
    scope_type: serviceLine === 'Both' ? 'Bundled Renewables + StratoSight' : serviceLine,
    geographic_scope: 'National, multi-site',
    driver_summary: 'Bundled commercial structure with reporting support'
  }), [
    serviceLine,
    renewablesPortfolioType,
    renewablesBasis,
    renewablesSize,
    commercial.pricingBasis,
    commercial.target
  ]);

  const pricingFootnote =
    serviceLine === 'Renewables'
      ? 'Internal Renewables guidance uses DG / USS logic with MWDC or MWAC basis.'
      : serviceLine === 'StratoSight'
      ? 'Internal StratoSight guidance follows sqft-based commercial ranges.'
      : serviceLine === 'Both'
      ? 'Bundled logic combines Renewables and StratoSight commercial paths.'
      : 'Other O&M uses manual commercial entry with no automatic pricing formula.';

  const opportunitySnapshotCards = [
    {
      id: 'opp-ashley',
      name: 'Ashley Furniture MSA',
      account: 'Ashley Furniture Industries',
      service_line: serviceLine,
      market_segment: serviceLine === 'StratoSight' ? 'StratoSight' : renewablesPortfolioType,
      opportunity_type: 'New customer / bundled services',
      stage: '3 Solution Fit',
      forecast_category: 'Best Case',
      total_mwac: derivedMwac,
      total_mwdc: derivedMwdc,
      site_count: 14,
      commercial_basis: commercial.pricingBasis || serviceLine,
      pricing_band: 'Mid',
      calculated_revenue: commercial.target,
      estimated_cts_pct: 63,
      estimated_earnings_pct: 37,
      follow_up_status: 'DueSoon',
      forecast_hygiene_status: 'AtRisk',
      owner_full_name: 'Jeff Yarbrough',
      expected_close_date: '2026-06-30',
      scope_type: serviceLine === 'Both' ? 'Bundled Renewables + StratoSight' : serviceLine,
      geographic_scope: 'National, multi-site',
      driver_summary: 'Bundled commercial structure with reporting support'
    },
    {
      id: 'opp-onyx',
      name: 'Onyx DG Portfolio',
      account: 'Onyx Renewables',
      service_line: 'Renewables',
      market_segment: 'DG',
      opportunity_type: 'Renewal',
      stage: '4 Commercials',
      forecast_category: 'Commit',
      total_mwac: 12,
      total_mwdc: 15,
      site_count: 33,
      commercial_basis: 'DG MWAC annual',
      pricing_band: 'High',
      calculated_revenue: 192000,
      estimated_cts_pct: 58,
      estimated_earnings_pct: 29,
      follow_up_status: 'Current',
      forecast_hygiene_status: 'Healthy',
      owner_full_name: 'Jeff Yarbrough',
      expected_close_date: '2026-04-30',
      scope_type: 'Full Scope O&M',
      geographic_scope: 'Arizona',
      driver_summary: 'Portfolio renewal with staffing and PM coverage'
    },
    {
      id: 'opp-scan',
      name: 'Retail Roof Scan Program',
      account: 'National Retail Group',
      service_line: 'StratoSight',
      market_segment: 'StratoSight',
      opportunity_type: 'Expansion',
      stage: '2 Discovery',
      forecast_category: 'Pipeline',
      site_count: 21,
      commercial_basis: 'Square footage',
      pricing_band: 'Low',
      calculated_revenue: 425000,
      estimated_cts_pct: 49,
      estimated_earnings_pct: 34,
      follow_up_status: 'Overdue',
      forecast_hygiene_status: 'Warning',
      owner_full_name: 'Jeff Yarbrough',
      expected_close_date: '2026-07-15',
      scope_type: 'Thermal + RGB',
      geographic_scope: 'Multi-state',
      driver_summary: 'Roof scan expansion tied to annual reporting cadence'
    }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: '24px' }}>
      <div>
        <button
          onClick={onBackToOverview}
          style={{
            borderRadius: '16px',
            border: '1px solid #DCE7DD',
            background: '#FBFCFB',
            color: '#334155',
            padding: '10px 14px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ← Back to Opportunities Overview
        </button>
      </div>
      <section style={shellCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div>
            {smallLabel('Opportunity Header')}
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>{opportunity?.name || 'Opportunity'}</h2>
              <span style={{ borderRadius: '999px', background: '#E8F2EA', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#2F6B4F' }}>
                {opportunity?.forecast_category || 'Pipeline'}
              </span>
              <span style={{ borderRadius: '999px', background: '#FFF3DE', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#9B6A11' }}>
                {opportunity?.expected_close_date || 'No Close Date'}
              </span>
              <span style={{ borderRadius: '999px', background: '#FBE8E4', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#B25547' }}>
                {opportunity?.staleness_flag || 'Current'}
              </span>
            </div>
            <p style={{ marginTop: '12px', maxWidth: '760px', fontSize: '14px', lineHeight: 1.6, color: '#475569' }}>
              {(opportunity?.name || 'Opportunity') + ' commercial summary tied to the saved opportunity record, forecast, and linked account.'}
            </p>

            <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px', rowGap: '8px', alignItems: 'flex-start', minWidth: 0, maxWidth: '900px' }}>
              {opportunityPills.map((pill) => renderOpportunityPill(pill))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '12px', minWidth: '320px', gridTemplateColumns: '1fr' }}>
            {[
              ['Estimated Year 1', money(opportunity?.calculated_revenue ?? opportunity?.amount_total ?? opportunity?.calc_year1_total ?? opportunity?.amount_estimated ?? commercial.target)],
              ['Weighted Revenue', money(opportunity?.weighted_revenue ?? commercial.weighted)],
              ['Expected Close', opportunity?.expected_close_date || 'No Close Date'],
              ['Forecast', opportunity?.forecast_category || 'Pipeline']
            ].map(([label, value]) => (
              <div key={label} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '16px' }}>
                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
                <div style={{ marginTop: '8px', fontSize: '18px', fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
        <div style={{ display: 'grid', gap: '24px' }}>
          <section style={shellCard}>
            {smallLabel('Relationships')}
            <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>Account and contacts</h3>
            <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
              {[
                ['Linked Account', 'Ashley Furniture Industries'],
                ['Primary Contact', 'Megan Smethurst'],
                ['Additional Contacts', '3 linked stakeholders'],
                ['Account Owner', 'Jeff Yarbrough']
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
                  <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>{value}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={shellCard}>
            {smallLabel('Tasks')}
            <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>What needs to happen next</h3>
            <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
              {[
                ['Proposal review with Paul', 'Due tomorrow', 'High'],
                ['Confirm final sqft scope', 'Due in 2 days', 'High'],
                ['Draft bundled quote line items', 'Due in 3 days', 'Medium'],
                ['Schedule customer commercial call', 'Due next week', 'Medium']
              ].map(([title, due, priority]) => (
                <div key={title} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>{title}</div>
                    <div style={{ marginTop: '4px', fontSize: '13px', color: '#64748b' }}>{due}</div>
                  </div>
                  <div style={{ borderRadius: '999px', background: priority === 'High' ? '#FBE8E4' : '#FFF3DE', color: priority === 'High' ? '#B25547' : '#9B6A11', padding: '4px 10px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    {priority}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={shellCard}>
            {smallLabel('Activities')}
            <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>Recent deal movement</h3>
            <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
              {[
                ['Customer call completed', 'Discussed bundled commercial structure and timing'],
                ['Internal pricing review', 'Reviewed DG pricing range and StratoSight subtotal'],
                ['Contact update', 'Primary stakeholder list expanded by 3 names'],
                ['Forecast note added', 'Close date likely holds if quote goes out this week']
              ].map(([title, desc]) => (
                <div key={title} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '14px 16px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>{title}</div>
                  <div style={{ marginTop: '4px', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          <section style={shellCard}>
            {smallLabel('Deal Story')}
            <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>What this deal is, quickly</h3>
            <div style={{ marginTop: '18px', display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {[
                ['Service Line', serviceLine],
                ['Opportunity Type', 'New customer / bundled services'],
                ['Account', 'Ashley Furniture Industries'],
                ['Primary Contact', 'Megan Smethurst'],
                ['Region', 'National, multi-site'],
                ['Quote Readiness', 'Nearly ready, awaiting final itemization']
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '14px 16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
                  <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 500, color: '#1f2937' }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '16px' }}>
              <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>Narrative</div>
              <div style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.65, color: '#475569' }}>
                Ashley Furniture is evaluating a bundled engagement that combines renewables scope with StratoSight scanning and related reporting support. The deal is strategically meaningful because it can lead to recurring operational work beyond the initial engagement.
              </div>
            </div>
          </section>

          <section style={shellCard}>
            {smallLabel('Internal Calculator')}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginTop: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Pricing and service selection</h3>
              <span style={{ borderRadius: '999px', background: '#E8F2EA', padding: '4px 12px', fontSize: '12px', fontWeight: 700, color: '#2F6B4F' }}>Simple, fast, quote-ready</span>
            </div>

            <div style={{ marginTop: '18px', display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {['Renewables', 'StratoSight', 'Both', 'Other O&M'].map((option) => (
                <button key={option} onClick={() => setServiceLine(option)} style={buttonStyle(serviceLine === option)}>
                  <div style={{ fontSize: '14px' }}>{option}</div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '14px', fontSize: '12px', color: '#6B7280', lineHeight: 1.55 }}>
              {pricingFootnote}
            </div>

            {serviceLine === 'Renewables' || serviceLine === 'Both' ? (
              <div style={{ marginTop: '20px', display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                {inputWrap('Portfolio Type', selectInput(renewablesPortfolioType, (e) => setRenewablesPortfolioType(e.target.value), ['DG', 'USS']))}
                {inputWrap('Capacity Basis', selectInput(renewablesBasis, (e) => setRenewablesBasis(e.target.value), ['MWDC', 'MWAC']))}
                {inputWrap('Size', textInput(renewablesSize, (e) => setRenewablesSize(e.target.value), { placeholder: '16.4' }))}
              </div>
            ) : null}

            {serviceLine === 'StratoSight' || serviceLine === 'Both' ? (
              <div style={{ marginTop: '20px', display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                {inputWrap('Square Footage', textInput(stratoSqft, (e) => setStratoSqft(e.target.value), { placeholder: '2450000' }))}
                {inputWrap('Report Scope', textInput('Thermal + RGB', () => {}, { disabled: true }))}
              </div>
            ) : null}

            {serviceLine === 'Other O&M' ? (
              <div style={{ marginTop: '20px', borderRadius: '20px', border: '1px solid #DCE7DD', background: '#FBFCFB', padding: '18px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#54745D' }}>Other O&M manual mode</div>
                <div style={{ marginTop: '14px', display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  {inputWrap('Service Description', textInput(otherDescription, (e) => setOtherDescription(e.target.value)))}
                  {inputWrap('Pricing Basis', selectInput(otherBasis, (e) => setOtherBasis(e.target.value), ['Fixed Total', 'Per Site', 'Per Unit', 'T&M', 'Custom']))}
                  {inputWrap('Quantity', textInput(otherQuantity, (e) => setOtherQuantity(e.target.value)))}
                  {inputWrap('Low', textInput(otherLow, (e) => setOtherLow(e.target.value)))}
                  {inputWrap('Target', textInput(otherTarget, (e) => setOtherTarget(e.target.value)))}
                  {inputWrap('High', textInput(otherHigh, (e) => setOtherHigh(e.target.value)))}
                </div>
              </div>
            ) : null}

            <div style={{ marginTop: '18px', borderRadius: '18px', border: hasCommercialChanges ? '1px solid #BFD7C4' : '1px solid #DCE7DD', background: hasCommercialChanges ? '#F7FBF8' : '#FBFCFB', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#54745D' }}>
                    Commercial Change Approval
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '14px', lineHeight: 1.55, color: '#475569' }}>
                    Save commercial changes from this calculator here. Saved changes flow into Commercial History and the opportunity roll-up.
                  </div>
                </div>

                <div style={{ borderRadius: '999px', background: hasCommercialChanges ? '#FFF7EA' : '#EDF8F1', color: hasCommercialChanges ? '#8B5E12' : '#1F6B44', padding: '6px 10px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {hasCommercialChanges ? 'Unsaved changes' : 'No pending changes'}
                </div>
              </div>

              <div style={{ marginTop: '14px', display: 'grid', gap: '12px', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'end' }}>
                <div>
                  {inputWrap('Reason for update', textInput(changeReason, (e) => setChangeReason(e.target.value), { placeholder: 'Customer added MW, pricing changed, scope revised, etc.' }))}
                </div>

                <div>
                  <button
                    onClick={saveRevision}
                    disabled={!hasCommercialChanges || !changeReason.trim()}
                    style={{
                      borderRadius: '18px',
                      border: '1px solid #0B6771',
                      background: !hasCommercialChanges || !changeReason.trim() ? '#C8D6D8' : '#0B6771',
                      color: '#fff',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: !hasCommercialChanges || !changeReason.trim() ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Save Commercial Change
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section style={shellCard}>
            {smallLabel('Commercial Summary')}
            <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>Low, target, high and selected value</h3>
            <div style={{ marginTop: '18px', display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              {[
                ['Low', money(commercial.low)],
                ['Target', money(commercial.target)],
                ['High', money(commercial.high)],
                ['Weighted', money(commercial.weighted)]
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: label === 'Target' ? '#EDF7F4' : '#FBFCFB', padding: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
                  <div style={{ marginTop: '8px', fontSize: '22px', fontWeight: 700, color: label === 'Target' ? '#0B6771' : '#111827' }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '16px', display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {[
                ['Pricing Basis', commercial.pricingBasis || 'Not set'],
                ['Selected Commercial Basis', serviceLine],
                ['Override Status', serviceLine === 'Other O&M' ? 'Manual entry path' : 'No manual override']
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: '16px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '14px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
                  <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={shellCard}>
            {smallLabel('Forecast and Governance')}
            <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>Stage, risk and close discipline</h3>
            <div style={{ marginTop: '18px', display: 'grid', gap: '14px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              {[
                ['Stage', '3 Solution Fit'],
                ['Forecast Category', 'Best Case'],
                ['Expected Close', 'Jun 30, 2026'],
                ['Days in Stage', '18'],
                ['Last Activity', '3 days ago'],
                ['Quote Readiness', 'Almost ready']
              ].map(([label, value]) => (
                <div key={label} style={{ borderRadius: '16px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '14px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
                  <div style={{ marginTop: '6px', fontSize: '14px', fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {workflowStages.map((stage, idx) => (
                <span
                  key={stage}
                  style={{
                    borderRadius: '999px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 500,
                    background: idx === 3 ? '#0B6771' : '#F2F5F2',
                    color: idx === 3 ? '#fff' : '#334155'
                  }}
                >
                  {stage}
                </span>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section style={{ display: 'grid', gap: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <section style={shellCard}>
          {smallLabel('Quote Builder')}
          <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>Itemized line items</h3>
          <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
            {commercial.lineItems.map((line) => (
              <div key={line.item} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>{line.item}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0B6771' }}>{money(line.amount)}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {['Create Quote', 'Preview PDF', 'Send Quote', 'Version History'].map((action) => (
              <button key={action} style={{ borderRadius: '18px', border: '1px solid #DCE7DD', background: action === 'Create Quote' ? '#0B6771' : '#FBFCFB', color: action === 'Create Quote' ? '#fff' : '#334155', padding: '10px 16px', fontSize: '14px', fontWeight: 600 }}>
                {action}
              </button>
            ))}
          </div>
        </section>

        <section style={shellCard}>
          {smallLabel('Commercial History')}
          <h3 style={{ margin: '8px 0 0 0', fontSize: '18px', fontWeight: 600 }}>Revision timeline with why it changed</h3>

          <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
            {revisionHistory.map((rev) => (
              <div key={`${rev.version}-${rev.when}`} style={{ borderRadius: '18px', border: '1px solid #E5ECE5', background: '#FBFCFB', padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>Version {rev.version}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{rev.when}</div>
                </div>
                <div style={{ marginTop: '6px', fontSize: '13px', color: '#334155' }}><strong>Who:</strong> {rev.who}</div>
                <div style={{ marginTop: '4px', fontSize: '13px', color: '#334155' }}><strong>Why:</strong> {rev.reason}</div>
                <div style={{ marginTop: '4px', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>{rev.summary}</div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

function renderHeaderBand(activePage, onBack, canGoBack, options = {}) {
  const { selectedOpportunity = null, accountDetailId = null } = options;
  const isWelcome = activePage === 'Welcome';

  const pageConfig = {
    Welcome: {
      title: 'Welcome to NAES Technologies CRM',
      subtitle: ''
    },
    Dashboard: {
      title: 'Dashboard',
      subtitle: 'Executive CRM operating view across pipeline, forecasting, accounts, contacts, and revenue performance.'
    },
    Accounts: {
      title: accountDetailId ? 'Account Detail' : 'Accounts',
      subtitle: accountDetailId
        ? 'Commercial summary, linked contacts, linked opportunities, and relationship detail.'
        : 'Portfolio-level roll-up of customers, owners, opportunity exposure, contacts, and revenue footprint.'
    },
    Contacts: {
      title: 'Contacts',
      subtitle: 'Relationship roll-up view across customer, partner, and internal stakeholder records.'
    },
    Opportunities: {
      title: selectedOpportunity?.name || 'Opportunities',
      subtitle: selectedOpportunity
        ? 'Commercial summary, stage governance, forecast hygiene, and linked account.'
        : 'Commercial roll-up across active deals, stage progression, forecast confidence, and revenue quality.'
    },
    'My Pipeline': {
      title: 'My Pipeline',
      subtitle: 'User-scoped pipeline and action focus.'
    },
    'Pipeline Rollup': {
      title: 'Pipeline Rollup',
      subtitle: 'Team and executive pipeline aggregation.'
    },
    'Revenue Command Center': {
      title: 'Revenue Command Center',
      subtitle: 'Commercial performance and weighted outlook.'
    },
    'Forecast Dashboard': {
      title: 'Forecast Dashboard',
      subtitle: 'Forecast roll-up and close-period readiness.'
    },
    'Forecast Integrity': {
      title: 'Forecast Integrity',
      subtitle: 'Aging, commit risk, and confidence scoring.'
    },
    'Period Control': {
      title: 'Period Control',
      subtitle: 'Period governance and forecast lock logic.'
    },
    Tasks: {
      title: 'Tasks',
      subtitle: 'Task management workspace.'
    },
    Activities: {
      title: 'Activities',
      subtitle: 'Activity history and follow-up visibility.'
    },
    Settings: {
      title: 'Settings',
      subtitle: 'User and system settings.'
    },
    'User Accounts': {
      title: 'User Accounts',
      subtitle: 'Admin-managed user directory, identity, and access control.'
    }
  };

  const config = pageConfig[activePage] || {
    title: activePage,
    subtitle: 'This section is part of the recovered CRM shell and will be built out module by module.'
  };

  return (
    <div style={{ background: 'linear-gradient(90deg,#063F47 0%,#0A7983 40%,#21C8D3 70%,#239EE2 100%)', padding: '24px 32px 32px 32px', color: '#fff', boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.08)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 560px', minWidth: '320px', paddingTop: isWelcome ? '18px' : '0' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
            {isWelcome ? '' : 'Opportunity Workspace'}
          </div>
          <h1 style={{ margin: '4px 0 0 0', fontSize: '46px', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>
            {config.title}
          </h1>
          {config.subtitle ? (
            <p style={{ marginTop: '8px', maxWidth: '760px', fontSize: '14px', color: 'rgba(255,255,255,0.78)' }}>
              {config.subtitle}
            </p>
          ) : null}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', gap: '12px', flex: '0 0 auto', minWidth: isWelcome ? '520px' : 'auto' }}>
          {isWelcome ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px', minWidth: '420px', padding: '0' }}>
              <img
                src="/assets/naes-technologies-logo.png"
                alt="NAES Technologies"
                style={{ maxWidth: '560px', width: '100%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.18))' }}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function getInitialPath() {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname || '/';
}

function parseOpportunityRoute(pathname) {
  if (!pathname) return { isOpportunities: false, detailId: null };

  if (pathname === '/opportunities') {
    return { isOpportunities: true, detailId: null };
  }

  const match = pathname.match(/^\/opportunities\/([^/]+)$/);
  if (match) {
    return { isOpportunities: true, detailId: match[1] };
  }

  return { isOpportunities: false, detailId: null };
}

function pushPath(path) {
  if (typeof window === 'undefined') return;
  window.history.pushState({}, '', path);
}

function replacePath(path) {
  if (typeof window === 'undefined') return;
  window.history.replaceState({}, '', path);
}

export default function App() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');

    const prevHtmlOverflow = html.style.overflow;
    const prevHtmlHeight = html.style.height;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;
    const prevBodyMargin = body.style.margin;
    const prevRootHeight = root ? root.style.height : '';
    const prevRootOverflow = root ? root.style.overflow : '';

    html.style.overflow = 'hidden';
    html.style.height = '100%';
    body.style.overflow = 'hidden';
    body.style.height = '100%';
    body.style.margin = '0';

    if (root) {
      root.style.height = '100%';
      root.style.overflow = 'hidden';
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      html.style.height = prevHtmlHeight;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      body.style.margin = prevBodyMargin;

      if (root) {
        root.style.height = prevRootHeight;
        root.style.overflow = prevRootOverflow;
      }
    };
  }, []);

  const [activePage, setActivePage] = useState('Welcome');
  const [pageHistory, setPageHistory] = useState(['Welcome']);
  const [accountDetailId, setAccountDetailId] = useState(null);
  const [accountList, setAccountList] = useState(() => {
    try {
      const raw = window.localStorage.getItem('naes-crm-account-list');
      return sanitizeAccounts(safeParseStoredJson(raw, accountRecords));
    } catch (error) {
      return accountRecords;
    }
  });
  const [showNewAccountForm, setShowNewAccountForm] = useState(false);
  const [showEditAccountForm, setShowEditAccountForm] = useState(false);
  const [accountHistoryMap, setAccountHistoryMap] = useState(() => {
    try {
      const raw = window.localStorage.getItem('naes-crm-account-history');
      return safeParseStoredJson(raw, {});
    } catch (error) {
      return {};
    }
  });
  const [newAccountForm, setNewAccountForm] = useState(buildAccountFormFromRecord());

  const [contactDetailId, setContactDetailId] = useState(null);
  const [showNewOpportunityForm, setShowNewOpportunityForm] = useState(false);
  const [newOpportunityForm, setNewOpportunityForm] = useState(buildOpportunityFormFromRecord());
  const [contactList, setContactList] = useState(() => {
    try {
      const raw = window.localStorage.getItem('naes-crm-contact-list');
      return sanitizeContacts(safeParseStoredJson(raw, contactRecords));
    } catch (error) {
      return contactRecords;
    }
  });
  const [showNewContactForm, setShowNewContactForm] = useState(false);
  const [showEditContactForm, setShowEditContactForm] = useState(false);
  const [newContactForm, setNewContactForm] = useState(buildContactFormFromRecord());

  function openWelcomeNewContact() {
    setActivePage('Contacts');
    setContactDetailId(null);
    setShowNewContactForm(true);
    setNewContactForm(buildContactFormFromRecord());
    setShowNewAccountForm(false);
    setShowNewOpportunityForm(false);
  }

  function openWelcomeNewAccount() {
    setActivePage('Accounts');
    setAccountDetailId(null);
    setShowNewAccountForm(true);
    setNewAccountForm(buildAccountFormFromRecord());
    setShowNewContactForm(false);
    setShowNewOpportunityForm(false);
  }

  function openWelcomeNewOpportunity() {
    setActivePage('Opportunities');
    setShowNewOpportunityForm(true);
    setNewOpportunityForm(buildOpportunityFormFromRecord());
    setShowNewAccountForm(false);
    setShowNewContactForm(false);
    replacePath('/opportunities');
    setRoutePath('/opportunities');
  }

  const [routePath, setRoutePath] = useState(getInitialPath());
  const [opportunities, setOpportunities] = useState(() => {
    try {
      const raw = window.localStorage.getItem('naes-crm-opportunity-list');
      return sanitizeOpportunities(safeParseStoredJson(raw, initialOpportunities));
    } catch {
      return initialOpportunities;
    }
  });

  const [taskList, setTaskList] = useState(() => {
    try {
      const raw = window.localStorage.getItem('naes-crm-task-list');
      return sanitizeTasks(safeParseStoredJson(raw, initialTasks));
    } catch (error) {
      return initialTasks;
    }
  });
  const [taskDetailId, setTaskDetailId] = useState(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState(buildTaskFormFromRecord());

  const [activityList, setActivityList] = useState(() => {
    try {
      const raw = window.localStorage.getItem('naes-crm-activity-list');
      return safeParseStoredJson(raw, []);
    } catch (error) {
      return [];
    }
  });
  const [activityDetailId, setActivityDetailId] = useState(null);
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);
  const [showEditActivityForm, setShowEditActivityForm] = useState(false);
  const [newActivityForm, setNewActivityForm] = useState(buildActivityFormFromRecord());
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const raw = window.localStorage.getItem('naes-crm-user-profile');
      return {
        ...buildDefaultUserProfile(),
        ...safeParseStoredJson(raw, buildDefaultUserProfile())
      };
    } catch (error) {
      return buildDefaultUserProfile();
    }
  });
  const [userAccounts, setUserAccounts] = useState(() => {
    try {
      const raw = window.localStorage.getItem('naes-crm-user-accounts');
      const parsed = safeParseStoredJson(raw, null);
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.map((item) => buildUserAccountDraft(item));
      }
      return buildInitialUserAccounts(buildDefaultUserProfile()).map((item) => buildUserAccountDraft(item));
    } catch (error) {
      return buildInitialUserAccounts(buildDefaultUserProfile()).map((item) => buildUserAccountDraft(item));
    }
  });

  const visibleSidebarSections = useMemo(() => {
    const allowed = new Set(getAllowedPagesForRole(userProfile?.role));
    return sidebarSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => allowed.has(item))
      }))
      .filter((section) => section.items.length > 0);
  }, [userProfile?.role]);

  const flatItems = useMemo(() => sidebarSections.flatMap((section) => section.items), []);
  const visibleFlatItems = useMemo(() => visibleSidebarSections.flatMap((section) => section.items), [visibleSidebarSections]);
  const routeInfo = parseOpportunityRoute(routePath);

  const safeActivePage =
    routeInfo.isOpportunities && visibleFlatItems.includes('Opportunities')
      ? 'Opportunities'
      : visibleFlatItems.includes(activePage)
      ? activePage
      : (visibleFlatItems[0] || 'Welcome');

  useEffect(() => {
    try {
      window.localStorage.setItem('naes-crm-user-profile', JSON.stringify(userProfile));
    } catch (error) {
      // ignore local storage persistence issues in preview shell
    }
  }, [userProfile]);

  useEffect(() => {
    const allowed = getAllowedPagesForRole(userProfile?.role);
    if (!routeInfo.isOpportunities && !allowed.includes(activePage)) {
      setActivePage(allowed[0] || 'Welcome');
    }
  }, [userProfile?.role, activePage, routeInfo.isOpportunities]);

  useEffect(() => {
    try {
      window.localStorage.setItem('naes-crm-task-list', JSON.stringify(taskList));
    } catch (error) {
      // ignore local storage persistence issues in preview shell
    }
  }, [taskList]);

  useEffect(() => {
    try {
      window.localStorage.setItem('naes-crm-activity-list', JSON.stringify(activityList));
    } catch (error) {
      // ignore local storage persistence issues in preview shell
    }
  }, [activityList]);

  const selectedOpportunity =
    routeInfo.detailId
      ? opportunities.find((item) => item.id === routeInfo.detailId) || null
      : null;

  React.useEffect(() => {
    const onPopState = () => {
      setRoutePath(getInitialPath());
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem('naes-crm-account-list', JSON.stringify(accountList));
    } catch (error) {
      console.warn('Could not persist account list', error);
    }
  }, [accountList]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem('naes-crm-account-history', JSON.stringify(accountHistoryMap));
    } catch (error) {
      console.warn('Could not persist account history', error);
    }
  }, [accountHistoryMap]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem('naes-crm-contact-list', JSON.stringify(contactList));
    } catch (error) {
      console.warn('Could not persist contact list', error);
    }
  }, [contactList]);

  React.useEffect(() => {
    try {
      window.localStorage.setItem('naes-crm-opportunity-list', JSON.stringify(opportunities));
    } catch (error) {
      console.warn('Could not persist opportunity list', error);
    }
  }, [opportunities]);

  function navigate(nextPage) {
    setActivePage(nextPage);
    setPageHistory((prev) => [...prev, nextPage]);
    setAccountDetailId(null);
    setContactDetailId(null);
    setShowNewAccountForm(false);
    setShowEditAccountForm(false);
    setShowNewContactForm(false);
    setShowNewTaskForm(false);
    setShowEditTaskForm(false);
    setTaskDetailId(null);
    setShowNewActivityForm(false);
    setShowEditActivityForm(false);
    setActivityDetailId(null);

    if (nextPage === 'Opportunities') {
      pushPath('/opportunities');
      setRoutePath('/opportunities');
      return;
    }

    if (routeInfo.isOpportunities) {
      replacePath('/');
      setRoutePath('/');
    }
  }

  function startNewAccount() {
    setAccountDetailId(null);
    setShowEditAccountForm(false);
    setNewAccountForm(buildAccountFormFromRecord());
    setActivePage('Accounts');
    setShowNewAccountForm(true);
  }

  
  
  
  function cancelNewAccount() {
    setShowNewAccountForm(false);
    setNewAccountForm(buildAccountFormFromRecord());
  }




  function updateNewAccountField(field, value) {
    setNewAccountForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEditAccount() {
    const account = getAccountById(accountDetailId, accountList);
    if (!account) return;
    setNewAccountForm(buildAccountFormFromRecord(account));
    setShowEditAccountForm(true);
    setShowNewAccountForm(false);
    setActivePage('Accounts');
  }

  function cancelEditAccount() {
    setShowEditAccountForm(false);
    setNewAccountForm(buildAccountFormFromRecord());
  }

  function saveEditedAccount() {
    if (!accountDetailId) return;

    const name = String(newAccountForm.name || '').trim();
    if (!name) return;

    setAccountList((prev) =>
      prev.map((account) =>
        account.id === accountDetailId
          ? {
              ...account,
              name,
              legalBusinessName: String(newAccountForm.legalBusinessName || '').trim(),
              businessType: String(newAccountForm.businessType || '').trim(),
              website: String(newAccountForm.website || '').trim(),
              linkedin: String(newAccountForm.linkedin || '').trim(),
              mainPhone: String(newAccountForm.mainPhone || '').trim(),
              generalEmail: String(newAccountForm.generalEmail || '').trim(),
              mainAddress: String(newAccountForm.mainAddress || '').trim(),
              city: String(newAccountForm.city || '').trim(),
              state: String(newAccountForm.state || '').trim(),
              zip: String(newAccountForm.zip || '').trim(),
              country: String(newAccountForm.country || '').trim(),
              primaryAccountOwner: String(newAccountForm.primaryAccountOwner || '').trim(),
              interestedServices: String(newAccountForm.interestedServices || '').trim(),
              totalMw: String(newAccountForm.totalMw || '').trim(),
              portfolioType: String(newAccountForm.portfolioType || '').trim(),
              generalFootprintRegion: String(newAccountForm.generalFootprintRegion || '').trim(),
              estimatedBuildingCount: String(newAccountForm.estimatedBuildingCount || '').trim(),
              estimatedSquareFootage: String(newAccountForm.estimatedSquareFootage || '').trim(),
              generalSiteType: String(newAccountForm.generalSiteType || '').trim(),
              notes: String(newAccountForm.notes || '').trim(),
            }
          : account
      )
    );

    setAccountHistoryMap((prev) => ({
      ...prev,
      [accountDetailId]: [
        {
          id: `hist-${Date.now()}`,
          at: new Date().toLocaleString(),
          user: 'Current User',
          action: 'Edited account',
        },
        ...((prev[accountDetailId] || [])),
      ],
    }));

    setShowEditAccountForm(false);
    setNewAccountForm(buildAccountFormFromRecord());
    setActivePage('Accounts');
  }

  
  
  
  function saveNewAccount() {
    const name = String(newAccountForm.name || '').trim();
    if (!name) return;

    const id = `acct-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new'}`;

    const newRecord = {
      id,
      name,
      legalBusinessName: String(newAccountForm.legalBusinessName || '').trim(),
      businessType: String(newAccountForm.businessType || '').trim(),
      website: String(newAccountForm.website || '').trim(),
      linkedin: String(newAccountForm.linkedin || '').trim(),
      mainPhone: String(newAccountForm.mainPhone || '').trim(),
      generalEmail: String(newAccountForm.generalEmail || '').trim(),
      mainAddress: String(newAccountForm.mainAddress || '').trim(),
      city: String(newAccountForm.city || '').trim(),
      state: String(newAccountForm.state || '').trim(),
      zip: String(newAccountForm.zip || '').trim(),
      country: String(newAccountForm.country || '').trim(),
      primaryAccountOwner: String(newAccountForm.primaryAccountOwner || '').trim(),
      interestedServices: String(newAccountForm.interestedServices || '').trim(),
      totalMw: String(newAccountForm.totalMw || '').trim(),
      portfolioType: String(newAccountForm.portfolioType || '').trim(),
      generalFootprintRegion: String(newAccountForm.generalFootprintRegion || '').trim(),
      estimatedBuildingCount: String(newAccountForm.estimatedBuildingCount || '').trim(),
      estimatedSquareFootage: String(newAccountForm.estimatedSquareFootage || '').trim(),
      generalSiteType: String(newAccountForm.generalSiteType || '').trim(),
      notes: String(newAccountForm.notes || '').trim(),
      primaryContactName: '',
      email: '',
      phone: '',
      segment: '',
      region: '',
      owner: '',
      arr: 0,
      annualRevenue: 0,
      ctsPercent: 0,
      marginPercent: 0,
      openOpportunityIds: [],
      contactIds: [],
    };

    setAccountList((prev) => [newRecord, ...prev]);
    setAccountHistoryMap((prev) => ({
      ...prev,
      [id]: [
        {
          id: `hist-${Date.now()}`,
          at: new Date().toLocaleString(),
          user: 'Current User',
          action: 'Created account',
        },
      ],
    }));
    setShowNewAccountForm(false);
    setShowEditAccountForm(false);
    setAccountDetailId(id);
    setActivePage('Accounts');
    setNewAccountForm(buildAccountFormFromRecord());
  }




  function openAccountDetail(accountId) {
    setAccountDetailId(accountId);
    setActivePage('Accounts');
    setPageHistory((prev) => [...prev, 'Accounts']);
    if (routeInfo.isOpportunities) {
      replacePath('/');
      setRoutePath('/');
    }
  }

  function returnToAccountsOverview() {
    setAccountDetailId(null);
    setActivePage('Accounts');
  }

  function openContactDetail(contactId) {
    setContactDetailId(contactId);
    setActivePage('Contacts');
    setPageHistory((prev) => [...prev, 'Contacts']);

    if (routeInfo.isOpportunities) {
      replacePath('/');
      setRoutePath('/');
    }
  }

  function returnToContactsOverview() {
    setContactDetailId(null);
    setActivePage('Contacts');
  }

  function startNewContact() {
    setContactDetailId(null);
    setShowEditContactForm(false);
    setNewContactForm(buildContactFormFromRecord());
    setShowNewContactForm(true);
    setActivePage('Contacts');
  }

  function cancelNewContact() {
    setShowNewContactForm(false);
    setNewContactForm(buildContactFormFromRecord());
  }

  function updateNewContactField(field, value) {
    setNewContactForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEditContact() {
    const contact = getContactById(contactDetailId, contactList);
    if (!contact) return;
    setNewContactForm(buildContactFormFromRecord(contact));
    setShowEditContactForm(true);
    setShowNewContactForm(false);
    setActivePage('Contacts');
  }

  function cancelEditContact() {
    setShowEditContactForm(false);
    setNewContactForm(buildContactFormFromRecord());
  }

  function saveEditedContact() {
    if (!contactDetailId) return;

    const firstName = String(newContactForm.firstName || '').trim();
    const lastName = String(newContactForm.lastName || '').trim();
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
    if (!fullName) return;

    const account = newContactForm.accountId ? getAccountById(newContactForm.accountId, accountList) : null;

    setContactList((prev) =>
      prev.map((contact) =>
        contact.id === contactDetailId
          ? {
              ...contact,
              firstName,
              lastName,
              fullName,
              name: fullName,
              jobTitle: String(newContactForm.jobTitle || '').trim(),
              title: String(newContactForm.jobTitle || '').trim(),
              accountId: String(newContactForm.accountId || '').trim(),
              accountName: account?.name || '',
              email: String(newContactForm.email || '').trim(),
              mobilePhone: String(newContactForm.mobilePhone || '').trim(),
              officePhone: String(newContactForm.officePhone || '').trim(),
              address: String(newContactForm.address || '').trim(),
              city: String(newContactForm.city || '').trim(),
              state: String(newContactForm.state || '').trim(),
              zip: String(newContactForm.zip || '').trim(),
              linkedin: String(newContactForm.linkedin || '').trim(),
              website: String(newContactForm.website || '').trim(),
              preferredContactMethod: String(newContactForm.preferredContactMethod || '').trim(),
              roleInBuyingProcess: String(newContactForm.roleInBuyingProcess || '').trim(),
              notes: String(newContactForm.notes || '').trim(),
              decisionMaker: Boolean(newContactForm.decisionMaker),
              champion: Boolean(newContactForm.champion),
              primaryContact: Boolean(newContactForm.primaryContact),
            }
          : contact
      )
    );

    setShowEditContactForm(false);
    setShowNewContactForm(false);
    setNewContactForm(buildContactFormFromRecord());
    setActivePage('Contacts');
  }

  function saveNewContact() {
    const firstName = String(newContactForm.firstName || '').trim();
    const lastName = String(newContactForm.lastName || '').trim();
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
    if (!fullName) return;

    const id = `contact-${fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'new'}`;
    const account = newContactForm.accountId ? getAccountById(newContactForm.accountId, accountList) : null;

    const newRecord = {
      id,
      firstName,
      lastName,
      fullName,
      name: fullName,
      jobTitle: String(newContactForm.jobTitle || '').trim(),
      title: String(newContactForm.jobTitle || '').trim(),
      accountId: String(newContactForm.accountId || '').trim(),
      accountName: account?.name || '',
      email: String(newContactForm.email || '').trim(),
      mobilePhone: String(newContactForm.mobilePhone || '').trim(),
      officePhone: String(newContactForm.officePhone || '').trim(),
      address: String(newContactForm.address || '').trim(),
      city: String(newContactForm.city || '').trim(),
      state: String(newContactForm.state || '').trim(),
      zip: String(newContactForm.zip || '').trim(),
      linkedin: String(newContactForm.linkedin || '').trim(),
      website: String(newContactForm.website || '').trim(),
      preferredContactMethod: String(newContactForm.preferredContactMethod || '').trim(),
      roleInBuyingProcess: String(newContactForm.roleInBuyingProcess || '').trim(),
      notes: String(newContactForm.notes || '').trim(),
      decisionMaker: Boolean(newContactForm.decisionMaker),
      champion: Boolean(newContactForm.champion),
      primaryContact: Boolean(newContactForm.primaryContact),
    };

    setContactList((prev) => [newRecord, ...prev]);
    setShowNewContactForm(false);
    setContactDetailId(id);
    setActivePage('Contacts');
    setNewContactForm(buildContactFormFromRecord());
  }

  
function startNewTask() {
  setTaskDetailId(null);
  setShowEditTaskForm(false);
  setNewTaskForm(buildTaskFormFromRecord());
  setShowNewTaskForm(true);
}

function openTaskDetail(taskId) {
  const task = taskList.find((item) => item.id === taskId);
  if (!task) return;
  setTaskDetailId(taskId);
  setShowNewTaskForm(false);
  setShowEditTaskForm(true);
  setNewTaskForm(buildTaskFormFromRecord(task));
  setActivePage('Tasks');
}

function cancelNewTask() {
  setShowNewTaskForm(false);
  setNewTaskForm(buildTaskFormFromRecord());
}

function cancelEditTask() {
  setTaskDetailId(null);
  setShowEditTaskForm(false);
  setNewTaskForm(buildTaskFormFromRecord());
}

function updateNewTaskField(field, value) {
  setNewTaskForm((current) => ({ ...current, [field]: value }));
}

function saveEditedTask() {
  if (!taskDetailId) return;

  setTaskList((current) =>
    current.map((task) =>
      task.id === taskDetailId
        ? {
            ...task,
            title: String(newTaskForm.title || 'New Task').trim(),
            accountId: String(newTaskForm.accountId || '').trim(),
            contactId: String(newTaskForm.contactId || '').trim(),
            opportunityId: String(newTaskForm.opportunityId || '').trim(),
            owner: String(newTaskForm.owner || 'Jeff Yarbrough').trim(),
            dueDate: String(newTaskForm.dueDate || '').trim(),
            priority: String(newTaskForm.priority || 'Medium').trim(),
            status: String(newTaskForm.status || 'Not Started').trim(),
            notes: String(newTaskForm.notes || '').trim(),
            updated_at: dtNow()
          }
        : task
    )
  );

  setTaskDetailId(null);
  setShowEditTaskForm(false);
  setNewTaskForm(buildTaskFormFromRecord());
}

function saveNewTask() {
  const newTask = {
    id: `task-${Date.now()}`,
    title: String(newTaskForm.title || 'New Task').trim(),
    accountId: String(newTaskForm.accountId || '').trim(),
    contactId: String(newTaskForm.contactId || '').trim(),
    opportunityId: String(newTaskForm.opportunityId || '').trim(),
    owner: String(newTaskForm.owner || 'Jeff Yarbrough').trim(),
    dueDate: String(newTaskForm.dueDate || '').trim(),
    priority: String(newTaskForm.priority || 'Medium').trim(),
    status: String(newTaskForm.status || 'Not Started').trim(),
    notes: String(newTaskForm.notes || '').trim(),
    created_at: dtNow(),
    updated_at: dtNow()
  };

  setTaskList((current) => [newTask, ...current]);
  setShowNewTaskForm(false);
  setNewTaskForm(buildTaskFormFromRecord());
}

function startNewActivity() {
  setActivityDetailId(null);
  setShowEditActivityForm(false);
  setNewActivityForm(buildActivityFormFromRecord());
  setShowNewActivityForm(true);
  setActivePage('Activities');
}

function openActivityDetail(activityId) {
  const activity = activityList.find((item) => item.id === activityId);
  if (!activity) return;
  setActivityDetailId(activityId);
  setShowNewActivityForm(false);
  setShowEditActivityForm(true);
  setNewActivityForm(buildActivityFormFromRecord(activity));
  setActivePage('Activities');
}

function cancelNewActivity() {
  setShowNewActivityForm(false);
  setNewActivityForm(buildActivityFormFromRecord());
}

function cancelEditActivity() {
  setActivityDetailId(null);
  setShowEditActivityForm(false);
  setNewActivityForm(buildActivityFormFromRecord());
}

function updateNewActivityField(field, value) {
  setNewActivityForm((current) => ({ ...current, [field]: value }));
}

function saveNewActivity() {
  const newActivity = {
    id: `activity-${Date.now()}`,
    activityType: String(newActivityForm.activityType || 'Call').trim(),
    subject: String(newActivityForm.subject || 'New Activity').trim(),
    activityDateTime: String(newActivityForm.activityDateTime || '').trim(),
    owner: String(newActivityForm.owner || 'Jeff Yarbrough').trim(),
    accountId: String(newActivityForm.accountId || '').trim(),
    contactId: String(newActivityForm.contactId || '').trim(),
    opportunityId: String(newActivityForm.opportunityId || '').trim(),
    notes: String(newActivityForm.notes || '').trim(),
    created_at: dtNow(),
    updated_at: dtNow()
  };

  setActivityList((current) => [newActivity, ...current]);
  setShowNewActivityForm(false);
  setNewActivityForm(buildActivityFormFromRecord());
}

function saveEditedActivity() {
  if (!activityDetailId) return;

  setActivityList((current) =>
    current.map((activity) =>
      activity.id === activityDetailId
        ? {
            ...activity,
            activityType: String(newActivityForm.activityType || 'Call').trim(),
            subject: String(newActivityForm.subject || 'Activity').trim(),
            activityDateTime: String(newActivityForm.activityDateTime || '').trim(),
            owner: String(newActivityForm.owner || 'Jeff Yarbrough').trim(),
            accountId: String(newActivityForm.accountId || '').trim(),
            contactId: String(newActivityForm.contactId || '').trim(),
            opportunityId: String(newActivityForm.opportunityId || '').trim(),
            notes: String(newActivityForm.notes || '').trim(),
            updated_at: dtNow()
          }
        : activity
    )
  );

  setActivityDetailId(null);
  setShowEditActivityForm(false);
  setNewActivityForm(buildActivityFormFromRecord());
}

function startNewOpportunity() {
  setNewOpportunityForm(buildOpportunityFormFromRecord());
  setShowNewOpportunityForm(true);
}

function cancelNewOpportunity() {
  setShowNewOpportunityForm(false);
  setNewOpportunityForm(buildOpportunityFormFromRecord());
}

function updateNewOpportunityField(field, value) {
  setNewOpportunityForm((current) => ({ ...current, [field]: value }));
}

function saveNewOpportunity() {
  const newId = `opp-${Date.now()}`;

  const serviceLine = String(newOpportunityForm.serviceLine || 'Renewables').trim();
  const renewablesSegment = String(newOpportunityForm.renewablesSegment || 'DG').trim();
  const renewablesSize = Number(newOpportunityForm.renewablesSize || 0);
  const stratoSqftTotal = Number(newOpportunityForm.stratoSqftTotal || 0);
  const otherQty = Number(newOpportunityForm.otherOmQuantity || 0);
  const otherLowRate = Number(newOpportunityForm.otherOmLowRate || 0);
  const otherSelectedRate = Number(newOpportunityForm.otherOmSelectedRate || 0);
  const otherHighRate = Number(newOpportunityForm.otherOmHighRate || 0);

  const account = newOpportunityForm.accountId
    ? getAccountById(newOpportunityForm.accountId, accountList)
    : null;

  const contact = newOpportunityForm.primaryContactId
    ? contactList.find((item) => item.id === newOpportunityForm.primaryContactId) || null
    : null;

  function getStratoSightBand(sqft) {
    if (sqft <= 25000) return { low: 0.09, selected: 0.11, high: 0.13 };
    if (sqft <= 100000) return { low: 0.08, selected: 0.095, high: 0.11 };
    if (sqft <= 500000) return { low: 0.06, selected: 0.075, high: 0.09 };
    if (sqft <= 2000000) return { low: 0.05, selected: 0.06, high: 0.075 };
    if (sqft <= 10000000) return { low: 0.04, selected: 0.05, high: 0.06 };
    if (sqft <= 50000000) return { low: 0.035, selected: 0.04, high: 0.05 };
    return { low: 0.03, selected: 0.035, high: 0.04 };
  }

  function getDgBand(mwdc) {
    if (mwdc <= 1) return { low: 21000, selected: 24000, high: 27000 };
    if (mwdc <= 3) return { low: 19000, selected: 22000, high: 25000 };
    if (mwdc <= 5) return { low: 18000, selected: 21000, high: 24000 };
    if (mwdc <= 10) return { low: 17000, selected: 19500, high: 22000 };
    if (mwdc <= 15) return { low: 16000, selected: 18000, high: 20000 };
    return { low: 15000, selected: 16500, high: 18000 };
  }

  function getUssBand(mwac) {
    if (mwac <= 50) return { low: 13000, selected: 16000, high: 18000 };
    if (mwac <= 100) return { low: 11000, selected: 14000, high: 16000 };
    if (mwac <= 250) return { low: 9500, selected: 12000, high: 14000 };
    if (mwac <= 500) return { low: 8500, selected: 10500, high: 12500 };
    if (mwac <= 1000) return { low: 7500, selected: 9000, high: 10500 };
    if (mwac <= 2000) return { low: 7000, selected: 8000, high: 9000 };
    return { low: 6500, selected: 7000, high: 8000 };
  }

  const renewablesBand = renewablesSegment === 'USS'
    ? getUssBand(renewablesSize)
    : getDgBand(renewablesSize);

  const renewablesLow = renewablesSize * renewablesBand.low;
  const renewablesSelected = renewablesSize * renewablesBand.selected;
  const renewablesHigh = renewablesSize * renewablesBand.high;

  const stratoBand = getStratoSightBand(stratoSqftTotal);
  const stratoLow = stratoSqftTotal * stratoBand.low;
  const stratoSelected = stratoSqftTotal * stratoBand.selected;
  const stratoHigh = stratoSqftTotal * stratoBand.high;

  const otherLow = otherQty * otherLowRate;
  const otherSelected = otherQty * otherSelectedRate;
  const otherHigh = otherQty * otherHighRate;

  let lowValue = 0;
  let selectedValue = 0;
  let highValue = 0;
  let commercialBasis = '';
  let marketSegment = '';
  let totalMwac = null;
  let totalMwdc = null;
  let estimatedSquareFootage = null;

  if (serviceLine === 'Renewables') {
    lowValue = renewablesLow;
    selectedValue = renewablesSelected;
    highValue = renewablesHigh;
    marketSegment = renewablesSegment;
    commercialBasis = renewablesSegment === 'USS' ? 'MWAC annual' : 'MWDC annual';
    totalMwac = renewablesSegment === 'USS' ? renewablesSize : null;
    totalMwdc = renewablesSegment === 'DG' ? renewablesSize : null;
  } else if (serviceLine === 'StratoSight') {
    lowValue = stratoLow;
    selectedValue = stratoSelected;
    highValue = stratoHigh;
    marketSegment = 'StratoSight';
    commercialBasis = 'Square footage';
    estimatedSquareFootage = stratoSqftTotal;
  } else if (serviceLine === 'Both') {
    lowValue = renewablesLow + stratoLow;
    selectedValue = renewablesSelected + stratoSelected;
    highValue = renewablesHigh + stratoHigh;
    marketSegment = `${renewablesSegment} + StratoSight`;
    commercialBasis = `${renewablesSegment === 'USS' ? 'MWAC annual' : 'MWDC annual'} + Square footage`;
    totalMwac = renewablesSegment === 'USS' ? renewablesSize : null;
    totalMwdc = renewablesSegment === 'DG' ? renewablesSize : null;
    estimatedSquareFootage = stratoSqftTotal;
  } else {
    lowValue = otherLow;
    selectedValue = otherSelected;
    highValue = otherHigh;
    marketSegment = 'Other O&M';
    commercialBasis = 'Custom';
  }

  const forecastCategory = String(newOpportunityForm.forecastCategory || 'Pipeline').trim();
  const weightedPct = forecastCategory === 'Commit'
    ? 0.9
    : forecastCategory === 'Best Case'
    ? 0.6
    : forecastCategory === 'Pipeline'
    ? 0.3
    : 0.5;

  const estimatedEarningsPct = serviceLine === 'Other O&M' ? 30 : 37;
  const estimatedCtsPct = 100 - estimatedEarningsPct;

  const newOpportunity = {
    id: newId,
    name: String(newOpportunityForm.name || 'New Opportunity').trim(),
    account: account?.name || '',
    account_id: String(newOpportunityForm.accountId || '').trim(),
    primary_contact_id: String(newOpportunityForm.primaryContactId || '').trim(),
    primary_contact_name: String(
      newOpportunityForm.primaryContactMode === 'freeform'
        ? (newOpportunityForm.primaryContactName || '')
        : (contact?.fullName || contact?.name || '')
    ).trim(),
    owner_full_name: String(newOpportunityForm.owner || 'Jeff Yarbrough').trim(),
    owner_team_name: String(newOpportunityForm.team || 'NAES').trim(),
    stage: String(newOpportunityForm.stage || '0 Prospecting').trim(),
    forecast_category: forecastCategory,
    probability: Number(newOpportunityForm.probability || 10),
    expected_close_date: String(newOpportunityForm.expectedCloseDate || '').trim(),
    opportunity_type: String(newOpportunityForm.opportunityType || 'New Customer').trim(),
    service_line: serviceLine,
    market_segment: marketSegment,
    commercial_basis: commercialBasis,
    total_mwdc: totalMwdc,
    total_mwac: totalMwac,
    estimated_square_footage: estimatedSquareFootage,
    amount_estimated: selectedValue,
    calc_year1_total: selectedValue,
    calc_arr_total: selectedValue,
    amount_total: selectedValue,
    low_estimate: lowValue,
    high_estimate: highValue,
    weighted_revenue: selectedValue * weightedPct,
    calculated_revenue: selectedValue,
    estimated_earnings_pct: estimatedEarningsPct,
    estimated_cts_pct: estimatedCtsPct,
    account_name: account?.name || '',
    last_activity_date: '',
    staleness_flag: 'Current',
    created_at: dtNow(),
    updated_at: dtNow()
  };

  setOpportunities((current) => [newOpportunity, ...current]);
  setShowNewOpportunityForm(false);
  setNewOpportunityForm(buildOpportunityFormFromRecord());
  openOpportunityDetail(newId);
}

function openOpportunityDetail(opportunityId) {
    const nextPath = `/opportunities/${opportunityId}`;
    pushPath(nextPath);
    setRoutePath(nextPath);
    setActivePage('Opportunities');
  }

  function returnToOpportunitiesOverview() {
    pushPath('/opportunities');
    setRoutePath('/opportunities');
    setActivePage('Opportunities');
  }

  function saveOpportunityPatch(opportunityId, patch) {
    setOpportunities((prev) =>
      prev.map((item) =>
        item.id === opportunityId
          ? { ...item, ...patch }
          : item
      )
    );
  }

  function goBack() {
    setPageHistory((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.slice(0, -1);
      setActivePage(next[next.length - 1] || 'Welcome');
      return next;
    });
  }

  const canGoBack = pageHistory.length > 1;

  return (
    <div style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden', background: '#E8EEEB', color: '#0f172a', fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ display: 'grid', gridTemplateRows: 'minmax(0, 1fr) 46px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '290px 1fr', minHeight: 0, overflow: 'hidden' }}>
        <aside style={{ borderRight: '1px solid #0E545D', background: '#043941', color: '#fff', height: '100%', minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ borderBottom: '1px solid #0E545D', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#19D4D4' }}>
                  NAES CRM
                </div>
                <div style={{ marginTop: '4px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  Operational commercial command
                </div>
              </div>
              <div style={{ border: '1px solid #0F6670', background: '#054E57', borderRadius: '12px', padding: '6px 10px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#19D4D4' }}>
                Live
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>{renderUserPlacard(userProfile)}</div>
          </div>

          <div style={{ padding: '16px 12px 24px 12px' }}>
            <nav style={{ display: 'grid', gap: '14px' }}>
              {visibleSidebarSections.map((section) => (
                <div key={section.title}>
                  <div style={{ marginBottom: '8px', padding: '0 8px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)' }}>
                    {section.title}
                  </div>
                  <div style={{ display: 'grid', gap: '4px' }}>
                    {section.items.map((item) => {
                      const active = item === safeActivePage;
                      return (
                        <button
                          key={item}
                          onClick={() => navigate(item)}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            borderRadius: '18px',
                            padding: '10px 12px',
                            border: 'none',
                            textAlign: 'left',
                            cursor: 'pointer',
                            background: active ? '#0B6771' : 'transparent',
                            color: active ? '#fff' : 'rgba(255,255,255,0.82)',
                            boxShadow: active ? '0 10px 24px rgba(0,0,0,0.28)' : 'none'
                          }}
                        >
                          <span style={{ fontSize: '14px', fontWeight: 500 }}>{item}</span>
                          {active ? <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.8 }}>Active</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main style={{ minWidth: 0, minHeight: 0, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', borderBottom: '1px solid #0E545D', background: '#052F35' }}>
            {topStrip.map((item, idx) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 16px',
                  borderRight: idx < topStrip.length - 1 ? '1px solid #0E545D' : 'none',
                  background: `linear-gradient(180deg, ${item.bg}, #052F35)`
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: item.accent }}>
                  NAES {item.label}
                </div>
              </div>
            ))}
          </div>

          {renderHeaderBand(safeActivePage, goBack, canGoBack, { selectedOpportunity, accountDetailId })}

          <div style={{ padding: '32px' }}>
            {safeActivePage === 'Dashboard'
              ? renderExecutiveDashboard({ accounts: accountList, contacts: contactList, opportunities, onStartNewContact: openWelcomeNewContact, onStartNewAccount: openWelcomeNewAccount, onStartNewOpportunity: openWelcomeNewOpportunity, onOpenOpportunity: openOpportunityDetail })
              : safeActivePage === 'Welcome'
              ? renderWelcomePage({ onStartNewContact: openWelcomeNewContact, onStartNewAccount: openWelcomeNewAccount, onStartNewOpportunity: openWelcomeNewOpportunity })
              : safeActivePage === 'Accounts'
              ? (
                showNewAccountForm
                  ? <NewAccountPage
                      newAccountForm={newAccountForm}
                      onChangeNewAccountField={updateNewAccountField}
                      onSaveNewAccount={saveNewAccount}
                      onCancelNewAccount={cancelNewAccount}
                    />
                  : showEditAccountForm
                  ? <NewAccountPage
                      newAccountForm={newAccountForm}
                      onChangeNewAccountField={updateNewAccountField}
                      onSaveNewAccount={saveEditedAccount}
                      onCancelNewAccount={cancelEditAccount}
                    />
                  : accountDetailId
                  ? <AccountDetailPage
                      accountId={accountDetailId}
                      accounts={accountList}
                      contacts={contactList}
                      opportunities={opportunities}
                      historyEntries={accountHistoryMap[accountDetailId] || []}
                      onBackToAccounts={returnToAccountsOverview}
                      onOpenOpportunity={openOpportunityDetail}
                      onEditAccount={startEditAccount}
                    />
                  : <AccountsOverviewPage
                      accounts={accountList}
                      onOpenAccount={openAccountDetail}
                      onStartNewAccount={startNewAccount}
                    />
              )
              : safeActivePage === 'Contacts'
              ? (
                showNewContactForm
                  ? <NewContactPage
                      newContactForm={newContactForm}
                      accountOptions={accountList}
                      onChangeNewContactField={updateNewContactField}
                      onSaveNewContact={saveNewContact}
                      onCancelNewContact={cancelNewContact}
                    />
                  : showEditContactForm
                  ? <NewContactPage
                      newContactForm={newContactForm}
                      accountOptions={accountList}
                      onChangeNewContactField={updateNewContactField}
                      onSaveNewContact={saveEditedContact}
                      onCancelNewContact={cancelEditContact}
                    />
                  : contactDetailId
                  ? <ContactDetailPage
                      contactId={contactDetailId}
                      contacts={contactList}
                      accounts={accountList}
                      opportunities={opportunities}
                      onBackToContacts={returnToContactsOverview}
                      onOpenAccount={openAccountDetail}
                      onOpenOpportunity={openOpportunityDetail}
                      onEditContact={startEditContact}
                    />
                  : <ContactsOverviewPage
                      contacts={contactList}
                      accounts={accountList}
                      onOpenContact={openContactDetail}
                      onStartNewContact={startNewContact}
                    />
              )
              : safeActivePage === 'My Pipeline'
              ? renderMyPipelinePage({ opportunities, taskList, onOpenOpportunity: openOpportunityDetail })
              : safeActivePage === 'Pipeline Rollup'
              ? renderPipelineRollupPage({ opportunities, onOpenOpportunity: openOpportunityDetail })
              : safeActivePage === 'Revenue Command Center'
              ? renderRevenueCommandCenterPage({ opportunities, onOpenOpportunity: openOpportunityDetail })
              : safeActivePage === 'Forecast Dashboard'
              ? renderForecastDashboardPage({ opportunities, onOpenOpportunity: openOpportunityDetail })
              : safeActivePage === 'Forecast Integrity'
              ? renderForecastIntegrityPage({ opportunities, onOpenOpportunity: openOpportunityDetail })
              : safeActivePage === 'Period Control'
              ? renderPeriodControlPage({ opportunities, onOpenOpportunity: openOpportunityDetail })
              : safeActivePage === 'Client Reports'
              ? <ClientReportsPage opportunities={opportunities} accounts={accountList} contacts={contactList} />
              : safeActivePage === 'Business Reviews'
              ? <BusinessReviewsPage opportunities={opportunities} accounts={accountList} contacts={contactList} tasks={taskList} activities={activityList} />
              : safeActivePage === 'Opportunities'
              ? (
                showNewOpportunityForm
                  ? <NewOpportunityPage
                      newOpportunityForm={newOpportunityForm}
                      accountOptions={accountList}
                      contactOptions={contactList}
                      onChangeNewOpportunityField={updateNewOpportunityField}
                      onSaveNewOpportunity={saveNewOpportunity}
                      onCancelNewOpportunity={cancelNewOpportunity}
                    />
                  : routeInfo.detailId
                  ? <OpportunityDetailPage onBackToOverview={returnToOpportunitiesOverview} opportunity={selectedOpportunity} onSaveOpportunity={saveOpportunityPatch} />
                  : <OpportunitiesOverviewPage onOpenOpportunity={openOpportunityDetail} onStartNewOpportunity={startNewOpportunity} opportunities={opportunities} />
              )
              : safeActivePage === 'Tasks'
              ? (
                showNewTaskForm
                  ? <NewTaskPage
                      newTaskForm={newTaskForm}
                      accountOptions={accountList}
                      contactOptions={contactList}
                      opportunityOptions={opportunities}
                      onChangeNewTaskField={updateNewTaskField}
                      onSaveNewTask={saveNewTask}
                      onCancelNewTask={cancelNewTask}
                    />
                  : showEditTaskForm
                  ? <NewTaskPage
                      newTaskForm={newTaskForm}
                      accountOptions={accountList}
                      contactOptions={contactList}
                      opportunityOptions={opportunities}
                      onChangeNewTaskField={updateNewTaskField}
                      onSaveNewTask={saveEditedTask}
                      onCancelNewTask={cancelEditTask}
                    />
                  : <TasksOverviewPage
                      tasks={taskList}
                      accounts={accountList}
                      contacts={contactList}
                      opportunities={opportunities}
                      onStartNewTask={startNewTask}
                      onOpenTask={openTaskDetail}
                    />
              )
                            : safeActivePage === 'Activities'
              ? (
                showNewActivityForm
                  ? <NewActivityPage
                      newActivityForm={newActivityForm}
                      accountOptions={accountList}
                      contactOptions={contactList}
                      opportunityOptions={opportunities}
                      onChangeNewActivityField={updateNewActivityField}
                      onSaveNewActivity={saveNewActivity}
                      onCancelNewActivity={cancelNewActivity}
                    />
                  : showEditActivityForm
                  ? <NewActivityPage
                      newActivityForm={newActivityForm}
                      accountOptions={accountList}
                      contactOptions={contactList}
                      opportunityOptions={opportunities}
                      onChangeNewActivityField={updateNewActivityField}
                      onSaveNewActivity={saveEditedActivity}
                      onCancelNewActivity={cancelEditActivity}
                    />
                  : <ActivitiesOverviewPage
                      activities={activityList}
                      accounts={accountList}
                      contacts={contactList}
                      opportunities={opportunities}
                      onStartNewActivity={startNewActivity}
                      onOpenActivity={openActivityDetail}
                    />
              )
: safeActivePage === 'Settings'
              ? (
                <SettingsPage
                  userProfile={userProfile}
                  userAccounts={userAccounts}
                  onSaveUserProfile={setUserProfile}
                  onSaveUserAccounts={setUserAccounts}
                />
              )
              : safeActivePage === 'User Accounts'
              ? (
                <UserAccountsPage
                  userAccounts={userAccounts}
                  onSaveUserAccounts={setUserAccounts}
                  onSyncCurrentUserProfile={setUserProfile}
                />
              )
              : (
                <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                  <section style={{ ...naesCardStyle(false), padding: '24px' }}>
                    {smallLabel('Preview Placeholder')}
                    <h2 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: 700, color: naesTheme.text }}>{safeActivePage}</h2>
                    <p style={{ marginTop: '12px', fontSize: '14px', lineHeight: 1.6, color: naesTheme.textMuted, maxWidth: '720px' }}>
                      This section is reserved in the live preview shell and will be built out as we continue wiring the CRM surface area.
                    </p>
                  </section>
                </div>
              )}
          </div>
        </main>
      </div>

      <footer
        style={{
          display: 'grid',
          gridTemplateColumns: '290px minmax(0, 1fr)',
          minHeight: '46px',
          borderTop: '1px solid #0E545D',
          background: '#052F35',
          color: 'rgba(255,255,255,0.88)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
          width: '100%'
        }}
      >
        <div style={{ borderRight: '1px solid #0E545D', background: '#043941' }} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0',
            minWidth: 0,
            width: '100%',
            background: '#052F35'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '28px',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '999px',
                  background: '#B11226',
                  display: 'inline-block',
                  boxShadow: '0 0 0 2px rgba(255,255,255,0.06)'
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.01em' }}>
                Powered by NAES
              </span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '999px',
                  background: '#D6861C',
                  display: 'inline-block',
                  boxShadow: '0 0 0 2px rgba(255,255,255,0.06)'
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.01em' }}>
                Native infrastructure provided by AWS
              </span>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
