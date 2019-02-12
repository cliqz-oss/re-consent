
function createOverlay() {
  const root = document.createElement('span');
  const shadow = root.attachShadow({ mode: 'closed' });
  // TODO: remove CSS framework - all styles here should be custom and inline to
  // prevent interference from page
  const html = `
    <style type="text/css">
    :host {
      all: initial
    }
    .hidden {
      display: none;
    }
    .ui {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2147483647 !important;
    }
    </style>
    <div class="ui hidden" id="wrapper">
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="box">
            <article class="media">
              <div class="media-left">
                <figure class="image">
                  <img src="${chrome.runtime.getURL('icons/png/128x128_logo-chrome.png')}" alt="Re:consent Logo"/>
                </figure>
              </div>
              <div class="media-content hidden" id="modal">
                <p>Re:consent can automatically manage your consent on this site.</p>
                <div class="field is-grouped">
                  <div class="control" id="button-deny">
                    <button class="button is-success is-large">Deny all</button>
                  </div>
                  <div class="control" id="button-allow">
                    <button class="button is-danger is-large">Allow all</button>
                  </div>
                  <div class="control" id="button-custom">
                    <button class="button is-large is-text">Custom</buttom>
                  </div>
                </div>
                <div class="field">
                  <div class="select is-medium">
                    <select id="option-settings">
                      <option value="always">Always chose this option for all sites</option>
                      <option value="site">Chose this option for this site only</option>
                      <option value="once">Just once</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="media-content hidden" id="overlay">
                <p id="waiting-text"></p>
                <p class="subtitle">You can always review your settings from the re:consent icon in the url bar.</p>
                <div class="control" id="button-cancel">
                  <button class="button is-large is-text">Close</button>
                </div>
              </div>
            </article>
        </div>
        <button class="modal-close is-large" aria-label="close" id="close-button"></button>
      </div>
    </div>
  `;
  shadow.innerHTML = html;

  // reduce z-index of any other popup
  function reduceZIndex(e) {
    if (window.getComputedStyle(e).zIndex === '2147483647') {
      e.style = 'z-index: 2147483646 !important'
    }
  }
  document.querySelectorAll('body > div').forEach(reduceZIndex);
  document.querySelectorAll('#gdpr-modal-html').forEach(reduceZIndex);

  const firstElement = document.querySelector('body > :first-child');
  if (firstElement) {
    document.body.insertBefore(root, firstElement);
  } else {
    document.body.appendChild(root);
  }

  // root.style = 'display: none!important';

  function showModel() {
    shadow.getElementById('overlay').className = "media-content hidden";
    shadow.getElementById('modal').className = "media-content";
    shadow.getElementById('wrapper').className = "ui";
  };
  function showOverlay(msg) {
    shadow.getElementById('modal').className = "media-content hidden";
    shadow.getElementById('waiting-text').innerText = msg;
    shadow.getElementById('overlay').className = "media-content"
    shadow.getElementById('wrapper').className = "ui";
  };
  function hideOverlay() {
    shadow.getElementById('wrapper').className = "ui hidden";
  };

  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.href = chrome.runtime.getURL('css/bulma.css');
  shadow.appendChild(link);

  shadow.getElementById('close-button').addEventListener('click', () => {
    hideOverlay();
  });
  shadow.getElementById('button-cancel').addEventListener('click', () => {
    hideOverlay();
  });

  shadow.getElementById('button-allow').addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'user-consent',
      action: 'allow',
      when: shadow.getElementById('option-settings').value,
    });
    showOverlay('Allowing all consents for this site, please wait...');
  });
  shadow.getElementById('button-deny').addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'user-consent',
      action: 'deny',
      when: shadow.getElementById('option-settings').value,
    });
    showOverlay('Denying all consents for this site, please wait...');
  });
  shadow.getElementById('button-custom').addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type: 'user-consent',
      action: 'custom',
      when: shadow.getElementById('option-settings').value,
    });
    hideOverlay();
  });

  return {
    showModel,
    showOverlay,
    hide: hideOverlay,
  };
}

let overlay = null;

chrome.runtime.onMessage.addListener((message) => {
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
    const exists = document.querySelector(message.selector) !== null;
    console.log('exists?', message.selector, exists);
    return Promise.resolve(exists);
  } else if (message.type === 'elemVisible') {
    const elem = document.querySelectorAll(message.selector);
    const results = new Array(elem.length);
    elem.forEach((e, i) => {
      results[i] = e.offsetParent !== null;
    });
    console.log('visible?', message.selector, elem, results);
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
    // TODO: chrome support
    const result = window.eval(message.script); // eslint-disable-line no-eval
    console.log('eval result', result);
    return Promise.resolve(result);
  } else if (message.type === 'prompt') {
    if (!overlay) {
      overlay = createOverlay();
    }
    if (message.action === 'showModal') {
      overlay.showModel();
    } else if (message.action === 'showOverlay') {
      overlay.showOverlay(message.message);
    } else {
      overlay.hide();
    }
    return Promise.resolve(true);
  }
  return Promise.resolve(null);
});

chrome.runtime.sendMessage({
  type: 'frame',
  url: window.location.href,
});
