// Sites from where we know that they don't have any consent cookies.
const CONSENT_WHITE_LIST = [
  'facebook.com',
  'gmail.com',
  'google.com',
  'google.de',
];

const checkIsWhiteListed = url => (
  CONSENT_WHITE_LIST.some(domain => url.hostname.indexOf(domain) !== -1)
);

export default checkIsWhiteListed;
