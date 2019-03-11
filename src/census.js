import browser from 'webextension-polyfill';
import { ConsentString } from 'consent-string';
import { sendAnonymousTelemetry } from './telemetry/cliqzTelemetryBridge';

async function consentCensus() {
  const cookies = await browser.cookies.getAll({});
  const consentCookies = cookies.filter((c) => {
    try {
      c.consent = new ConsentString(c.value);
      return !!c.value && (c.consent.cmpVersion === 1 || c.consent.cmpVersion === 2);
    } catch (e) {
      return false;
    }
  }).map((c) => {
    return {
      site: c.domain,
      name: c.name,
      allowedPurposes: c.consent.getPurposesAllowed().length,
      allowedVendors: c.consent.getVendorsAllowed().length,
      cmpId: c.consent.cmpId,
    }
  });
  console.log('[Census]', consentCookies);
  sendAnonymousTelemetry({
    action: 'attrack.consentCensus',
    payload: {
      data: consentCookies,
    }
  });
}

(async function checkCensus() {
  const CENSUS_KEY = 'censusCompleted';
  const sto = await browser.storage.local.get(CENSUS_KEY)
  if (!sto[CENSUS_KEY]) {
    await consentCensus();
    await browser.storage.local.set({ [CENSUS_KEY]: true });
  }
})()
