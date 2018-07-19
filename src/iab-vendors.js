import browser from 'webextension-polyfill';

const localStorageKey = 'crfgL0cSt0r';

function isThirdPartyIsolateEnabled() {
  return browser.privacy.websites.firstPartyIsolate === true;
}

function cookieWrapper(opts, url, thirdParty) {
  if (isThirdPartyIsolateEnabled()) {
    opts.firstPartyDomain = thirdParty === true ? url.split('/')[2] : '';
  }
  console.log(opts);
  return opts;
}

async function updateCookie(cookie, newValue) {
  const newCookie = {
    expirationDate: cookie.expirationDate,
    domain: cookie.domain.startsWith('.') ? cookie.domain : undefined,
    httpOnly: cookie.httpOnly,
    name: cookie.name,
    path: cookie.path,
    secure: cookie.secure,
    storeId: cookie.storeId,
    url: `${cookie.httpOnly ? 'http' : 'https'}://${cookie.domain.startsWith('.') ? cookie.domain.substring(1) : cookie.domain}${cookie.path}`,
    value: newValue,
  };
  if (isThirdPartyIsolateEnabled()) {
    newCookie.firstPartyDomain = cookie.firstPartyDomain || undefined;
  }
  return browser.cookies.set(newCookie);
}

export class EUConsentCookie {
  constructor(tab, consent) {
    this.tab = tab;
    this.consent = consent;
    this._checked = false;
    this.cookies = [];
    this.cookieName = 'euconsent';
  }

  async exists() {
    return (await this.getConsentCookies()).length > 0;
  }

  async update(newConsent) {
    const newCookieValue = newConsent.getConsentString();
    const cookies = await this.getConsentCookies();
    console.log('consentric', 'updating euconsent cookies', cookies, newCookieValue);
    return Promise.all(cookies.map((cookie) => updateCookie(cookie, newCookieValue)));
  }

  async getConsentCookies() {
    if (!this._checked) {
      this.cookies = [];
      if (this.consent) {
        const consentCookies = await browser.cookies.getAll(cookieWrapper({
          storeId: this.tab.cookieStoreId,
        }, this.tab.url, true));
        this.cookies = consentCookies.filter(c => c.value.startsWith(this.consent.consentData));
        if (this.cookies.length === 0) {
          this.cookies = consentCookies.filter(c => this.tab.url.indexOf(c.domain) > -1 && c.name.toLowerCase() === 'euconsent');
        }
      }
      if (isThirdPartyIsolateEnabled()) {
        // if third party isolation is on, the previous query will have only got third-party cookies
        const consentCookies = (await browser.cookies.getAll(cookieWrapper({
          url: this.tab.url,
          storeId: this.tab.cookieStoreId,
        }, this.tab.url, false))).filter(c => c.name.toLowerCase() === this.cookieName);
        console.log(consentCookies);
        this.cookies = this.cookies.concat(consentCookies);
      }
      this._checked = true;
    }
    return this.cookies;
  }
}

export class LocalStorageConsent {
  constructor(page) {
    this.page = page;
    this.checked = false;
    this.value = null;
    this.key = 'crfgL0cSt0r';
  }

  async exists() {
    return this.get();
  }

  async update(newConsent) {
    const lso = await this.get();
    if (lso) {
      lso.consent = newConsent.getConsentString();
      console.log('consentric', `update ${this.key} localstorage value`, lso);
      await this.page.setLocalStorage(this.key, JSON.stringify(lso));
    }
  }

  async get() {
    if (!this.checked) {
      const consentLSORaw = await this.page.getLocalStorage(this.key);
      if (consentLSORaw) {
        this.value = JSON.parse(consentLSORaw);
      }
      this.checked = true;
    }
    return this.value;
  }
}

export class OilCookie {
  constructor(tab) {
    this.tab = tab;
    this.cookie = null;
    this.checked = false;
  }

  async exists() {
    return this.get();
  }

  async update(newConsent) {
    const oilCookie = await this.get();
    if (oilCookie) {
      const oilData = JSON.parse(decodeURIComponent(oilCookie.value));
      if (oilData.privacy === 1) {
        oilData.privacy = {
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
        };
      }
      oilData.privacy = oilData.privacy || {};
      Object.keys(oilData.privacy || {}).forEach((purpose) => {
        oilData.privacy[purpose] = newConsent.allowedPurposeIds.indexOf(Number(purpose)) !== -1;
      });
      oilData.consentString = newConsent.getConsentString();
      console.log('consentric', 'update oil.js cookie', oilData);
      await updateCookie(oilCookie, JSON.stringify(oilData));
    }
  }

  async get() {
    if (!this.checked) {
      this.cookie = await browser.cookies.get(cookieWrapper({
        name: 'oil_data',
        url: this.tab.url,
        storeId: this.tab.cookieStoreId,
      }, this.tab.url));
      this.checked = true;
    }
    return this.cookie;
  }
}