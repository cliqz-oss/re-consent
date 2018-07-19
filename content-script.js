const port = chrome.runtime.connect();

class ApiBase {
  getLocalStorage(key) {
    return localStorage.getItem(key);
  }

  setLocalStorage(key, value) {
    localStorage.setItem(key, value);
  }

  queryCmp(/* method, args */) {
    throw 'Should be implemented by sub class';
  }

  getConsentData() {
    return this.queryCmp('getConsentData', []);
  }

  getVendorConsents() {
    return this.queryCmp('getVendorConsents');
  }

  getVendorList() {
    return this.queryCmp('getVendorList', null);
  }
}

class ApiFirefox extends ApiBase {
  constructor() {
    super();
    this.queryCtr = 0;
  }

  hasCmp() {
    return typeof window.wrappedJSObject.__cmp === 'function';
  }

  /**
   * Query the __cmp object in the host page. Uses the firefox specific exportFunction method
   * and window.eval in order to add a callback which is accessible to the host page, and execute
   * __cmp inside the page scope.
   * @param {*} method
   */
  queryCmp(method) {
    this.queryCtr += 1;
    const tmpName = `_cmpRes${this.queryCtr}`;
    return new Promise((resolve) => {
      exportFunction(resolve, window, { defineAs: tmpName });
      const script = `window.__cmp("${method}", null, (r) => window.${tmpName}(r));`;
      window.eval(script);
    });
  }
}

const MSG_SOURCE_PAGE = 'consentric-from-page';
const MSG_SOURCE_CS = 'consentic-from-content-script';

class ApiChrome extends ApiBase {
  constructor() {
    super();
    this._cmp = false;
    this.pageChannel = new Spanan.default((message) => {
      window.postMessage({
        source: MSG_SOURCE_CS,
        ...message,
      }, "*");
    });
    this.pageProxy = this.pageChannel.createProxy();
    window.addEventListener("message", this._handleMessage.bind(this));
    this._injectPageScript();
  }

  hasCmp() {
    return this._cmp;
  }

  queryCmp(method) {
    return this.pageProxy.queryCmp(method);
  }

  _injectPageScript() {
    const scriptTag = document.createElement('script');
    scriptTag.src = chrome.runtime.getURL('page-script.js');
    const target = document.documentElement;
    target.appendChild(scriptTag);
    scriptTag.parentNode.removeChild(scriptTag);
  }

  _handleMessage(event) {
    if (event.source == window && event.data && event.data.source === MSG_SOURCE_PAGE) {
      const { data } = event;
      if (data.cmp === true) {
        this._cmp = true;
        port.postMessage({ cmp: true });
      } else {
        this.pageChannel.handleMessage(event.data);
      }
    }
  }
}

const api = window.wrappedJSObject !== undefined ? new ApiFirefox() : new ApiChrome();

const spanan = new Spanan.default();
spanan.export({
  hasCmp: api.hasCmp.bind(api),
  getLocalStorage: api.getLocalStorage.bind(api),
  setLocalStorage: api.setLocalStorage.bind(api),
  getConsentData: api.getConsentData.bind(api),
  getVendorConsents: api.getVendorConsents.bind(api),
  getVendorList: api.getVendorList.bind(api),
}, {
  respond(response, request) {
    chrome.runtime.sendMessage({
      response: response,
      uuid: request.uuid
    });
  }
});

chrome.runtime.onMessage.addListener((message) => {
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
