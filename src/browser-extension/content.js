const mainDiv = document.createElement('div');
mainDiv.style = 'z-index: 9999999; position: fixed; top: 0; left: 0;';

mainDiv.innerHTML = '<div style="background: red;">Loading</div>';

document.body.appendChild(mainDiv);


chrome.runtime.sendMessage(
  {
    message: 'detect_features',
  },
  (features) => {
    mainDiv.innerHTML = `<div style="background: green;">${JSON.stringify(features)}</div>`;
  },
);
