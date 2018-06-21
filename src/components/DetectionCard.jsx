import React from 'react';

import DetectionCardScanning from './DetectionCardScanning';
import DetectionCardSuccess from './DetectionCardSuccess';
import DetectionCardSuspicious from './DetectionCardSuspicious';

class DetectionCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 'scanning',
    };
  }

  render() {
    const { status } = this.state;

    if (status === 'scanning') {
      return <DetectionCardScanning />;
    } else if (status === 'suspicious') {
      return <DetectionCardSuspicious />;
    } else if (status === 'success') {
      return <DetectionCardSuccess />;
    }

    return null;
  }
}

export default DetectionCard;
