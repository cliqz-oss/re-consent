
browser.runtime.getBackgroundPage().then(async ({ cmp }) => {
  const tab = (await browser.tabs.query({
    active: true,
    currentWindow: true,
  }))[0];
  document.getElementById('site').innerText = new URL(tab.url).hostname;
  if (cmp.tabs.has(tab.id)) {
    const currentCmp = cmp.tabs.get(tab.id);
    const tabActions = cmp.getTab(tab.id);
    document.getElementById('cmp').innerText = currentCmp.name;
    document.getElementById('openCmp').onclick = () => currentCmp.openCmp(tabActions);
    document.getElementById('optIn').onclick = async () => {
      await currentCmp.openCmp(tabActions);
      return currentCmp.optIn(tabActions);
    };
    document.getElementById('optOut').onclick = async () => {
      await currentCmp.openCmp(tabActions);
      return currentCmp.optOut(tabActions);
    };
  }
});

