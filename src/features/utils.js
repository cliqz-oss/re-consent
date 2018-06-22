export async function fetchDocument(url) { // eslint-disable-line import/prefer-default-export
  const response = await fetch(url, { credentials: 'include' });

  if (response.status !== 200) {
    throw Error(response.statusText);
  }

  const text = await response.text();
  const parser = new window.DOMParser();
  const document = parser.parseFromString(text, 'text/html');

  return document;
}
