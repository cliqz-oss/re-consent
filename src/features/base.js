export default class Detector {
  constructor(url) {
    this.url = new URL(url);
  }

  getDomains() {
    return [];
  }

  shouldDetect() {
    const domains = this.getDomains();
    return domains.some((domain) => {
      return this.url.hostname.match(domain);
    });
  }

  detect() {
    throw new Error('Not implemented');
  }

  async detectFeature(feature, doDetect, doFetch = null) {
    const [detectedFeature] = await this.detectFeatures([feature], doDetect, doFetch);
    return detectedFeature;
  }

  async detectFeatures(features, doDetect, doFetch = null) {
    let doc;

    if (doFetch) {
      try {
        doc = await doFetch();
      } catch (e) {
        doDetect = () => { throw e; };
      }
    }

    const detectedFeatures = await Promise.all(features.map(async (feature) => {
      let suspicious;
      let error;

      try {
        suspicious = await doDetect(feature, doc);
      } catch (e) {
        error = e.toString();
      }

      if ([true, false].indexOf(suspicious) === -1) {
        suspicious = null;
      }

      return {
        ...feature,
        suspicious,
        error,
      };
    }));

    return detectedFeatures;
  }
}
