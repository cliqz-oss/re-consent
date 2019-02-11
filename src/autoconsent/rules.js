/* eslint-disable quote-props,quotes,comma-dangle,object-curly-spacing */
export default [{
  "name": "Cybotcookiebot",
  "detectCmp": [{ "eval": "window.CookieConsent !== undefined" }],
  "detectPopup": [{ "exists": "#CybotCookiebotDialog" }],
  "optOut": [
    { "click": ".CybotCookiebotDialogBodyLevelButton:checked:enabled", "all": true, "optional": true },
    { "click": "#CybotCookiebotDialogBodyLevelButtonAccept" },
    { "click": "#CybotCookiebotDialogBodyButtonAccept" }
  ],
  "optIn": [
    { "click": ".CybotCookiebotDialogBodyLevelButton:not(:checked):enabled", "all": true, "optional": true },
    { "click": "#CybotCookiebotDialogBodyLevelButtonAccept"},
    { "click": "#CybotCookiebotDialogBodyButtonAccept"}
  ],
  "openCmp": [
    { "eval": "CookieConsent.renew() || true" },
    { "waitFor": "#CybotCookiebotDialog" }
  ]
}, {
  "name": "TechRadar",
  "detectCmp": [{ "url": "https://www.techradar.com"}],
  "detectPopup": [{ "exists": "#cmp-container-id"}],
  "frame": "https://consent.cmp.techradar.com",
  "optOut": [
    { "click": "#mainMoreInfo", "frame": true },
    { "click": ".cmp-btn-rejectall", "frame": true },
    { "click": "#confirmLeave", "frame": true }
  ],
  "optIn": [
    { "click": "#mainMoreInfo", "frame": true },
    { "click": ".cmp-btn-acceptall", "frame": true }
  ],
  "openCmp": [
    { "eval": "window.__cmp(\"renderConsents\") " },
    { "waitFor": "#privacy-iframe" },
    { "wait": 500 }
  ]
}, {
  "name": "Oath",
  "detectCmp": [{ "url": "https://techcrunch.com" }, { "url": "https://yahoo.com" }, { "url": "https://guce.oath.com/collectConsent"}],
  "detectPopup": [{ "url": "https://guce.oath.com/collectConsent"}],
  "optOut": [
    { "click": ".moreOptions" },
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
  "detectCmp": [{ "exists": "#gdpr-banner" }, { "url": "https://www.ebay.de" }],
  "detectPopup": [{ "exists": "#gdpr-banner" }],
  "optOut": [
    { "click": ".gdpr-banner__text > a:nth-child(2)", "optional": true },
    { "waitForThenClick": "#w0-w1-w0.selected", "optional": true },
    { "click": "#w0-w1-w164.selected", "optional": true },
    { "click": "#w0-w1-w345.selected", "optional": true },
    { "click": "#w0-w1-w347.selected", "optional": true },
    { "click": "#w0-w1-w658.selected", "optional": true },
    { "click": "#w0-w1-w897.selected", "optional": true }
  ],
  "openCmp": [{ "goto": "https://www.ebay.de/gdpr"}]
}, {
  "name": "Didomi",
  "detectCmp": [{ "exists": "#didomi-host" }],
  "detectPopup": [{ "exists": "#didomi-popup" }],
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
