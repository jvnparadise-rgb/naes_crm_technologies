import React, { useMemo, useState } from 'react';
import { calculateRenewables, calculateStratoSight, STAGE_MODEL } from './opportunityMathV2';
import { calculateAerialInspectionDeal } from './pricingEngineV2';

function money(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

const tooltipStyle = {
  position: 'absolute',
  left: 0,
  top: '26px',
  width: 360,
  zIndex: 20,
  border: '1px solid #CFE0D2',
  borderRadius: 14,
  background: '#0F1F1A',
  color: '#F8FAFC',
  padding: 12,
  boxShadow: '0 18px 40px rgba(15, 31, 26, 0.22)',
  fontSize: 12,
  lineHeight: 1.45,
};

function InfoTip({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', marginLeft: 6 }}>
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        style={{
          width: 18,
          height: 18,
          borderRadius: 999,
          border: '1px solid #BFD4C5',
          background: '#E8F2EA',
          color: '#24513B',
          fontSize: 11,
          fontWeight: 900,
          cursor: 'help',
        }}
      >
        i
      </button>
      {open ? (
        <div style={tooltipStyle}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>{title}</div>
          <div>{children}</div>
        </div>
      ) : null}
    </span>
  );
}

function Card({ title, subtitle, children }) {
  return (
    <section style={{ border: '1px solid #DCE7DD', borderRadius: 18, background: '#fff', padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#18342a' }}>{title}</h3>
        {subtitle ? <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>{subtitle}</div> : null}
      </div>
      {children}
    </section>
  );
}

function Field({ label, tipTitle, tip, children }) {
  return (
    <label style={{ display: 'grid', gap: 6, minWidth: 0 }}>
      <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b' }}>
        {label}
        {tip ? <InfoTip title={tipTitle || label}>{tip}</InfoTip> : null}
      </span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: '100%',
  border: '1px solid #D8E2D9',
  borderRadius: 12,
  background: '#fff',
  padding: '10px 12px',
  fontSize: 13,
  color: '#0f172a',
  boxSizing: 'border-box',
};

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

function Input({ value, onChange, type = 'text' }) {
  return <input type={type} value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />;
}

function ToggleRow({ label, value, onChange, impact, tipTitle, tip }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'center', borderBottom: '1px solid #EEF2F7', padding: '9px 0' }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: '#18342a' }}>
        {label}
        {tip ? <InfoTip title={tipTitle || label}>{tip}</InfoTip> : null}
      </div>
      <div style={{ fontSize: 12, fontWeight: 900, color: impact >= 0 ? '#9B6A11' : '#2F6B4F' }}>
        {impact > 0 ? `+${impact}%` : `${impact}%`}
      </div>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
    </div>
  );
}

function Metric({ label, value, sub, tone }) {
  return (
    <div style={{ border: '1px solid #E5ECE5', borderRadius: 14, padding: 12, background: tone === 'green' ? '#E8F2EA' : '#FBFCFB' }}>
      <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748b' }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 19, fontWeight: 950, color: '#111827' }}>{value}</div>
      {sub ? <div style={{ marginTop: 4, fontSize: 12, color: '#64748b' }}>{sub}</div> : null}
    </div>
  );
}

function adjustmentFactor(flags) {
  return flags.reduce((factor, item) => factor * (1 + Number(item.impact || 0) / 100), 1);
}

function timelineImpact(timeline) {
  return {
    'Immediate, 0-30 days': { impact: 8, stage: 'Commit', probability: 90 },
    'Short-term, 30-90 days': { impact: 3, stage: 'Commercial Review', probability: 70 },
    'Mid-term, 3-6 months': { impact: 0, stage: 'Proposal', probability: 50 },
    'Long-term, 6-12 months': { impact: -3, stage: 'Discovery', probability: 20 },
    'Exploratory, 12+ months': { impact: -5, stage: 'Qualified', probability: 10 },
  }[timeline] || { impact: 0, stage: 'Solution Fit', probability: 35 };
}

