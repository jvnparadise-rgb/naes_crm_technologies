import { topStripThemeTokens } from './topStripThemeTokens.js';

export function createTopStripModel() {
  return [
    {
      id: 'technologies',
      label: 'NAES Technologies',
      ...topStripThemeTokens.technologies
    },
    {
      id: 'renewables',
      label: 'NAES Renewables',
      ...topStripThemeTokens.renewables
    },
    {
      id: 'stratosight',
      label: 'NAES StratoSight',
      ...topStripThemeTokens.stratosight
    }
  ];
}
