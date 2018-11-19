import AutoConsentBase from './base';

export default class TagCommander extends AutoConsentBase {
  constructor() {
    super('tagcommander');
  }

  detectCmp(tab) {
    return tab.eval('window.tC.privacyCenter !== undefined');
  }

  async detectPopup(tab) {
    return await tab.elementExists('#dnt-banner') || await tab.elementExists('#privacy-iframe');
  }

  detectFrame(tab, frame) {
    console.log('xxx', frame.url);
    return frame.url.startsWith('https://cdn.tagcommander.com/privacy/template/index.htm');
  }

  async optOut(tab) {
    if (!tab.frame) {
      return false;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    await tab.clickElements('.btn-yes', tab.frame.id);
    await tab.clickElement('.modal-footer > button', tab.frame.id);
    return true;
  }

  async optIn(tab) {
    if (!tab.frame) {
      return false;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    await tab.clickElements('.btn-no', tab.frame.id);
    await tab.clickElement('.modal-footer > button', tab.frame.id);
    return true;
  }

  async openCmp(tab) {
    await tab.eval('tC.privacyCenter.showPrivacyCenter();');
    if (await tab.waitForElement('#privacy-iframe', 10000)) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    }
    return false;
  }
}
