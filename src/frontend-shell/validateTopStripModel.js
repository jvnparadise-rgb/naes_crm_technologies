import { createTopStripModel } from './topStripModel.js';

export function validateTopStripModel() {
  const strip = createTopStripModel();

  if (!Array.isArray(strip) || strip.length !== 3) {
    throw new Error('Top strip must contain exactly 3 segments.');
  }

  const labels = strip.map(item => item.label);
  const expected = ['NAES Technologies', 'NAES Renewables', 'NAES StratoSight'];

  for (let i = 0; i < expected.length; i += 1) {
    if (labels[i] !== expected[i]) {
      throw new Error(`Top strip label mismatch at position ${i + 1}.`);
    }
  }

  return {
    ok: true,
    labels,
    segmentCount: strip.length
  };
}