export default function NewDealV2({ onBack }) {
  const [dealName, setDealName] = useState('');
  const [account, setAccount] = useState('');
  const [owner, setOwner] = useState('Megan Smethurst');
  const [serviceLine, setServiceLine] = useState('Renewables');
  const [aerialBaseRate, setAerialBaseRate] = useState(0.07);
  const [aerialMinimumFee, setAerialMinimumFee] = useState(2500);
  const [timeline, setTimeline] = useState('Mid-term, 3-6 months');
  const [termYears, setTermYears] = useState(5);

  const [manualOverrideEnabled, setManualOverrideEnabled] = useState(false);
  const [manualAnnual, setManualAnnual] = useState('');
  const [manualTcv, setManualTcv] = useState('');
  const [manualWeightedTcv, setManualWeightedTcv] = useState('');
  const [manualReason, setManualReason] = useState('');

  const [mw, setMw] = useState('');
  const [basis, setBasis] = useState('MWDC');
  const [renewablesType, setRenewablesType] = useState('Auto');
  const [siteCount, setSiteCount] = useState('');
  const [sqft, setSqft] = useState('');
  const [pricePerSqft, setPricePerSqft] = useState('');
  const [scanFrequency, setScanFrequency] = useState('Annual');

  
  const [omDescription, setOmDescription] = useState('');
  const [omBasis, setOmBasis] = useState('Fixed Fee');
  const [omAnnual, setOmAnnual] = useState(0);
  const [omOneTime, setOmOneTime] = useState(0);
  const [omTerm, setOmTerm] = useState(3);
  const [omConfidence, setOmConfidence] = useState('Medium');
  const [omScopeClarity, setOmScopeClarity] = useState('Rough');
  const [omNotes, setOmNotes] = useState('');

const [flags, setFlags] = useState({
    prevailingWage: false,
    highCostState: false,
    unionLabor: false,
    stringInverters: false,
    highVoltage: false,
    multiOem: false,
    fullOm: false,
    partsIncluded: false,
    vegetation: false,
    advancedReporting: false,
    heavyTravel: false,
    difficultAccess: false,
    harshClimate: false,
    performanceGuarantee: false,
    noEscalation: false,
    net90: false,

    classB: false,
    laancRequired: false,
    waiverRequired: false,
    nightOps: false,
    opsOverPeople: false,
    roofAccessRequired: false,
    liftOrSpecialAccess: false,
    securityClearance: false,
    activeFacility: false,
    fallProtection: false,
    urbanDense: false,
    highObstacleDensity: false,
    limitedLineOfSight: false,
    gpsInterference: false,
    multiBuildingCampus: false,
    thermalRequired: false,
    radiometricThermal: false,
    photogrammetry3d: false,
    polygonSqftMapping: false,
    engineeringReport: false,
    aiAnomalyDetection: false,
    multiSiteAerial: false,
    multiRegionAerial: false,
    sameDayDelivery: false,
    repeatProgramEfficiency: false,
    largeSqftEfficiency: false,
    highInsuranceLimits: false,
    criticalInfrastructure: false,
    strictAcceptanceCriteria: false,
    deadlinePenalties: false,
  });

  const timelineModel = timelineImpact(timeline);

  const flagDefs = [

    { key: 'classB', group: 'Airspace & FAA Authorization', label: 'Class B / complex controlled airspace', impact: 28, tip: 'Controlled airspace near major airports can require additional authorization planning, coordination, and mission constraints.' },
    { key: 'laancRequired', group: 'Airspace & FAA Authorization', label: 'LAANC authorization required', impact: 7, tip: 'FAA low-altitude authorization may be required before flying in controlled airspace.' },
    { key: 'waiverRequired', group: 'Airspace & FAA Authorization', label: 'Waiver required', impact: 25, tip: 'Some missions require special FAA waivers such as night operations, operations over people, or other non-standard conditions.' },
    { key: 'nightOps', group: 'Airspace & FAA Authorization', label: 'Night operations', impact: 15, tip: 'Night flights can increase planning, lighting, pilot requirements, safety controls, and customer coordination.' },
    { key: 'opsOverPeople', group: 'Airspace & FAA Authorization', label: 'Operations over people / traffic exposure', impact: 18, tip: 'Flying near people, vehicles, or public areas increases safety planning and risk controls.' },

    { key: 'roofAccessRequired', group: 'Roof Access & Site Safety', label: 'Roof access required', impact: 8, tip: 'If roof access is required, the project may involve escort, hatch, ladder, fall protection, or site safety planning.' },
    { key: 'liftOrSpecialAccess', group: 'Roof Access & Site Safety', label: 'Lift, ladder, hatch, or special access', impact: 12, tip: 'Special access equipment increases cost, schedule coordination, and safety exposure.' },
    { key: 'securityClearance', group: 'Roof Access & Site Safety', label: 'Security clearance / escort required', impact: 8, tip: 'Secure facilities often require check-in, escorts, badging, training, or restricted work windows.' },
    { key: 'activeFacility', group: 'Roof Access & Site Safety', label: 'Active facility operations', impact: 10, tip: 'Hospitals, warehouses, plants, and distribution centers may require flight windows, traffic control, and operating constraints.' },
    { key: 'fallProtection', group: 'Roof Access & Site Safety', label: 'Fall protection required', impact: 12, tip: 'Work-at-heights controls may be required when personnel access the roof or elevated equipment.' },

    { key: 'urbanDense', group: 'Flight Complexity', label: 'Urban / dense environment', impact: 18, tip: 'Dense locations increase launch constraints, obstacle avoidance, line-of-sight issues, and public exposure.' },
    { key: 'highObstacleDensity', group: 'Flight Complexity', label: 'High obstacle density', impact: 15, tip: 'HVAC units, antennas, cranes, trees, utility lines, and parapets increase mission planning and flight time.' },
    { key: 'limitedLineOfSight', group: 'Flight Complexity', label: 'Limited visual line of sight', impact: 15, tip: 'Line-of-sight limitations may require extra observers, more takeoff zones, or modified mission plans.' },
    { key: 'gpsInterference', group: 'Flight Complexity', label: 'GPS / RF interference risk', impact: 10, tip: 'Metal roofs, industrial equipment, communications gear, or dense structures can affect positioning and mission quality.' },
    { key: 'multiBuildingCampus', group: 'Flight Complexity', label: 'Multi-building campus', impact: 12, tip: 'Multiple buildings increase mobilization, flight planning, data management, and reporting complexity.' },

    { key: 'thermalRequired', group: 'Data Product Requirements', label: 'Thermal imaging required', impact: 15, tip: 'Thermal work requires calibrated equipment, environmental timing, and specialized interpretation.' },
    { key: 'radiometricThermal', group: 'Data Product Requirements', label: 'Radiometric thermal deliverable', impact: 12, tip: 'Radiometric data preserves temperature values for analysis, increasing processing and QA requirements.' },
    { key: 'photogrammetry3d', group: 'Data Product Requirements', label: '3D mesh / photogrammetry', impact: 25, tip: '3D deliverables require denser flight patterns, more images, longer processing time, and stronger QA.' },
    { key: 'polygonSqftMapping', group: 'Data Product Requirements', label: 'Polygon sqft anomaly mapping', impact: 15, tip: 'Damage polygons with sqft estimates require detailed annotation, georeferencing, and QA.' },
    { key: 'engineeringReport', group: 'Data Product Requirements', label: 'Engineering-grade report', impact: 22, tip: 'Higher rigor reports require analysis, narrative, quality review, and customer-ready findings.' },
    { key: 'aiAnomalyDetection', group: 'Data Product Requirements', label: 'AI anomaly detection', impact: 10, tip: 'AI-assisted review adds processing, model inference, QA, and structured defect outputs.' },

    { key: 'multiSiteAerial', group: 'Portfolio & Logistics', label: 'Multi-site program', impact: 10, tip: 'Multiple sites add coordination, scheduling, file management, and travel complexity.' },
    { key: 'multiRegionAerial', group: 'Portfolio & Logistics', label: 'Multi-region travel', impact: 15, tip: 'Multi-region portfolios require travel, scheduling buffers, and field resource coordination.' },
    { key: 'sameDayDelivery', group: 'Portfolio & Logistics', label: 'Same-day / rush delivery', impact: 18, tip: 'Rush delivery compresses processing, QA, and reporting timelines.' },
    { key: 'repeatProgramEfficiency', group: 'Portfolio & Logistics', label: 'Recurring program efficiency', impact: -10, tip: 'Repeat programs may justify a discount due to standardized workflow and repeat mobilization.' },
    { key: 'largeSqftEfficiency', group: 'Portfolio & Logistics', label: 'Large sqft efficiency', impact: -12, tip: 'Large contiguous sqft can reduce unit cost through scale efficiency.' },

    { key: 'highInsuranceLimits', group: 'Aerial Commercial Risk', label: 'High insurance limits', impact: 10, tip: 'Additional insurance requirements can increase project cost and contract risk.' },
    { key: 'criticalInfrastructure', group: 'Aerial Commercial Risk', label: 'Critical infrastructure / sensitive site', impact: 18, tip: 'Sensitive infrastructure increases planning, approvals, security, and liability exposure.' },
    { key: 'strictAcceptanceCriteria', group: 'Aerial Commercial Risk', label: 'Strict deliverable acceptance criteria', impact: 10, tip: 'Strict QA or acceptance terms increase rework risk and reporting burden.' },
    { key: 'deadlinePenalties', group: 'Aerial Commercial Risk', label: 'Deadline penalties / LD exposure', impact: 15, tip: 'Penalty-backed delivery commitments increase risk and should be priced accordingly.' },

    { key: 'prevailingWage', group: 'Labor & Regulatory', label: 'Prevailing wage required', impact: 14, tip: 'Government or contract-mandated wage rates such as Davis-Bacon or local prevailing wage. Raises labor cost and may require certified payroll.' },
    { key: 'highCostState', group: 'Labor & Regulatory', label: 'High-cost state / region', impact: 12, tip: 'Accounts for labor, lodging, subcontractor, permitting, and mobilization cost differences. California is materially different from Iowa or Arizona.' },
    { key: 'unionLabor', group: 'Labor & Regulatory', label: 'Union / special licensing requirements', impact: 8, tip: 'Captures labor restrictions, local licensing, or special credential requirements that limit who can perform the work.' },
    { key: 'stringInverters', group: 'Asset Complexity', label: 'String-heavy inverter architecture', impact: 7, tip: 'String inverter sites can create more device-level events and troubleshooting points than a small number of central inverters.' },
    { key: 'highVoltage', group: 'Asset Complexity', label: 'High-voltage / 1500V complexity', impact: 8, tip: 'Higher voltage systems require stricter safety controls, qualified labor, switching discipline, and PPE alignment.' },
    { key: 'multiOem', group: 'Asset Complexity', label: 'Mixed OEM / aging equipment', impact: 9, tip: 'Multiple manufacturers or older assets increase troubleshooting time, spare-part complexity, and technician training requirements.' },
    { key: 'fullOm', group: 'Operational Scope', label: 'Full O&M, not PM-only', impact: 20, tip: 'Full O&M includes broader responsibility than preventive maintenance. It often includes corrective maintenance coordination, response, reporting, and owner support.' },
    { key: 'partsIncluded', group: 'Operational Scope', label: 'Parts included or bundled', impact: 14, tip: 'If NAES carries parts risk, pricing must reflect inventory, procurement, obsolescence, and replacement exposure.' },
    { key: 'vegetation', group: 'Operational Scope', label: 'Vegetation / civil scope included', impact: 10, tip: 'Vegetation, civil cleanup, or access upkeep adds recurring field labor and subcontractor management.' },
    { key: 'advancedReporting', group: 'Operational Scope', label: 'Advanced reporting / engineering package', impact: 7, tip: 'Higher reporting requirements increase analyst, engineering, QA, and customer success effort.' },
    { key: 'heavyTravel', group: 'Logistics & Geography', label: 'Distributed sites / heavy travel', impact: 12, tip: 'Many small sites or long distance between assets creates truck-roll inefficiency and lowers technician utilization.' },
    { key: 'difficultAccess', group: 'Logistics & Geography', label: 'Difficult access or work at heights', impact: 9, tip: 'Rooftops, restricted facilities, bad roads, security check-ins, or elevated equipment can materially increase labor time and safety planning.' },
    { key: 'harshClimate', group: 'Logistics & Geography', label: 'Harsh climate exposure', impact: 6, tip: 'Extreme heat, snow, coastal corrosion, dust, or storm exposure can increase failure rates and field effort.' },
    { key: 'performanceGuarantee', group: 'Commercial Risk', label: 'Performance guarantee / LD exposure', impact: 18, tip: 'Availability guarantees, production guarantees, or liquidated damages create downside risk if site conditions or customer dependencies affect performance.' },
    { key: 'noEscalation', group: 'Commercial Risk', label: 'No escalation clause', impact: 7, tip: 'An escalation clause defines how price increases over time. None means fixed pricing, which can erode margin as labor and materials inflate.' },
    { key: 'net90', group: 'Commercial Risk', label: 'Extended payment terms, Net 60/90+', impact: 5, tip: 'Long payment terms create cash-flow burden and working-capital risk. Net 30 is standard, Net 90 should usually price higher.' },
  ];

  const enabledFlags = flagDefs.filter((item) => flags[item.key]);
  const baseRenewables = calculateRenewables({ mw, basis, type: renewablesType, termYears, stage: timelineModel.stage });
  const baseStrato = calculateStratoSight({ sqft, pricePerSqft, termYears, stage: timelineModel.stage });

  const aerialFlags = {
    airspace: [
      flags.classB && 'classB',
      flags.laancRequired && 'laancRequired',
      flags.waiverRequired && 'waiverRequired',
      flags.nightOps && 'nightOps',
      flags.opsOverPeople && 'opsOverPeople',
    ].filter(Boolean),
    accessSafety: [
      flags.roofAccessRequired && 'roofAccessRequired',
      flags.liftOrSpecialAccess && 'liftOrSpecialAccess',
      flags.securityClearance && 'securityClearance',
      flags.activeFacility && 'activeFacility',
      flags.fallProtection && 'fallProtection',
    ].filter(Boolean),
    flightComplexity: [
      flags.urbanDense && 'urbanDense',
      flags.highObstacleDensity && 'highObstacleDensity',
      flags.limitedLineOfSight && 'limitedLineOfSight',
      flags.gpsInterference && 'gpsInterference',
      flags.multiBuildingCampus && 'multiBuildingCampus',
    ].filter(Boolean),
    dataProduct: [
      flags.thermalRequired && 'thermalRequired',
      flags.radiometricThermal && 'radiometricThermal',
      flags.photogrammetry3d && 'photogrammetry3d',
      flags.polygonSqftMapping && 'polygonSqftMapping',
      flags.engineeringReport && 'engineeringReport',
      flags.aiAnomalyDetection && 'aiAnomalyDetection',
    ].filter(Boolean),
    portfolioLogistics: [
      flags.multiSiteAerial && 'multiSite',
      flags.multiRegionAerial && 'multiRegion',
      flags.sameDayDelivery && 'sameDayDelivery',
      flags.repeatProgramEfficiency && 'repeatProgramEfficiency',
      flags.largeSqftEfficiency && 'largeSqftEfficiency',
    ].filter(Boolean),
    aerialCommercialRisk: [
      flags.highInsuranceLimits && 'highInsuranceLimits',
      flags.criticalInfrastructure && 'criticalInfrastructure',
      flags.strictAcceptanceCriteria && 'strictAcceptanceCriteria',
      flags.deadlinePenalties && 'deadlinePenalties',
    ].filter(Boolean),
  };

  
    const frequencyMultiplier = scanFrequency === 'One-time' ? 1 :
                                scanFrequency === 'Annual' ? 1 :
                                scanFrequency === 'Semi-Annual' ? 2 :
                                scanFrequency === 'Quarterly' ? 4 : 1;
const baseAerial = calculateAerialInspectionDeal({
    sqft,
    baseRatePerSqft: pricePerSqft,
    minimumFee: aerialMinimumFee,
    flags: aerialFlags,
    timeline: timeline === 'Immediate, 0-30 days' ? 'immediate' : timeline === 'Short-term, 30-90 days' ? 'short' : timeline === 'Long-term, 6-12 months' ? 'long' : timeline === 'Exploratory, 12+ months' ? 'exploratory' : 'mid',
    termYears
  });
  const isAerial = (serviceLine || '').includes('StratoSight') || (serviceLine || '').includes('Infrastructure');
  const baseAnnual = isAerial
      ? (baseAerial.finalAnnual * frequencyMultiplier)
      : baseRenewables.annual.target;
  const factor = adjustmentFactor([...enabledFlags, { impact: timelineModel.impact }]);
  const suggestedAnnual = baseAnnual * factor;
  const suggestedTcv = suggestedAnnual * Number(termYears || 1);
  const weightedAcv = suggestedAnnual * (timelineModel.probability / 100);
  const weightedTcv = suggestedTcv * (timelineModel.probability / 100);

  const effectiveAnnual = manualOverrideEnabled && manualAnnual !== '' ? Number(manualAnnual || 0) : suggestedAnnual;
  const effectiveTcv = manualOverrideEnabled && manualTcv !== '' ? Number(manualTcv || 0) : suggestedTcv;
  const effectiveWeightedTcv = manualOverrideEnabled && manualWeightedTcv !== '' ? Number(manualWeightedTcv || 0) : weightedTcv;

  const pvGroups = new Set([
    'Labor & Regulatory',
    'Asset Complexity',
    'Operational Scope',
    'Logistics & Geography',
    'Commercial Risk',
    'Workforce Model',
    'SLA & Response',
    'Data & Technology',
    'Mobilization / Transition',
    'Customer Profile',
    'Financial Structure',
    'Competitive Pressure'
  ]);

  const aerialGroups = new Set([
    'Airspace & FAA Authorization',
    'Roof Access & Site Safety',
    'Flight Complexity',
    'Data Product Requirements',
    'Portfolio & Logistics',
    'Aerial Commercial Risk'
  ]);

  const activeFlagDefs = flagDefs.filter((item) => {
    if (serviceLine === 'Bundled') return true;
    if (serviceLine === 'StratoSight' || serviceLine === 'Infrastructure') {
      return aerialGroups.has(item.group);
    }
    if (serviceLine === 'Other O&M') return false;
    return pvGroups.has(item.group);
  });

  const grouped = activeFlagDefs.reduce((acc, item) => {
    acc[item.group] ||= [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gap: 16, color: '#18342a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 950, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#54745D' }}>New Deal</div>
          <h1 style={{ margin: '6px 0 0 0', fontSize: 26 }}>Guided Deal Builder</h1>
          <div style={{ marginTop: 4, fontSize: 13, color: '#64748b' }}>Capture scope, risk, timeline, and pricing assumptions before creating the opportunity.</div>
        </div>
        <button onClick={onBack} style={{ border: '1px solid #DCE7DD', borderRadius: 14, padding: '10px 14px', background: '#FBFCFB', fontWeight: 800 }}>Back</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.65fr) minmax(360px, 0.85fr)', gap: 16 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <Card title="Deal Intent" subtitle="This drives stage suggestion, urgency, and forecast probability.">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
              <Field label="Deal Name"><Input value={dealName} onChange={setDealName} /></Field>
              <Field label="Account"><Input value={account} onChange={setAccount} /></Field>
              <Field label="Owner"><Input value={owner} onChange={setOwner} /></Field>
              <Field label="Service Line"><Select value={serviceLine} onChange={setServiceLine} options={['Renewables', 'StratoSight', 'Infrastructure', 'Other O&M']} /></Field>
              <Field label="Start Timeline" tipTitle="Start Timeline" tip="Defines when the customer wants service to begin. Immediate starts can justify urgency pricing and usually imply a later-stage opportunity. Exploratory timing usually belongs earlier in pipeline."><Select value={timeline} onChange={setTimeline} options={['Immediate, 0-30 days', 'Short-term, 30-90 days', 'Mid-term, 3-6 months', 'Long-term, 6-12 months', 'Exploratory, 12+ months']} /></Field>
              <Field label="Term Years"><Input value={termYears} onChange={setTermYears} type="number" /></Field>
            </div>
          </Card>

          <Card title="Physical Scope" subtitle="Core sizing inputs used to establish the base commercial value.">
            {isAerial ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                <Field label="Total SqFt" tip="Total inspected square footage. This is the primary StratoSight pricing driver."><Input value={sqft} onChange={setSqft} type="number" placeholder="Example: 134000" /></Field>
                <Field label="Price / SqFt" tip="Base price per square foot before complexity and risk adjustments."><Input value={pricePerSqft} onChange={setPricePerSqft} type="number" placeholder="Example: 0.07" /></Field>
                <Field label="Scan Frequency"><Select value={scanFrequency} onChange={setScanFrequency} options={['One-time', 'Annual', 'Semi-Annual', 'Quarterly']} /></Field>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
                <Field label="MW Size" tip="Enter the known project size. The basis field converts MWAC to MWDC for pricing consistency."><Input value={mw} onChange={setMw} type="number" placeholder="Example: 16.4" /></Field>
                <Field label="Basis"><Select value={basis} onChange={setBasis} options={['MWDC', 'MWAC']} /></Field>
                <Field label="DG / USS"><Select value={renewablesType} onChange={setRenewablesType} options={['Auto', 'DG', 'USS']} /></Field>
                <Field label="Site Count"><Input value={siteCount} onChange={setSiteCount} type="number" placeholder="Example: 33" /></Field>
              </div>
            )}
          </Card>

          {serviceLine === 'Other O&M' ? (
            <Card title="Other O&M — Manual Quote Builder" subtitle="Capture scope, structure, and risk. System will compute TCV/weighted outputs.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
                <Field label="Service Description"><Input value={omDescription} onChange={setOmDescription} /></Field>
                <Field label="Pricing Basis">
                  <Select value={omBasis} onChange={setOmBasis} options={['Fixed Fee','T&M','Unit Rate','Monthly Retainer','One-Time']} />
                </Field>
                <Field label="Term Years"><Input value={omTerm} onChange={setOmTerm} type="number" /></Field>

                <Field label="Estimated Annual Revenue"><Input value={omAnnual} onChange={setOmAnnual} type="number" /></Field>
                <Field label="One-Time Revenue"><Input value={omOneTime} onChange={setOmOneTime} type="number" /></Field>
                <Field label="Confidence">
                  <Select value={omConfidence} onChange={setOmConfidence} options={['Low','Medium','High']} />
                </Field>

                <Field label="Scope Clarity">
                  <Select value={omScopeClarity} onChange={setOmScopeClarity} options={['Unknown','Rough','Defined','Customer-validated']} />
                </Field>
                <Field label="Notes (quote assumptions)"><Input value={omNotes} onChange={setOmNotes} /></Field>
              </div>

              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12 }}>
                <Metric label="Annual" value={money(omAnnual)} />
                <Metric label="One-Time" value={money(omOneTime)} />
                <Metric label="TCV" value={money(Number(omAnnual||0)*Number(omTerm||0) + Number(omOneTime||0))} sub={`${omTerm} year term`} />
                <Metric label="Weighted TCV" value={money((Number(omAnnual||0)*Number(omTerm||0) + Number(omOneTime||0)) * (timelineModel.probability/100))} tone="green" />
              </div>
            </Card>
          ) : null}

          <Card title="Manual Commercial Override" subtitle="Use only when the customer-approved deal economics differ from the model recommendation.">
            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, fontWeight: 800 }}>
                <input
                  type="checkbox"
                  checked={manualOverrideEnabled}
                  onChange={(e) => setManualOverrideEnabled(e.target.checked)}
                />
                Override calculated commercial output
              </label>

              {manualOverrideEnabled ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12 }}>
                  <Field label="Override Annual Revenue">
                    <Input value={manualAnnual} onChange={setManualAnnual} type="number" placeholder={String(Math.round(suggestedAnnual || 0))} />
                  </Field>
                  <Field label="Override TCV">
                    <Input value={manualTcv} onChange={setManualTcv} type="number" placeholder={String(Math.round(suggestedTcv || 0))} />
                  </Field>
                  <Field label="Override Weighted TCV">
                    <Input value={manualWeightedTcv} onChange={setManualWeightedTcv} type="number" placeholder={String(Math.round(weightedTcv || 0))} />
                  </Field>
                  <Field label="Override Reason">
                    <Input value={manualReason} onChange={setManualReason} placeholder="Example: customer-approved PO amount" />
                  </Field>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: '#64748b' }}>
                  Current model output will be used unless override is enabled.
                </div>
              )}
            </div>
          </Card>

          {Object.entries(grouped).map(([group, items]) => (
            <Card key={group} title={group} subtitle="Select only what applies. Each selection updates the pricing model.">
              {items.map((item) => (
                <ToggleRow
                  key={item.key}
                  label={item.label}
                  value={flags[item.key]}
                  impact={item.impact}
                  tip={item.tip}
                  onChange={(checked) => setFlags((prev) => ({ ...prev, [item.key]: checked }))}
                />
              ))}
            </Card>
          ))}
        </div>

        <div style={{ position: 'sticky', top: 12, alignSelf: 'start', display: 'grid', gap: 12 }}>
          <Card title="Live Commercial Output" subtitle="Explainable price recommendation based on inputs.">
            <div style={{ display: 'grid', gap: 10 }}>
              <Metric label="Base Annual" value={money(baseAnnual)} />
              <Metric label="Adjustment Factor" value={`${((factor - 1) * 100).toFixed(1)}%`} sub={`${enabledFlags.length} selected drivers + timeline`} />
              <Metric label="Suggested Annual" value={money(effectiveAnnual)} tone="green" />
              <Metric label="Suggested TCV" value={money(effectiveTcv)} sub={`${termYears} year term`} />
              <Metric label="Stage Suggested" value={timelineModel.stage} sub={`${timelineModel.probability}% probability`} />
              <Metric label="Weighted TCV" value={money(effectiveWeightedTcv)} tone="green" />
            </div>
          </Card>

          <Card title="Adjustment Breakdown">
            <div style={{ display: 'grid', gap: 7 }}>
              {[...enabledFlags, { label: `Timeline: ${timeline}`, impact: timelineModel.impact }].map((item) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, borderBottom: '1px solid #EEF2F7', paddingBottom: 6 }}>
                  <span>{item.label}</span>
                  <strong>{item.impact > 0 ? '+' : ''}{item.impact}%</strong>
                </div>
              ))}
              {!enabledFlags.length && timelineModel.impact === 0 ? <div style={{ fontSize: 13, color: '#64748b' }}>No adjustments selected.</div> : null}
            </div>
          </Card>

          <button
            type="button"
            style={{ border: 0, borderRadius: 16, background: '#0B6771', color: '#fff', padding: '14px 16px', fontWeight: 950, fontSize: 14, cursor: 'pointer' }}
          >
            Create Opportunity
          </button>
        </div>
      </div>
    </div>
  );
}
