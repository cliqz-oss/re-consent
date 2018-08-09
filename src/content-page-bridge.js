/* eslint-disable no-underscore-dangle */

import CONSENT_WHITE_LIST from './consent/whitelist';

function queryCmp(method) {
  return new Promise((resolve) => {
    window.__cmp(method, null, resolve);
  });
}

const sendConsentMessage = (consent) => {
  window.postMessage({
    source: 'content-page-bridge',
    type: 'receivedConsent',
    consent,
  }, '*');
};

async function cmpCheck(retries) {
  const url = window.location;
  const isWhiteListed = CONSENT_WHITE_LIST.some(domain => url.hostname.indexOf(domain) !== -1);

  if (isWhiteListed) {
    sendConsentMessage(null);
    return;
  }

  if (window.__cmp === undefined) {
    if (retries > 0) {
      setTimeout(() => cmpCheck(retries - 1), 5000);
    } else {
      sendConsentMessage(null);
    }
    return;
  }

  const consentData = await queryCmp('getConsentData');
  const vendorConsents = await queryCmp('getVendorConsents');
  const vendorList = await queryCmp('getVendorList');

  sendConsentMessage({
    consentData,
    vendorConsents,
    vendorList,
  });
}

cmpCheck(3);
