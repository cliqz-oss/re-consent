import 'babel-polyfill';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hasIabConsent, IABConsent } from './iab-framework';

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
