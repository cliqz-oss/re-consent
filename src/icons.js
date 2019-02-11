import browser from 'webextension-polyfill';
import { checkIsChrome } from './utils';
import { APPLICATION_STATE_ICON_NAME } from './constants';

const isChrome = checkIsChrome();
const sizes = isChrome ? [16, 24, 32] : [19, 38];
const suffix = isChrome ? '-chrome.png' : '-cliqz.png';

function doSetBrowserExtensionIcon(tabId, pathTemplate) {
  const iconSet = {};

  sizes.forEach((size) => {
    iconSet[size] = pathTemplate.replace('{size}', `${size}x${size}`).replace('{suffix}', suffix);
  });

  browser.pageAction.setIcon({
    path: iconSet,
    tabId,
  });
}

export default async function setBrowserExtensionIcon(applicationState, tabId) {
  const iconName = APPLICATION_STATE_ICON_NAME[applicationState];
  doSetBrowserExtensionIcon(tabId, `icons/png/{size}_consent-${iconName}{suffix}`);
}
