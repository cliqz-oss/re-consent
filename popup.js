
async function getTab() {
  const tabs = await browser.tabs.query({active: true, currentWindow: true});
  return tabs[0];
}

function selectBits(buffer, from, to) {
  const byteStart = Math.floor(from / 8);
  const byteEnd = Math.ceil(to / 8);
  const view = new DataView(buffer, byteStart, byteEnd);
  // top bit
  if(byteEnd - byteStart === 1) {
    return (view.getInt8(0) >> (8 - ((to + 1) % 8))) & ((2 ** (8 - from % 8)) - 1);
  }
  const length = byteEnd - byteStart;
  const offset = 8 - ((to + 1) % 8);

  let result = view.getUint8(0) & (2 ** ((8 - (from % 8)))) - 1;
  result *= 2 ** (length - 1) * 8 - offset
  for (let i = 1; i < length - 1; i += 1) {
    const bitShift = (length - i - 1) * 8 - offset
    // console.log(view.getUint8(i), );
    result += view.getUint8(i) * (2 ** bitShift);
  }
  result += view.getUint8(length - 1) >> (8 - (to + 1) % 8);
  return result;
}

function decodeConsentData(consentData) {
  const data = new Uint8Array(atob(consentData
    .replace(/-/g,'+')
    .replace(/_/g,'/'))
    .split('')
    .map(c => c.charCodeAt()));
  console.log(data);
  console.log(selectBits(data.buffer, 0, 5));
  console.log(selectBits(data.buffer, 6, 41));
  console.log(selectBits(data.buffer, 78, 89));
  console.log(selectBits(data.buffer, 144, 167));
  return {
    version: data[0] >> 2,
  }
}

getTab().then(async (tab) => {
  const bgChannel = new Spanan.default(browser.runtime.sendMessage);
  const pageChannel = new Spanan.default((message) => browser.tabs.sendMessage(tab.id, message));
  browser.runtime.onMessage.addListener(m => {
    console.log('xxx', m);
    bgChannel.handleMessage(m);
    pageChannel.handleMessage(m);
  });
  const background = bgChannel.createProxy();
  const page = pageChannel.createProxy();
  const hasCmp = await page.hasCmp()
  if (hasCmp) {
    const ping = await page.queryCmp('ping');
    document.getElementById('message').innerText = JSON.stringify(ping);
    const [consentData,] = await page.queryCmp('getConsentData');
    console.log('xxx', consentData);
    // const [pubConsent,] = await page.queryCmp('getPublisherConsents', []);

    const data = decodeConsentData(consentData.consentData);
    console.log('xxx', data);
  } else {
    document.getElementById('message').innerText = 'Unknown';
  }
});
