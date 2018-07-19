// this script acts as a bridge between the page and content-script contexts on Chrome
const MSG_SOURCE_PAGE = 'consentric-from-page';
const MSG_SOURCE_CS = 'consentic-from-content-script';

window.addEventListener("message", function(event) {
  if (event.source == window && event.data && event.data.source === MSG_SOURCE_CS) {
    // message from content-script
    const { action, args, uuid } = event.data;
    if (action === 'queryCmp') {
      try {
        window.__cmp(args[0], null, (response) => {
          window.postMessage({
            source: MSG_SOURCE_PAGE,
            uuid,
            response,
          }, '*');
        });
      } catch(e) {
        window.postMessage({
          source: MSG_SOURCE_PAGE,
          uuid,
          response: {},
        }, '*');
      }
    }
  }
});

function cmpCheck(retries) {
  if (window.__cmp !== undefined) {
    window.postMessage({
      source: MSG_SOURCE_PAGE,
      cmp: true,
    }, "*");
  } else if (retries > 0) {
    setTimeout(cmpCheck.bind(undefined, retries - 1), 5000);
  }
}

cmpCheck(3);