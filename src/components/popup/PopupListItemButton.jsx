import PropTypes from 'prop-types';
import React from 'react';

import Tooltip from '../Tooltip';

import { IconQuestionmark, IconArrowRight } from '../Icons';

/* eslint-disable arrow-parens */
const openLink = (url) => (e) => {
  e.preventDefault();
  chrome.tabs.query({
    currentWindow: true,
    active: true,
  }, (tab) => {
    chrome.tabs.update(tab.id, { url });
    window.close();
  });
};

const PopupListItemButton = ({
  changeUrl,
  description,
  isActive,
  labels,
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
    <div className="popup-list-item__controls">
      <span className={`label label--${{ true: 'active', false: 'inactive' }[isActive]}`}>
        {labels[isActive]}
      </span>
      {isActive && (
        <a
          href={changeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={openLink(changeUrl)}
          className="popup-list-item__deactivate-button"
        >
          Deactivate <IconArrowRight />
        </a>
      )}
    </div>
  </div>
);

PopupListItemButton.propTypes = {
  changeUrl: PropTypes.string.isRequired,
  description: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  labels: PropTypes.shape({
    true: PropTypes.string.isRequired,
    false: PropTypes.string.isRequired,
  }).isRequired,
  title: PropTypes.string.isRequired,
};

PopupListItemButton.defaultProps = {
  description: null,
};

export default PopupListItemButton;
