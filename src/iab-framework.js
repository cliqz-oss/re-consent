import React, { Component } from 'react';
import { ConsentString } from 'consent-string';
import createPageChannel from './page-actions';
import moment from 'moment';

export const PURPOSES = {
  1: 'Information storage and access',
  2: 'Personalisation',
  3: 'Ad selection, delivery, reporting',
  4: 'Content selection, delivery, reporting',
  5: 'Measurement',
}

async function getConsentCookie(tab, consent) {
  if (consent) {
    // if consent is specified, look for a consent cookie matching the one returned from the CMP
    const consentCookies = await browser.cookies.getAll({
      name: 'euconsent',
      storeId: tab.cookieStoreId,
    });
    const matchedCookie = consentCookies.find(c => c.value === consent.metadata);
    if (matchedCookie) {
      return matchedCookie;
    }
  }
  const cookie = await browser.cookies.get({
    // firstPartyDomain: host,
    name: 'euconsent',
    url: tab.url,
    storeId: tab.cookieStoreId,
  });
  return cookie;
}

async function addVendorList(page, consent) {
  let vendorList = await page.getVendorList();
  if (!vendorList || !vendorList.vendorListVersion) {
    vendorList = await fetch('https://vendorlist.consensu.org/vendorlist.json').then(r => r.json());
  }
  consent.setGlobalVendorList(vendorList);
}

export async function setConsentCookie(tab, consent, newConsent) {
  const page = createPageChannel(tab.id);
  const [cookie, ] = await Promise.all([getConsentCookie(tab, consent), addVendorList(page, newConsent)]);
  const res = await browser.cookies.set({
    expirationDate: cookie.expirationDate,
    firstPartyDomain: cookie.firstPartyDomain || undefined,
    domain: cookie.domain.startsWith('.') ? cookie.domain : undefined,
    httpOnly: cookie.httpOnly,
    name: cookie.name,
    path: cookie.path,
    secure: cookie.secure,
    storeId: cookie.storeId,
    url: `${cookie.httpOnly ? 'http' : 'https'}://${cookie.domain.startsWith('.') ? cookie.domain.substring(1) : cookie.domain}${cookie.path}`,
    value: newConsent.getConsentString(),
  });
  await page.resetCmp();
  consent.metadata = newConsent.getConsentString();
  return consent;
}

export async function hasIabConsent(tab) {
  const page = createPageChannel(tab.id);
  const hasCmp = await page.hasCmp()
  if (hasCmp) {
    const consent = await page.getConsentData();
    const cookie = await getConsentCookie(tab, consent);
    consent.hasConsentCookie = cookie ? true : false;
    return consent;
  } else {
    return false;
  }
}

class ConsentButton extends Component {

  render() {
    const { active, children, onClick } = this.props;
    let style = 'btn';
    if (active) {
      style += ' btn-primary';
    }
    return <button type="button" className={style} onClick={onClick}>{children}</button>
  }
}

export class IABConsentCategoryList extends Component {

  render() {
    const { purposes, onChange, readOnly } = this.props;
    const allowedPurposes = purposes || [];
    const onClick = (action, purposeId) => {
      if (readOnly) {
        return;
      }
      if (action === 'in' && allowedPurposes.indexOf(purposeId) === -1) {
        allowedPurposes.push(purposeId);
        onChange(allowedPurposes);
      } else if (action === 'out' && allowedPurposes.indexOf(purposeId) !== -1) {
        const ind = allowedPurposes.indexOf(purposeId);
        allowedPurposes.splice(ind, 1);
        onChange(allowedPurposes);
      }
    }
    const listItems = Object.keys(PURPOSES).map(id => {
      const purposeId = Number(id)
      const allowed = allowedPurposes.indexOf(purposeId) > -1;
      return (<div className="list-group-item" key={purposeId}>
        <h5>{PURPOSES[purposeId]}</h5>
        <div className="btn-group" role="group">
          <ConsentButton active={allowed} onClick={onClick.bind(undefined, 'in', purposeId)}>Opt-In</ConsentButton>
          <ConsentButton active={!allowed} onClick={onClick.bind(undefined, 'out', purposeId)}>Opt-Out</ConsentButton>
        </div>
      </div>)
    });
    return (
      <div className="list-group">
        {listItems}
      </div>
    )
  }
}

export class ConsentAllButtons extends Component {

  render() {
    const { purposeConsents, onChange, readOnly } = this.props;
    const onClick = (action) => {
      if (readOnly) {
        return;
      }
      if (action === 'out') {
        onChange([]);
      } else {
        onChange(Object.keys(purposeConsents).map(Number));
      }
    };

    return (
      <div className="btn-toolbar p-3 mx-auto">
        <div className="btn-group" role="group">
          <ConsentButton active={false} onClick={onClick.bind(undefined, 'in')}>Opt-In to all</ConsentButton>
          <ConsentButton active={false} onClick={onClick.bind(undefined, 'out')}>Opt-Out of all</ConsentButton>
        </div>
      </div>
    )
  }
}

export class ReadOnlyWarning extends Component {
  render() {
    return (
      <div className="alert alert-warning" role="alert">
        <p>
          No consent cookie found, cannot update consent settings.
        </p>
      </div>
    )
  }
}

export class IABConsent extends Component {

  async onChange(allowed) {
    const { consent, tab } = this.props;
    const consentData = new ConsentString(consent.metadata);
    consentData.setPurposesAllowed(allowed);
    await setConsentCookie(tab, consent, consentData);
    allowed.forEach((purpose) => {
      consent.purposeConsents[purpose] = true;
    });
    this.setState({ consent, tab });
    browser.tabs.reload(tab.id);
  }

  render() {
    const { metadata, purposeConsents, gdprApplies, hasConsentCookie } = this.props.consent;
    const consentData = new ConsentString(metadata);
    const allowedPurposes = Object.keys(purposeConsents)
      .filter(k => purposeConsents[k])
      .reduce((l, v) => [...l, parseInt(v)], []);
    const writeable = hasConsentCookie;
    console.log('xxx', this.props.consent, consentData);
    return (
      <div className="row">
        <div className="col-sm">
          <p>GDPR Applies? {gdprApplies ? 'Yes' : 'No'}</p>
          { !writeable ? <ReadOnlyWarning tab={this.props.tab}/> : null }
          <IABConsentCategoryList
            purposes={allowedPurposes}
            onChange={this.onChange.bind(this)}
            readOnly={!writeable}
          />
          <ConsentAllButtons
            purposeConsents={purposeConsents}
            onChange={this.onChange.bind(this)}
            readOnly={!writeable}
          />
        </div>
        <div className="col-sm">
          <small>Obtained {moment(consentData.created).fromNow()}, updated {moment(consentData.lastUpdated).fromNow()}</small>
          <p>
            <a href="http://advertisingconsent.eu/iab-europe-transparency-consent-framework-list-of-registered-cmps/" target="_blank">CMP ID</a>: {consentData.cmpId}
          </p>
        </div>
      </div>
    )
  }
}