import PropTypes from 'prop-types';
import React from 'react';

import Toggle from 'react-toggle';
import { Tooltip } from 'react-tippy';

import { IconQuestionmark } from '../Icons';


const PopupListItemCheckbox = ({
  checked,
  description,
  disabled,
  disabledHelpText,
  onChange,
  title,
}) => {
  const toggle = (
    <span>
      <span className="popup-list-item__toggle-label">
        {checked && 'allow'}
        {!checked && 'deny'}
      </span>
      <Toggle
        defaultChecked={checked}
        disabled={disabled}
        icons={false}
        onChange={onChange}
        className="popup-list-item__toggle"
      />
    </span>
  );

  return (
    <div className="popup-list-item">
      <div className="popup-list-item__title">
        {title}
        {description !== null && (
          <span className="popup-list-item__description-tooltip">
            <Tooltip title={description} arrow>
              <IconQuestionmark />
            </Tooltip>
          </span>
        )}
      </div>
      <div className="popup-list-item__controls">
        {(disabled && disabledHelpText) && (
          <Tooltip title={disabledHelpText} arrow>
            {toggle}
          </Tooltip>
        )}
        {!(disabled && disabledHelpText) && toggle}
      </div>
    </div>
  );
};

PopupListItemCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  description: PropTypes.string,
  disabled: PropTypes.bool,
  disabledHelpText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

PopupListItemCheckbox.defaultProps = {
  disabled: false,
  disabledHelpText: null,
  description: null,
};

export default PopupListItemCheckbox;
