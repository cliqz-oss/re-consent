import PropTypes from 'prop-types';
import React from 'react';

import Tooltip from '../Tooltip';

import { IconQuestionmark } from '../Icons';

const PopupListItemButton = ({
  changeUrl,
  description,
  isActive,
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
    {isActive && (
      <a href={changeUrl}>Deactivate</a>
    )}
    {!isActive && 'Deactivated'}
  </div>
);

PopupListItemButton.propTypes = {
  changeUrl: PropTypes.string.isRequired,
  description: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

PopupListItemButton.defaultProps = {
  description: null,
};

export default PopupListItemButton;
