import browser from 'webextension-polyfill';
import { ConsentString } from 'consent-string';
import AutoConsentBase from './base';
import { EUConsentCookie } from '../consent/storages';

export default class Oath extends AutoConsentBase {
  constructor() {
    super('oath');
  }

  async detectCmp(tab) {
    return tab.url.startsWith('https://guce.oath.com/collectConsent') || tab.eval('window.OathGUCE !== undefined');
  }

  async detectPopup(tab) {
    return tab.url.startsWith('https://guce.oath.com/collectConsent');
  }

  async optOut(tab) {
    await this.optIn(tab);
    const browserTab = await browser.tabs.get(tab.id);
    const consent = await new Promise((resolve, reject) => {
      const timeout = setTimeout(reject, 30000);
      function detectConsent(msg, sender) {
        if (msg.type === 'detectConsent' && sender.tab.id === tab.id) {
          resolve(msg.consent);
          clearTimeout(timeout);
          browser.runtime.onMessage.removeListener(detectConsent);
        }
      }
      browser.runtime.onMessage.addListener(detectConsent);
    });
    const consentCookie = new EUConsentCookie({ consent, tab: browserTab });
    const cookies = await consentCookie.getConsentCookies();
    const consentString = new ConsentString(cookies[0].value);
    let { vendorList } = consent;

    if (!vendorList || !vendorList.vendorListVersion) {
      vendorList = await (await fetch('https://vendorlist.consensu.org/vendorlist.json')).json();
    }

    consentString.setGlobalVendorList(vendorList);
    consentString.setPurposesAllowed([]);
    consentString.setVendorsAllowed([]);
    await consentCookie.update(consentString);
  }

  async optIn(tab) {
    return tab.clickElement('.agree,.primary');
  }
}
