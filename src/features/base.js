export default class Detector {
  constructor(url) {
    this.url = new URL(url);
  }

  getDomains() {
    return [];
  }

  shouldDetect() {
    const domains = this.getDomains();
    return domains.some(domain => this.url.hostname.indexOf(domain) !== -1);
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
        error = e;
      }

      return {
        ...feature,
        suspicious: Boolean(suspicious),
        error,
      };
    }));

    return detectedFeatures;
  }
}
