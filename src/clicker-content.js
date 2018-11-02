import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'click') {
    console.log('do a click', message.selector);
    const elem = document.querySelectorAll(message.selector);
    if (elem.length > 0) {
      if (message.all === true) {
        elem.forEach(e => {
          e.click();
        });
      } else {
        elem[0].click();
      }
    } else {
      console.warn('element not found', message.selector);
    }
    return Promise.resolve(elem.length > 0);
  } else if (message.type === 'elemExists') {
    return Promise.resolve(document.querySelector(message.selector) !== null);
  } else if (message.type === 'elemVisible') {
    const elem = document.querySelectorAll(message.selector);
    const results = new Array(elem.length);
    elem.forEach((e, i) => {
      results[i] = e.offsetParent !== null;
    });
    if (results.length === 0) {
      return Promise.resolve(false);
    } else if (message.check === 'any') {
      return Promise.resolve(results.some(r => r));
    } else if (message.check === 'none') {
      return Promise.resolve(results.every(r => !r));
    } else {
      // all
      return Promise.resolve(results.every(r => r));
    }
  }
});

browser.runtime.sendMessage({
  type: 'frame',
  url: window.location.href,
});
