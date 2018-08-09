/* eslint-disable no-underscore-dangle */

import checkIsWhiteListed from './consent/whitelist';

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
  const isWhiteListed = checkIsWhiteListed(window.location);

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
