# re:consent

Welcome to more privacy control

re:consent allows you to view and change the consent you have given to websites for data processing. It works for websites that adhere to the IAB's Transparency & Consent Framework, as well as for Google and Facebook. re:consent offers more control over your direct interaction with websites making it a smart addition to third-party tracking protection powered by Cliqz.
Learn more on https://cliqz.com/magazine/re-consent


## Supported Consent Management Platforms

The extension works by looking for third-party consent management platforms in visited pages. Currently the extension supports the following platforms:

 * [IAB Consent Framework](https://iabtechlab.com/standards/gdpr-transparency-and-consent-framework/).


## Additionally Supported Services

 * Google
 * Facebook


## Building

The extension is implemented as a [WebExtension](https://developer.mozilla.org/en-US/Add-ons/WebExtensions).
It is dockerized and can be built with the following command:

```bash
docker-compose run --rm re-consent npm run build
```

It creates a new folder called `build` which contains the zipped extension.
The extension can then be loaded via the `about:debugging` page in Firefox and via the `chrome://extensions` page in Chrome.
For more information on how to install the extension follow this tutorial: https://developer.chrome.com/extensions/getstarted


## Development
We recommend using Docker also during development. You can start the build watcher (webpack) as well as the storybook
(for documenting UI components) by the following command:

```bash
docker-compose up
```

Point the extension directory in Firefox/ Chrome to the `build/src` folder. The styleguide is available on [localhost:9009](http://localhost:9009)
