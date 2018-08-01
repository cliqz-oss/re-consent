import PropTypes from 'prop-types';
import React from 'react';

import { IconSkull, getIconByName } from './Icons';

const DetectionCardSuspicious = ({ pageUrl, features }) => (
  <div className="detection-card">
    <div className="detection-card__icon detection-card__icon--suspicious">
      <IconSkull />
    </div>
    <div className="detection-card__title">
      Suspicious infringement of privacy detected!
    </div>
    <div className="detection-card__summary">
      <div className="detection-card__summary__items">
        {features.filter(feature => feature.suspicious).map(feature => (
          <div className="detection-card__summary__item" key={feature.key}>
            <div className="detection-card__summary__item__icon">
              {getIconByName(feature.icon)}
            </div>
            <div className="detection-card__summary__item__title">
              {feature.title}
            </div>
            <div className="detection-card__summary__item__badge">
              <span className="badge badge-danger">
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="detection-card__summary__cta">
        <a className="btn btn-info" target="_blank" rel="noopener noreferrer" href={pageUrl}>
          How to Deactivate?
        </a>
      </div>
      <div className="detection-card__summary__ignore-link">
        <button className="btn btn-link">
          <span>Remind me later</span> &nbsp;
          <span className="arrow-down" />
        </button>
      </div>
    </div>
  </div>
);

DetectionCardSuspicious.propTypes = {
  pageUrl: PropTypes.string,
  features: PropTypes.arrayOf(PropTypes.shape({
    suspicious: PropTypes.bool,
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
};

DetectionCardSuspicious.defaultProps = {
  pageUrl: '#',
};

export default DetectionCardSuspicious;
