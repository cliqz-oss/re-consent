import 'babel-polyfill';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hasIabConsent, IABConsent, setConsentCookie } from './iab-framework';
import { hasTrustArcConsent } from './trustarc';

class Popup extends Component {

  componentWillMount() {
    browser.tabs.query({active: true, currentWindow: true}).then(async (tab) => {
      this.setState({ tab: tab[0] });
      const iabConsent = await hasIabConsent(tab[0]);
      if (iabConsent) {
        this.setState({ kind: 'iab', consent: iabConsent });
        return;
      }
    });
  }

  render() {
    if (this.state && this.state.tab) {
      const { tab, kind, consent } = this.state;
      const [,, host, ] = this.state.tab.url.split('/');
      let contents = null;
      if (kind === 'iab') {
        contents = <IABConsent tab={tab} consent={consent} />;
      } else {
        contents = <p>Waiting for consent data...</p>;
      }
      return (
        <div className="container" >
          <h4>Consent given for {host}</h4>
          {contents}
        </div>
      )

    }
    return (
      <div className="container" >
        <h4>Loading...</h4>
      </div>
    );
  }
}

ReactDOM.render(
  <Popup/>,
  document.getElementById('root')
);

// getTab().then(async (tab) => {
//   console.log(tab);
//   const [,, host, ] = tab.url.split('/');
//   const cookie = await browser.cookies.get({
//     // firstPartyDomain: host,
//     name: 'euconsent',
//     url: tab.url,
//     storeId: tab.cookieStoreId,
//   });
//   console.log(cookie);
//   const consent = new ConsentString(cookie.value);
//   console.log(consent);
//   // document.getElementById('message').innerText = `Allowed purposes: ${consent.allowedPurposeIds}`;

//   // cookie.value = consent.getConsentString();
//   // cookie.url = tab.url;
//   // browser.cookies.set(cookie);
//   // const bgChannel = new Spanan.default(browser.runtime.sendMessage);
//   // const pageChannel = new Spanan.default((message) => browser.tabs.sendMessage(tab.id, message));
//   // browser.runtime.onMessage.addListener(m => {
//   //   console.log('xxx', m);
//   //   bgChannel.handleMessage(m);
//   //   pageChannel.handleMessage(m);
//   // });
//   // const background = bgChannel.createProxy();
//   // const page = pageChannel.createProxy();
//   // const hasCmp = await page.hasCmp()
//   // if (hasCmp) {
//   //   const ping = await page.queryCmp('ping');
//   //   document.getElementById('message').innerText = JSON.stringify(ping);
//   //   const [consentData,] = await page.queryCmp('getConsentData');
//   //   console.log('xxx', consentData);
//   //   // const [pubConsent,] = await page.queryCmp('getPublisherConsents', []);

//   //   const data = decodeConsentData(consentData.consentData);
//   //   console.log('xxx', data);
//   // } else {
//   //   document.getElementById('message').innerText = 'Unknown';
//   // }
// });
