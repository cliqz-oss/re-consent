import PropTypes from 'prop-types';
import React from 'react';

import Toggle from 'react-toggle';


const PopupListItemCheckbox = ({
  checked,
  disabled,
  onChange,
  title,
}) => (
  <div className="popup-list-item">
    <div className="popup-list-item__title">
      {title}
    </div>
    <Toggle
      defaultChecked={checked}
      disabled={disabled}
      icons={false}
      onChange={onChange}
      className="popup-list-item__toggle"
    />
  </div>
);

PopupListItemCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default PopupListItemCheckbox;
