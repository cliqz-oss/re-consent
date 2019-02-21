import AutoConsentBase, { waitFor } from './base';

export default class Evidon extends AutoConsentBase {
  constructor() {
    super('Evidon');
  }

  detectFrame(_, frame) {
    return frame.url.startsWith('https://l3.evidon.com/');
  }

  async detectCmp(tab) {
    return await tab.elementExists('#_evh-button') ||  tab.elementExists('#_evidon-barrier-wrapper');
  }

  async detectPopup(tab) {
    return tab.elementExists('#_evidon-barrier-wrapper');
  }

  async optOut(tab) {
    if (!tab.frame) {
      await tab.clickElement('#_evidon-banner-cookiebuttontext');
      await waitFor(() => tab.frame, 10, 200);
    }
    const frameId = tab.frame.id;
    await tab.waitForElement('#opt-out-all-button', 500, frameId);
    await new Promise(resolve => setTimeout(resolve, 500));
    await tab.clickElement('#opt-out-all-button', frameId);
    await waitFor(() => !tab.elementExists('#_evidon-barrier-wrapper'));
  }

  async optIn(tab) {
    if (!tab.frame) {
      await tab.clickElement('#_evidon-banner-cookiebuttontext');
      await waitFor(() => {
        console.log('xxx', tab.frame);
        return !!tab.frame
      }, 10, 200);
    }
    const frameId = tab.frame.id;
    await tab.waitForElement('#apply-button', 500, frameId);
    await new Promise(resolve => setTimeout(resolve, 500));
    await tab.clickElement('#apply-button', frameId);
  }

  async openCmp(tab) {
    await tab.eval('evidon.notice.showConsentTool()');
  }
}
