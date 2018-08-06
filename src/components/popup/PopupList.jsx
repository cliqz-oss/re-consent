import PropTypes from 'prop-types';
import React from 'react';
import { getIconByName } from '../Icons';

const PopupList = ({
  title,
  icon,
  children,
}) => (
  <div className="popup-list">
    <div className="popup-list__header">
      {getIconByName(icon)}
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
  icon: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default PopupList;
