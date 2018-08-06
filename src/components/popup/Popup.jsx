import PropTypes from 'prop-types';
import React from 'react';

import { APPLICATION_STATES } from '../../constants';
import DetectionCardScanning from './DetectionCardScanning';
import PopupHeader from './PopupHeader';
import PopupFooter from './PopupFooter';
import FeatureCard from './FeatureCard';
import ConsentCard from './ConsentCard';

const Popup = ({
  applicationState,
  detailPageUrl,
  features,
  changeConsent,
}) => {
  if (applicationState === APPLICATION_STATES.SCANNING) {
    return <DetectionCardScanning />;
  }
  return (
    <div>
      <PopupHeader applicationState={applicationState} />
      <ConsentCard changeConsent={changeConsent} />
      <FeatureCard features={features} />
      <PopupFooter detailPageUrl={detailPageUrl} />
    </div>
  );
};

Popup.propTypes = {
  applicationState: PropTypes.string.isRequired,
  detailPageUrl: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(PropTypes.object),
  changeConsent: PropTypes.func.isRequired,
};

Popup.defaultProps = {
  features: null,
};

export default Popup;
