const port = browser.runtime.connect();

const api = {
  hasCmp() {
    return typeof window.wrappedJSObject.__cmp === 'function';
  },
  getConsentData() {
    window.eval('window.__cmp("getVendorConsents", [], (r) => window._cmpConsent = r);');
    return new Promise((resolve) => {
      if (window.wrappedJSObject._cmpConsent) {
        resolve(window.wrappedJSObject._cmpConsent);
      } else {
      setTimeout(() => {
          resolve(window.wrappedJSObject._cmpConsent);
        }, 500);
      }
    });
  },
  getVendorList(version) {
    window.eval('window.__cmp("getVendorList", null, (r) => window._cmpVendors = r);');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(window.wrappedJSObject._cmpVendors);
      }, 500);
    });
  },
  getLocalStorage(key) {
    return localStorage.getItem(key);
  },
  setLocalStorage(key, value) {
    localStorage.setItem(key, value);
  },
  resetCmp() {
    window.wrappedJSObject._cmpConsent = null;
    window.wrappedJSObject._cmpVendors = null;
  },
};

const spanan = new Spanan.default();
spanan.export(api, {
  respond(response, request) {
    browser.runtime.sendMessage({
      response: response,
      uuid: request.uuid
    });
  }
});

browser.runtime.onMessage.addListener((message) => {
  spanan.handleMessage(message);
});

function cmpCheck(retries) {
  if (api.hasCmp()) {
    port.postMessage({ cmp: true });
  } else if (retries > 0) {
    setTimeout(cmpCheck.bind(undefined, retries - 1), 5000);
  }
}

cmpCheck(3);
