import PropTypes from 'prop-types';
import React from 'react';

const PopupList = ({
  title,
  icon,
  children,
  controlLabel,
  controlOnClick,
}) => (
  <div className="popup-list">
    <div className="popup-list__header" title={title}>
      <span className="popup-list__icon">
        {icon}
      </span>
      <span className="popup-list__title">
        {title}
      </span>
      {controlLabel && (
        <button className="popup-list__control" onClick={controlOnClick}>
          {controlLabel}
        </button>
      )}
    </div>
    <div className="popup-list__items">
      {children}
    </div>

  </div>
);

PopupList.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  controlLabel: PropTypes.string,
  controlOnClick: PropTypes.func,
};

PopupList.defaultProps = {
  controlLabel: null,
  controlOnClick: null,
};

export default PopupList;
