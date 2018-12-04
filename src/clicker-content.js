import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'click') {
    const elem = document.querySelectorAll(message.selector);
    if (elem.length > 0) {
      if (message.all === true) {
        elem.forEach(e => e.click());
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
    }
    // all
    return Promise.resolve(results.every(r => r));
  } else if (message.type === 'getAttribute') {
    const elem = document.querySelector(message.selector);
    if (!elem) {
      return Promise.resolve(false);
    }
    return Promise.resolve(elem.getAttribute(message.attribute));
  } else if (message.type === 'eval') {
    return Promise.resolve(window.eval(message.script));
  }
  return;
});

browser.runtime.sendMessage({
  type: 'frame',
  url: window.location.href,
});
