import PropTypes from 'prop-types';
import React from 'react';

const PopupList = ({
  title,
  icon,
  children,
}) => (
  <div className="popup-list">
    <div className="popup-list__header" title={title}>
      <span className="popup-list__icon">
        {icon}
      </span>
      <span className="popup-list__title">
        {title}
      </span>
    </div>
    <div className="popup-list__items">
      {children}
    </div>

  </div>
);

PopupList.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default PopupList;
