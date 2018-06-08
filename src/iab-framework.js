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

async function getConsentCookie(tab) {
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
  await addVendorList(page, newConsent);
  const cookie = await getConsentCookie(tab);
  const res = await browser.cookies.set({
    expirationDate: cookie.expirationDate,
    firstPartyDomain: cookie.firstPartyDomain || undefined,
    domain: cookie.domain.startsWith('.') ? cookie.domain : undefined,
    httpOnly: cookie.httpOnly,
    name: cookie.name,
    path: cookie.path,
    secure: cookie.secure,
    storeId: cookie.storeId,
    url: `${tab.url}`,
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
    return await page.getConsentData();
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
    const { purposes, onChange } = this.props;
    const allowedPurposes = purposes || [];
    const onClick = (action, purposeId) => {
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
    const { metadata, purposeConsents, gdprApplies } = this.props.consent;
    const consentData = new ConsentString(metadata);
    const allowedPurposes = Object.keys(purposeConsents)
      .filter(k => purposeConsents[k])
      .reduce((l, v) => [...l, parseInt(v)], []);
    console.log('xxx', this.props.consent, consentData);
    return (
      <div className="row">
        <div className="col">
          <p>GDPR Applies? {gdprApplies ? 'Yes' : 'No'}</p>
          <IABConsentCategoryList
            purposes={allowedPurposes}
            onChange={this.onChange.bind(this)}
          />
          <small>Obtained {moment(consentData.created).fromNow()}, updated {moment(consentData.lastUpdated).fromNow()}</small>
        </div>
      </div>
    )
  }
}