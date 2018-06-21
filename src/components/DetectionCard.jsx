import React from 'react';

import DetectionCardScanning from './DetectionCardScanning';
import DetectionCardSuccess from './DetectionCardSuccess';
import DetectionCardSuspicious from './DetectionCardSuspicious';

import detectFacebookFeatures from '../features/facebook';
import style from '../scss/index-plugin.scss';

async function detectFeatures() {
  return [
    ...await detectFacebookFeatures(),
  ];
}

class DetectionCard extends React.Component {
  constructor(props) {
    super(props);

    this.onClose = this.onClose.bind(this);
    this.state = {
      closed: false,
      status: 'scanning',
      features: [],
    };
  }

  async componentDidMount() {
    const features = await detectFeatures();
    const suspicious = features.some(feature => feature.suspicious);
    const status = suspicious ? 'suspicious' : 'success';

    this.setState({ status, features }); // eslint-disable-line react/no-did-mount-set-state
  }

  onClose() {
    this.setState({ closed: true });
  }

  render() {
    const { closed, status, features } = this.state;

    if (closed) {
      return null;
    }

    let component = null;

    if (status === 'scanning') {
      component = <DetectionCardScanning onClose={this.onClose} />;
    } else if (status === 'suspicious') {
      component = <DetectionCardSuspicious onClose={this.onClose} features={features} />;
    } else if (status === 'success') {
      component = <DetectionCardSuccess onClose={this.onClose} />;
    }

    return (
      <div className={style['detection-card-wrapper']}>
        {component}
      </div>
    );
  }
}

export default DetectionCard;
