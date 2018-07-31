/* eslint-disable no-underscore-dangle */

function queryCmp(method) {
  return new Promise((resolve) => {
    window.__cmp(method, null, resolve);
  });
}

async function cmpCheck(retries) {
  if (window.__cmp === undefined) {
    if (retries > 0) {
      setTimeout(() => cmpCheck(retries - 1), 5000);
    } else {
      window.postMessage({
        source: 'content-page-bridge',
        type: 'receivedConsent',
        consent: false,
      }, '*');
    }
    return;
  }

  const consentData = await queryCmp('getConsentData');
  const vendorConsents = await queryCmp('getVendorConsents');
  const vendorList = await queryCmp('getVendorList');

  window.postMessage({
    source: 'content-page-bridge',
    type: 'receivedConsent',
    consent: {
      consentData,
      vendorConsents,
      vendorList,
    },
  }, '*');
}

cmpCheck(3);
