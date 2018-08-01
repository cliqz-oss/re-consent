import PropTypes from 'prop-types';
import React from 'react';

import { IconPrivacyOK } from './Icons';

const DetectionCardSuccess = ({ pageUrl }) => (
  <div className="detection-card">
    <div className="detection-card__icon detection-card__icon--success">
      <IconPrivacyOK />
    </div>
    <div className="detection-card__title">
      Privacy Well Set!
    </div>
    <div className="detection-card__button">
      <a className="btn btn-link" target="_blank" rel="noopener noreferrer" href={pageUrl}>
        Show me what I&apos;ve done
      </a>
    </div>
  </div>
);

DetectionCardSuccess.propTypes = {
  pageUrl: PropTypes.string,
};

DetectionCardSuccess.defaultProps = {
  pageUrl: '#',
};

export default DetectionCardSuccess;
