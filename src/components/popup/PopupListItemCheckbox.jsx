import PropTypes from 'prop-types';
import React from 'react';

const PopupListItemCheckbox = ({
  checked,
  onChange,
  title,
}) => (
  <div className="popup-list-item">
    <div className="popup-list-item__title">
      {title}
    </div>
    <div className="popup-list-item__checkbox">
      <input type="checkbox" checked={checked} onChange={onChange} />
    </div>
  </div>
);

PopupListItemCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default PopupListItemCheckbox;
