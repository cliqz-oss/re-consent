import React from 'react';

import DetectionCardScanning from './DetectionCardScanning';
import DetectionCardSuccess from './DetectionCardSuccess';
import DetectionCardSuspicious from './DetectionCardSuspicious';

import { getCurrentSiteName } from '../features';

import style from '../scss/index-plugin.scss';


function getErrorTitle(features) {
  try {
    return features.map(feature => feature.error).join('\n');
  } catch (e) {
    return '';
  }
}

function getInfoUrl(features) {
  const suspiciousFeatures = features
    .filter(feature => feature.suspicious)
    .map(({ key, suspicious }) => ({
      key,
      suspicious,
    }));

  const stringifiedData = encodeURIComponent(JSON.stringify({
    suspiciousFeatures,
    site: getCurrentSiteName(window.location.href),
  }));

  return `http://cliqz.s3-website.eu-central-1.amazonaws.com/website/?data=${stringifiedData}`;
}

function detectFeatures(url) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        message: 'detect_features',
        url,
      },
      (features) => {
        resolve(features);
      },
    );
  });
}

class DetectionCard extends React.Component {
  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
    this.state = {
      closed: false,
      status: 'scanning',
      features: [],
      errors: [],
    };
  }

  async componentDidMount() {
    const url = String(window.location);
    const features = await detectFeatures(url);
    const errors = features.filter(feature => feature.error);
    const suspicious = features.some(feature => feature.suspicious);
    const status = suspicious ? 'suspicious' : 'success';

    this.setState({ // eslint-disable-line react/no-did-mount-set-state
      status,
      features,
      errors,
    });
  }

  onClose() {
    this.setState({ closed: true });
  }

  render() {
    const {
      closed,
      status,
      features,
      errors,
    } = this.state;

    if (closed) {
      return null;
    }

    const infoUrl = getInfoUrl(features);

    let component = null;

    if (status === 'scanning') {
      component = <DetectionCardScanning onClose={this.onClose} />;
    } else if (status === 'suspicious') {
      component = (
        <DetectionCardSuspicious
          onClose={this.onClose}
          infoUrl={infoUrl}
          features={features}
        />
      );
    } else if (status === 'success') {
      component = <DetectionCardSuccess onClose={this.onClose} infoUrl={infoUrl} />;
    }

    return (
      <div className={style['detection-card-wrapper']}>
        {component}

        {!!errors.length && (
          <div className={style['detection-card-wrapper__error']} title={getErrorTitle(errors)}>
            {errors.length} {errors.length === 1 ? 'error' : 'errors'}
          </div>
        )}
      </div>
    );
  }
}

export default DetectionCard;
