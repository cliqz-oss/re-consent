/* eslint-disable quote-props,quotes,comma-dangle,object-curly-spacing */
export default [{
  "name": "TechRadar",
  "detectCmp": [{ "url": "https://www.techradar.com"}],
  "detectPopup": [{ "exists": "#cmp-container-id"}],
  "frame": "https://consent.cmp.techradar.com/",
  "optOut": [
    { "click": "#mainMoreInfo", "frame": true, "optional": true },
    { "click": ".cmp-btn-rejectall", "frame": true },
    { "click": "#confirmLeave", "frame": true }
  ],
  "optIn": [
    { "click": "#mainMoreInfo", "frame": true, "optional": true },
    { "click": ".cmp-btn-acceptall", "frame": true },
    { "click": ".cmp-btn-acceptall", "frame": true }
  ],
  "openCmp": [
    { "eval": "window.__cmp(\"renderConsents\") || true" },
    { "waitFor": "#cmp-ui-iframe" },
    { "wait": 500 }
  ]
}, {
  "name": "Oath",
  "detectCmp": [{
    "url": "https://techcrunch.com"
  }, {
    "url": "https://yahoo.com"
  },{
    "url": "https://guce.oath.com/collectConsent"
  }, {
    "url": "https://www.huffingtonpost.co.uk"
  }],
  "detectPopup": [{ "url": "https://guce.oath.com/collectConsent"}],
  "optOut": [
    { "click": ".moreOptions", "optional": true },
    { "click": "button.link", "optional": true },
    { "waitForThenClick": ".consent-form .float-r a" },
    { "waitForThenClick": "p.our-partners-text:nth-child(4) a" },
    { "waitForThenClick": "p.our-partners-text:nth-child(4) a" },
    { "waitForThenClick": ".hide-link" },
    { "wait": 500 },
    { "waitForThenClick": ".btn" },
    { "wait": 500 },
    { "waitForThenClick": ".agree" }
  ],
  "optIn": [
    { "click": ".moreOptions" },
    { "waitForThenClick": ".agree" }
  ],
  "openCmp": [{ "goto": "https://guce.oath.com/collectConsent" }]
}, {
  "name": "Ebay",
  "detectCmp": [{ "url": "https://www.ebay.de" }],
  "detectPopup": [{ "waitFor": "#gdpr-banner", "timeout": 5000 }],
  "optOut": [
    { "click": ".gdpr-banner__text > a:nth-child(2)", "optional": true },
    { "waitForThenClick": "#pl-4 > label > div.knob.selected", "optional": true },
    { "click": "#pl-5 > label > div.knob.selected", "optional": true },
    { "click": "#pl-google > label > div.knob.selected", "optional": true },
    { "click": "#pl-1 > label > div.knob.selected", "optional": true },
    { "click": "#pl-3 > label > div.knob.selected", "optional": true },
    { "click": "#pl-2 > label > div.knob.selected", "optional": true },
    { "click": "#w0-w0" }
  ],
  "optIn": [
    { "click": ".gdpr-banner__text > a:nth-child(2)", "optional": true },
    { "waitForThenClick": "#pl-4 > label > div.knob:not(.selected)", "optional": true },
    { "click": "#pl-5 > label > div.knob:not(.selected)", "optional": true },
    { "click": "#pl-google > label > div.knob:not(.selected)", "optional": true },
    { "click": "#pl-1 > label > div.knob:not(.selected)", "optional": true },
    { "click": "#pl-3 > label > div.knob:not(.selected)", "optional": true },
    { "click": "#pl-2 > label > div.knob:not(.selected)", "optional": true },
    { "click": "#w0-w0" }
  ],
  "openCmp": [{
    "goto": "https://www.ebay.de/gdpr"
  }, {
    "wait": 1000,
  }]
}, {
  "name": "Didomi",
  "detectCmp": [{ "exists": "#didomi-host" }],
  "detectPopup": [{ "exists": "#didomi-popup" }, { "exists": "#didomi-notice" }],
  "optOut": [
    { "click": ".didomi-learn-more-button", optional: true },
    { "click": ".didomi-components-radio button:first-child", "all": true},
    { "click": ".didomi-consent-popup-actions button" }
  ],
  "optIn": [
    { "click": ".didomi-learn-more-button", optional: true },
    { "click": ".didomi-components-radio button:nth-child(2)", "all": true},
    { "click": ".didomi-consent-popup-actions button" }
  ],
  "openCmp": [{ "eval": "Didomi.preferences.show()" }]
}];
