import PropTypes from 'prop-types';
import React from 'react';

const PopupFooter = ({
  detailPageUrl,
}) => (
  <div className="popup-footer">
    <div className="detection-card__summary__cta">
      <a className="btn btn-info" target="_blank" rel="noopener noreferrer" href={detailPageUrl}>
        Show me the details
      </a>
    </div>
  </div>
);

PopupFooter.propTypes = {
  detailPageUrl: PropTypes.string.isRequired,
};

export default PopupFooter;
