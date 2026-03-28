import { listTopLevelPages, listChildPages } from '../../../src/registry/index.js';

export function loadPageContract() {
  return {
    topLevelPages: listTopLevelPages(),
    nestedPages: {
      welcome: listChildPages('welcome'),
      accounts: listChildPages('accounts')
    }
  };
}
