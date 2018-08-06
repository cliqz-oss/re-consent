import PropTypes from 'prop-types';
import React from 'react';

const PopupListItemStatus = ({
  isActive,
  title,
}) => (
  <div className="popup-list-item">
    <div className="popup-list-item__title">
      {title}
    </div>
    <div className="popup-list-item__controls">
      <span className="popup-list-item__status">
        {isActive && 'active'}
        {!isActive && 'inactive'}
      </span>
    </div>
  </div>
);

PopupListItemStatus.propTypes = {
  isActive: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default PopupListItemStatus;
