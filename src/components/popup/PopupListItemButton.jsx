import PropTypes from 'prop-types';
import React from 'react';

const PopupListItemButton = ({
  changeUrl,
  isActive,
  title,
}) => (
  <div className="popup-list-item">
    <div className="popup-list-item__title">
      {title}
    </div>
    {/* Dana will provide a new design here, that's why we don't need to care about it right now */}
    {isActive && (
      <a href={changeUrl}>Deactivate</a>
    )}
    {!isActive && 'Deactivated'}
  </div>
);

PopupListItemButton.propTypes = {
  changeUrl: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default PopupListItemButton;
