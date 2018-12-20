
function fetchPolyfill(url) {
  return new Promise((resolve) => {
    const req = new XMLHttpRequest();
    req.withCredentials = true;
    req.addEventListener('load', () => {
      console.log('loaded', url);
      resolve({
        status: req.status,
        statusText: req.statusText,
        text: () => Promise.resolve(req.responseText),
      });
    });
    req.open('GET', url);
    req.send();
  });
}

export async function fetchDocument(url, format = 'html') { // eslint-disable-line import/prefer-default-export
  const response = await fetchPolyfill(url);

  if (response.status !== 200) {
    throw Error(response.statusText);
  }

  if (format === 'html') {
    const text = await response.text();
    const parser = new window.DOMParser();
    return parser.parseFromString(text, 'text/html');
  } else if (format === 'json') {
    return response.json();
  }

  return response.text();
}

export const checkNoSuspiciousFeaturesExist = (features) => {
  if (features.length === 0) {
    return true;
  }

  const atLeastOneSupiciousFeatureExists = features.some(feature => feature.suspicious);
  return atLeastOneSupiciousFeatureExists === false;
};
