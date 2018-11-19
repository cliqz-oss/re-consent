
browser.runtime.getBackgroundPage().then(async ({ cmp }) => {
  const tab = (await browser.tabs.query({
    active: true,
    currentWindow: true,
  }))[0];
  document.getElementById('site').innerText = new URL(tab.url).hostname;
  if (cmp.tabs.has(tab.id)) {
    const currentCmp = cmp.tabs.get(tab.id);
    let tabActions = cmp.getTab(tab.id);
    document.getElementById('cmp').innerText = currentCmp.name;
    document.getElementById('openCmp').onclick = () => currentCmp.openCmp(tabActions);
    document.getElementById('optIn').onclick = async () => {
      if (!(await currentCmp.detectPopup(tabActions))) {
        await currentCmp.openCmp(tabActions);
        tabActions = cmp.getTab(tab.id);
      }
      return currentCmp.optIn(tabActions);
    };
    document.getElementById('optOut').onclick = async () => {
      if (!(await currentCmp.detectPopup(tabActions))) {
        await currentCmp.openCmp(tabActions);
        tabActions = cmp.getTab(tab.id);
      }
      return currentCmp.optOut(tabActions);
    };
  }
});

