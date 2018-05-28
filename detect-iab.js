
window._consentSetCmp(typeof window.__cmp === 'function');
  // window.__cmp('ping', undefined, (ping) => {
  //   window._consentPostMessage({
  //     type: 'iab',
  //     host: document.location.host,
  //     ping,
  //   });
  // });
  // window.__cmp('getPublisherConsents', [], (consents) => {
  //   window._consentPostMessage({
  //     type: 'iab',
  //     host: document.location.host,
  //     consents,
  //   });
  // });
// }

window._consentListener((uuid, cmd, args) => {
  console.log(uuid, cmd, args);
  window.__cmp(cmd, JSON.stringify(args), (resp, success) => {
    // console.log('xxx', response);
    window._consentPostMessage({ uuid, response: [resp, success] })
  });
});