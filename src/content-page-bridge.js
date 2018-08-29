/* eslint-disable no-underscore-dangle */

import checkIsWhiteListed from './consent/whitelist';

function queryCmp(method) {
  const cmpPromise = new Promise((resolve) => {
    window.__cmp(method, null, resolve);
  });

  if (method === 'getVendorList') {
    // VendorList is allowed to be null. But apparently some pages just don't call the callback
    // if there is no VendorList available.
    // To prevent our app of not responding because of that, after a timeout the promise is
    // automatically resolved with `null`.

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve(null);
      }, 1000);

      cmpPromise
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        });
    });
  }

  return cmpPromise;
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
      setTimeout(() => cmpCheck(retries - 1), 1000);
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
