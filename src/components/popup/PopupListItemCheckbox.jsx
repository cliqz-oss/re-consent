import PropTypes from 'prop-types';
import React from 'react';

import Toggle from 'react-toggle';

import Tooltip from '../Tooltip';
import { IconQuestionmark } from '../Icons';


const PopupListItemCheckbox = ({
  checked,
  description,
  disabled,
  onChange,
  title,
}) => (
  <div className="popup-list-item">
    <div className="popup-list-item__title">
      {title}
      {description !== null && (
        <Tooltip placement="bottom" content={description}>
          <span className="popup-list-item__description-tooltip">
            <IconQuestionmark />
          </span>
        </Tooltip>
      )}
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
  description: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

PopupListItemCheckbox.defaultProps = {
  disabled: false,
  description: null,
};

export default PopupListItemCheckbox;
