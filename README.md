# Consentric

Consentric is a extension for Firefox which allows you to view and modify the consent you give to websites.

Under the GDPR websites must ask for consent in order to process personal data of Europeans. Due to the the way current web ad technology works, this means that any website with advertising should be asking you for consent before showing you any targeted ads. Once they have asked, this extension can show you the settings a particular site has for you, and allows you to modify them.

## Supported Consent Management Platforms

The extension works by looking for third-party consent management platforms in visited pages. Currently the extension supports the following platforms:

 * [IAB Consent Framework](https://iabtechlab.com/standards/gdpr-transparency-and-consent-framework/). 
 
## Building

The extension is implemented as a [WebExtension](https://developer.mozilla.org/en-US/Add-ons/WebExtensions), however currently uses Firefox-specific APIs. It can be built with the following commands:

```bash
npm install
npm run build
```

The extension can then be loaded via the `about:debugging` page in Firefox.
