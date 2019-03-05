import { AutoConsent } from './base';
import Quantcast from './quantcast';
import Optanon from './optanon';
import TheGuardian from './theguardian';
import TagCommander from './tagcommander';
import TrustArc from './trustarc';
import CookieBot from './cookiebot';
import Evidon from './evidon';
import genericRules from './rules';

const rules = [
  new Quantcast(),
  new Optanon(),
  new TheGuardian(),
  new TagCommander(),
  new TrustArc(),
  new CookieBot(),
  new Evidon(),
];
genericRules.forEach((rule) => {
  rules.push(new AutoConsent(rule));
});

export { waitFor } from './base';
export default rules;
