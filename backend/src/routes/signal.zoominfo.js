const express = require('express');

const router = express.Router();

router.post('/search', async (req, res) => {
  try {
    const { query, filters } = req.body || {};

    console.log('[ZoomInfo Search] Incoming query:', query, filters || {});

    const results = [
      {
        company: 'GridStone Energy Partners',
        industry: 'Renewable Energy',
        hq: 'Austin, TX',
        employees: '501-1,000',
        revenue: '$250M-$500M',
        serviceFit: 'Renewables',
        contacts: [
  {
    firstName: "John",
    lastName: "Carter",
    title: "Director of Operations",
    email: "john.carter@gridstoneenergy.com",
    mobilePhone: "(512) 555-0199",
    linkedin: "https://linkedin.com/in/johncarter"
  },
  {
    firstName: "Melissa",
    lastName: "Grant",
    title: "VP Asset Management",
    email: "melissa.grant@gridstoneenergy.com",
    mobilePhone: "(512) 555-0112",
    linkedin: "https://linkedin.com/in/melissagrant"
  }
],
        confidence: 'High',
        buyingSignal: 'Expanding distributed generation portfolio across priority Sun Belt markets.',
        estimatedRevenue: '$465K',
        sourceStatus: 'Backend Preview'
      },
      {
        company: 'NorthPeak Logistics REIT',
        industry: 'Logistics / Industrial Real Estate',
        hq: 'Dallas, TX',
        employees: '1,001-5,000',
        revenue: '$1B+',
        serviceFit: 'StratoSight',
        contacts: [
  {
    firstName: "David",
    lastName: "Nguyen",
    title: "Head of Facilities",
    email: "david.nguyen@northpeakreit.com",
    mobilePhone: "(214) 555-0188",
    linkedin: "https://linkedin.com/in/davidnguyen"
  }
],
        confidence: 'Very High',
        buyingSignal: 'Large industrial rooftop footprint with multi-site inspection opportunity.',
        estimatedRevenue: '$720K',
        sourceStatus: 'Backend Preview'
      }
    ];

    return res.json({
      success: true,
      mode: 'preview',
      query: query || '',
      results
    });
  } catch (err) {
    console.error('ZoomInfo search error:', err);
    return res.status(500).json({ success: false, error: 'ZoomInfo search failed' });
  }
});

module.exports = router;
