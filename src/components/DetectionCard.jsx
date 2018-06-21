import React from 'react';

import DetectionCardScanning from './DetectionCardScanning';
import DetectionCardSuccess from './DetectionCardSuccess';
import DetectionCardSuspicious from './DetectionCardSuspicious';

import style from '../scss/index-plugin.scss';

class DetectionCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'scanning',
    };
  }

  render() {
    const { status } = this.state;

    let component = null;

    if (status === 'scanning') {
      component = <DetectionCardScanning />;
    } else if (status === 'suspicious') {
      component = <DetectionCardSuspicious />;
    } else if (status === 'success') {
      component = <DetectionCardSuccess />;
    }

    return (
      <div className={style['detection-card-wrapper']}>
        {component}
      </div>
    );
  }
}

export default DetectionCard;
