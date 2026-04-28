import React, { useMemo, useState } from 'react';
import { calculateRenewables, calculateStratoSight, STAGE_MODEL } from './opportunityMathV2';

function money(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function n(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function Card({ title, children }) {
  return (
    <section style={{ border: '1px solid #DCE7DD', borderRadius: 18, background: '#fff', padding: 16 }}>
      {title ? <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 800 }}>{title}</h3> : null}
      {children}
    </section>
  );
}

function Metric({ label, value, sub }) {
  return (
    <div style={{ border: '1px solid #E5ECE5', borderRadius: 14, padding: 12, background: '#FBFCFB' }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 20, fontWeight: 900, color: '#111827' }}>{value}</div>
      {sub ? <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>{sub}</div> : null}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: 6, fontSize: 12, fontWeight: 800, color: '#334155' }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #DCE7DD',
  borderRadius: 12,
  padding: '10px 11px',
  fontSize: 13,
  background: '#FBFCFB',
  color: '#111827'
};

const stageLabels = STAGE_MODEL.map((s) => s.label);

export default function OpportunityDetailV2({ opportunity = {}, users = [], onBack, onSaveOpportunity }) {
  if (!opportunity || !opportunity.id) {
    return (
      <div style={{ padding: 40 }}>
        <h2>V2 Opportunity</h2>
        <p>Opportunity not found or still loading.</p>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  const initialServiceLine =
    opportunity.service_line === 'StratoSight' ||
    opportunity.market_segment === 'StratoSight' ||
    opportunity.scope_type === 'StratoSight'
      ? 'StratoSight'
      : 'Renewables';

  const [mode, setMode] = useState(initialServiceLine);
  const [stage, setStage] = useState(opportunity.stage || 'Solution Fit');
  const [forecastCategory, setForecastCategory] = useState(opportunity.forecast_category || 'Pipeline');
  const [expectedCloseDate, setExpectedCloseDate] = useState(opportunity.expected_close_date || '');
    const [ownerName, setOwnerName] = useState(opportunity.owner_full_name || opportunity.ownerName || opportunity.owner || '');
  const ownerOptions = useMemo(() => {
    const currentOwner = String(ownerName || '').trim();
    const names = (Array.isArray(users) ? users : [])
      .filter((user) => String(user?.status || 'Active').trim().toLowerCase() !== 'inactive')
      .map((user) => String(user?.fullName || user?.name || '').trim())
      .filter(Boolean);

    return Array.from(new Set([currentOwner, ...names].filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [users, ownerName]);

  const [changeReason, setChangeReason] = useState('');
  const [stageHistory, setStageHistory] = useState([]);

  const [mw, setMw] = useState(opportunity.total_mwdc || '');
  const [basis, setBasis] = useState(opportunity.capacity_basis || 'MWDC');
  const [renewablesType, setRenewablesType] = useState(opportunity.market_segment || 'Auto');
  const [sqft, setSqft] = useState(opportunity.estimated_square_footage || '');
  const [pricePerSqft, setPricePerSqft] = useState(opportunity.price_per_sqft || 0.07);
  const [termYears, setTermYears] = useState(opportunity.term_years || 5);

  const renewables = useMemo(
    () => calculateRenewables({ mw: n(mw), basis, type: renewablesType, termYears: n(termYears, 5), stage }),
    [mw, basis, renewablesType, termYears, stage]
  );

  const strato = useMemo(
    () => calculateStratoSight({ sqft: n(sqft), pricePerSqft: n(pricePerSqft, 0.07), termYears: n(termYears, 5), stage }),
    [sqft, pricePerSqft, termYears, stage]
  );

  const active = mode === 'StratoSight' ? strato : renewables;

  function recordChange(field, from, to) {
    if (from === to) return true;

    if (!changeReason.trim()) {
      alert('Please enter a reason before changing stage, forecast, or close date.');
      return false;
    }

    setStageHistory((prev) => [
      {
        field,
        from,
        to,
        reason: changeReason.trim(),
        user: 'Jeff Yarbrough',
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
    setChangeReason('');
    return true;
  }

  function handleSave() {
    if (!onSaveOpportunity) return;

    const rawRevenue =
      mode === 'StratoSight'
        ? Number(strato.tcv || strato.annual || 0)
        : Number(renewables?.tcv?.target || renewables?.annual?.target || 0);

    const probability = Number(active?.probability || 0);
    const weightedRevenue = rawRevenue * (probability / 100);

    const patch = {
      stage,
      probability,
      forecast_probability: probability,
      forecast_category: forecastCategory,
      expected_close_date: expectedCloseDate,
        owner_full_name: ownerName,
        ownerName: ownerName,
        owner: ownerName,
      service_line: mode,
      market_segment: mode === 'StratoSight' ? 'StratoSight' : renewablesType,
      total_mwdc: mode === 'Renewables' ? Number(mw) || 0 : null,
      estimated_square_footage: mode === 'StratoSight' ? Number(sqft) || 0 : null,
      price_per_sqft: mode === 'StratoSight' ? Number(pricePerSqft) || 0 : null,
      term_years: Number(termYears) || 1,
      calculated_revenue: rawRevenue,
      amount_total: rawRevenue,
      amount_estimated: rawRevenue,
      weighted_revenue: weightedRevenue,
      amount_weighted: weightedRevenue
    };

    onSaveOpportunity(opportunity.id, patch);
    alert('Saved successfully');
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#54745D' }}>Opportunity Workspace</div>
          <h1 style={{ margin: '6px 0 0 0', fontSize: 24 }}>{opportunity.name || 'Opportunity Command Center'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSave} style={{ border: '1px solid #0E545D', borderRadius: 14, padding: '10px 14px', background: '#0E545D', color: '#fff', fontWeight: 900 }}>Save</button>
          <button onClick={onBack} style={{ border: '1px solid #DCE7DD', borderRadius: 14, padding: '10px 14px', background: '#FBFCFB', fontWeight: 800 }}>Back</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(340px, 0.95fr)', gap: 16 }}>
        <Card title="Commercial Engine">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
            <Field label="Service">
              <select style={inputStyle} value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>Renewables</option>
                <option>StratoSight</option>
              </select>
            </Field>

            <Field label="Stage">
              <select
                style={inputStyle}
                value={stage}
                onChange={(e) => {
                  const nextStage = e.target.value;
                  if (recordChange('Stage', stage, nextStage)) setStage(nextStage);
                }}
              >
                {stageLabels.map((label) => <option key={label}>{label}</option>)}
              </select>
            </Field>

              <Field label="Opportunity Owner">
                  <select
                    style={inputStyle}
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                  >
                    <option value="">Select owner</option>
                    {ownerOptions.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </Field>

            <Field label="Term Years">
              <input style={inputStyle} value={termYears} onChange={(e) => setTermYears(e.target.value)} />
            </Field>

            {mode === 'StratoSight' ? (
              <>
                <Field label="Total SqFt">
                  <input style={inputStyle} value={sqft} onChange={(e) => setSqft(e.target.value)} placeholder="Example: 134000" />
                </Field>
                <Field label="Price / SqFt">
                  <input style={inputStyle} value={pricePerSqft} onChange={(e) => setPricePerSqft(e.target.value)} placeholder="Example: 0.07" />
                </Field>
              </>
            ) : (
              <>
                <Field label="Portfolio Type">
                  <select style={inputStyle} value={renewablesType} onChange={(e) => setRenewablesType(e.target.value)}>
                    <option>Auto</option>
                    <option>DG</option>
                    <option>USS</option>
                  </select>
                </Field>
                <Field label="MW Size">
                  <input style={inputStyle} value={mw} onChange={(e) => setMw(e.target.value)} placeholder="Example: 16.4" />
                </Field>
                <Field label="Capacity Basis">
                  <select style={inputStyle} value={basis} onChange={(e) => setBasis(e.target.value)}>
                    <option>MWDC</option>
                    <option>MWAC</option>
                  </select>
                </Field>
              </>
            )}
          </div>
        </Card>

        <Card title="Forecast Governance">
          <div style={{ display: 'grid', gap: 12 }}>
            <Field label="Change Reason Required">
              <input
                style={inputStyle}
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Explain why stage, forecast, or close date is changing"
              />
            </Field>

            <Field label="Forecast Category">
              <select
                style={inputStyle}
                value={forecastCategory}
                onChange={(e) => {
                  const nextForecast = e.target.value;
                  if (recordChange('Forecast Category', forecastCategory, nextForecast)) setForecastCategory(nextForecast);
                }}
              >
                <option>Pipeline</option>
                <option>Best Case</option>
                <option>Commit</option>
                <option>Closed Won</option>
                <option>Closed Lost</option>
              </select>
            </Field>

            <Field label="Expected Close Date">
              <input
                style={inputStyle}
                type="date"
                value={expectedCloseDate}
                onChange={(e) => {
                  const nextCloseDate = e.target.value;
                  if (recordChange('Expected Close Date', expectedCloseDate || 'Blank', nextCloseDate || 'Blank')) setExpectedCloseDate(nextCloseDate);
                }}
              />
            </Field>

            <Metric label="Stage Probability" value={`${active.probability}%`} />
            <Metric label="Weighted ACV" value={money(active.weightedAcv)} />
            <Metric label="Weighted TCV" value={money(active.weightedTcv)} />
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
        {mode === 'StratoSight' ? (
          <>
            <Metric label="Annual Revenue" value={money(strato.annual)} />
            <Metric label="TCV" value={money(strato.tcv)} sub={`${termYears} year term`} />
            <Metric label="Weighted TCV" value={money(strato.weightedTcv)} />
            <Metric label="Price / SqFt" value={`$${pricePerSqft || 0}`} />
          </>
        ) : (
          <>
            <Metric label="Class" value={renewables.type} sub={`${renewables.mwdc.toFixed(1)} MWdc`} />
            <Metric label="Annual Target" value={money(renewables.annual.target)} />
            <Metric label="Target TCV" value={money(renewables.tcv.target)} />
            <Metric label="Weighted TCV" value={money(renewables.weightedTcv)} />
          </>
        )}
      </div>

      <Card title="Stage History / Governance Audit Trail">
        {stageHistory.length === 0 ? (
          <div style={{ fontSize: 13, color: '#64748b' }}>No governed changes made in this session.</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {stageHistory.map((h, i) => (
              <div key={`${h.timestamp}-${i}`} style={{ border: '1px solid #E5ECE5', borderRadius: 12, padding: 10, background: '#FBFCFB', fontSize: 13 }}>
                <strong>{h.field}: {h.from} → {h.to}</strong>
                <div style={{ marginTop: 4, color: '#334155' }}>{h.reason}</div>
                <div style={{ marginTop: 4, color: '#64748b', fontSize: 12 }}>{h.user} • {new Date(h.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Executive Analytics">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          <Metric label="Raw vs Weighted" value={`${money(mode === 'StratoSight' ? strato.tcv : renewables.tcv.target)} / ${money(active.weightedTcv)}`} />
          <Metric label="Forecast Category" value={forecastCategory} />
          <Metric label="Risk Compression" value={`${100 - active.probability}%`} sub="Unweighted exposure" />
        </div>
      </Card>
    </div>
  );
}
