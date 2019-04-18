import { handleContentMessage } from '@cliqz/autoconsent';

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
    .notification {
      position: absolute !important;
      width: 350px;
      right: 30px;
      margin: 25px;
      z-index: 2147483647 !important;
    }
    </style>
    <div class="ui hidden" id="mask">
      <div id="wrapper">
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
          </div>
          <button class="modal-close is-large" aria-label="close" id="close-button"></button>
        </div>
      </div>
    </div>
    <div class="notification hidden" id="notification">
      <button class="delete" id="notification-hide"></button>
      <article class="media">
        <figure class="media-left">
          <p class="image">
            <img src="${chrome.runtime.getURL('icons/png/128x128_logo-chrome.png')}" alt="Re:consent Logo"/>
          </p>
        </figure>
        <div class="media-content">
          <p class="content" id="notification-text">Re:consent notification</p>
        </div>
      </article>
    </div>
  `;
  shadow.innerHTML = html;

  // reduce z-index of any other popup
  function reduceZIndex(e) {
    if (parseInt(window.getComputedStyle(e).zIndex) >= 2147483647) {
      e.style = 'z-index: 2147483646 !important';
    }
  }
  document.querySelectorAll('body > div,#gdpr-modal-html,div[class^="popup_overlay-"]').forEach(reduceZIndex);

  const firstElement = document.querySelector('body > :first-child');
  if (firstElement) {
    document.body.insertBefore(root, firstElement);
  } else {
    document.body.appendChild(root);
  }

  function showModel() {
    shadow.getElementById('overlay').className = 'media-content hidden';
    shadow.getElementById('modal').className = 'media-content';
    shadow.getElementById('mask').className = 'ui';
    shadow.getElementById('wrapper').className = '';
  }
  function showOverlay(msg) {
    shadow.getElementById('modal').className = 'media-content hidden';
    shadow.getElementById('waiting-text').innerText = msg;
    shadow.getElementById('overlay').className = 'media-content';
    shadow.getElementById('mask').className = 'ui';
    shadow.getElementById('wrapper').className = '';
  }
  function hideOverlay() {
    shadow.getElementById('mask').className = 'ui hidden';
    shadow.getElementById('overlay').className = 'media-content hidden';
    shadow.getElementById('modal').className = 'media-content hidden';
    shadow.getElementById('wrapper').className = 'hidden';
  }
  function hideNotification() {
    shadow.getElementById('mask').className = 'ui hidden';
    shadow.getElementById('notification').className = 'notification hidden';
  }
  function showNotification(msg, timeout = 10000) {
    hideOverlay();
    shadow.getElementById('notification-text').innerText = msg;
    shadow.getElementById('notification').className = 'notification';
    setTimeout(hideNotification, timeout);
  }

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
  shadow.getElementById('notification-hide').addEventListener('click', () => {
    hideNotification();
  });

  return {
    showModel,
    showOverlay,
    hide: hideOverlay,
    showNotification,
  };
}

let overlay = null;

chrome.runtime.onMessage.addListener((message) => {
  console.log('[re:consent]', message.type, message.selector);
  if (message.type === 'prompt') {
    if (!overlay) {
      overlay = createOverlay();
    }
    if (message.action === 'showModal') {
      overlay.showModel();
    } else if (message.action === 'showOverlay') {
      overlay.showOverlay(message.message);
    } else if (message.action === 'showNotification') {
      overlay.showNotification(message.message, message.timeout);
    } else {
      overlay.hide();
    }
    return Promise.resolve(true);
  }
  return handleContentMessage(message);
});

chrome.runtime.sendMessage({
  type: 'frame',
  url: window.location.href,
});
