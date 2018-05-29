import React, { Component } from 'react';
import { ConsentString } from 'consent-string';
import Spanan from 'spanan';

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

async function addVendorList(consent) {
  const vendorList = await fetch('https://vendorlist.consensu.org/vendorlist.json').then(r => r.json());
  consent.setGlobalVendorList(vendorList);
}

export async function setConsentCookie(tab, newConsent) {
  console.log('set cookie', tab, newConsent);
  await addVendorList(newConsent);
  const cookie = await getConsentCookie(tab);
  console.log(cookie);
  await browser.cookies.set({
    expirationDate: cookie.expirationDate,
    firstPartyDomain: cookie.firstPartyDomain,
    httpOnly: cookie.httpOnly,
    name: cookie.name,
    path: cookie.path,
    secure: cookie.secure,
    storeId: cookie.storeId,
    url: `${tab.url}`,
    value: newConsent.getConsentString(),
  });
}

export async function hasIabConsent(tab) {
  const pageChannel = new Spanan((message) => browser.tabs.sendMessage(tab.id, message));
  browser.runtime.onMessage.addListener(m => {
    pageChannel.handleMessage(m);
  });
  const page = pageChannel.createProxy();
  const hasCmp = await page.hasCmp()
  if (hasCmp) {
    const ping = await page.queryCmp('ping');
    // const [consentData,] = await page.queryCmp('getConsentData');
    // const [pubConsent,] = await page.queryCmp('getPublisherConsents');
    const cookie = await getConsentCookie(tab);
    console.log(cookie);
    return {
      consentData: new ConsentString(cookie.value),
    }
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
      console.log(this, action, purposeId);
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

  onChange(allowed) {
    const { consentData } = this.props.consent;
    consentData.setPurposesAllowed(allowed);
    this.props.onChanged(consentData);
  }

  render() {
    const { consentData } = this.props.consent;
    return (
      <div className="row">
        <div className="col">
          {/* <h5>Publisher specific:</h5>
          <IABConsentCategoryList purposes={publisherAllowedPurposes} /> */}
          <IABConsentCategoryList
            purposes={consentData.allowedPurposeIds}
            onChange={this.onChange.bind(this)}
          />
        </div>
      </div>
    )
  }
}