const port = browser.runtime.connect();

let resolveCheckCmp = null;
const checkCmp = new Promise((resolve) => {
  resolveCheckCmp = resolve;
});

let msgCtr = 0;
const waitingResolvers = {};
const spanan = new Spanan.default();
spanan.export({
  hasCmp() {
    injectDetector();
    return checkCmp;
  },
  queryCmp(cmd, args) {
    const id = ++msgCtr;
    const result = new Promise((resolve) => {
      waitingResolvers[id] = resolve;
    });
    listeners.forEach((fn) => fn(id, cmd, JSON.stringify(args)));
    return result;
  }
}, {
  respond(response, request) {
    browser.runtime.sendMessage({
      response,
      uuid: request.uuid
    });
  }
});

let listeners = [];

exportFunction((fn) => {
  listeners.push(fn);
},
  window,
  { defineAs: '_consentListener' }
);

exportFunction((v) => {
  resolveCheckCmp(v);
}, window, { defineAs: '_consentSetCmp' });

exportFunction(({ uuid, response }) => {
  console.log('pm', uuid, response);
  waitingResolvers[uuid](response);
  delete waitingResolvers[uuid];
}, window, { defineAs: '_consentPostMessage'} );

browser.runtime.onMessage.addListener((message) => {
  spanan.handleMessage(message);
});

let injected = false;

function injectDetector() {
  if (injected) {
    return;
  }
  injected = true;
  const scriptTag = document.createElement('script');
  scriptTag.src = browser.extension.getURL('detect-iab.js');
  const target = document.head || document.documentElement;
  target.appendChild(scriptTag);
  scriptTag.parentNode.removeChild(scriptTag);
}
