import { listTopLevelPages, listChildPages } from '../registry/index.js';

export function buildPageShellModel() {
  return {
    topLevelPages: listTopLevelPages(),
    nestedGroups: {
      welcome: listChildPages('welcome'),
      accounts: listChildPages('accounts')
    }
  };
}
