import browser from 'webextension-polyfill';
import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip } from 'react-tippy';

import { IconQuestionmark, IconArrowRight } from '../Icons';

const CSS_STATUS_MODIFYER = {
  true: 'active',
  false: 'inactive',
  null: 'unknown',
};

const openLink = url => async (e) => {
  e.preventDefault();

  const currentTab = await browser.tabs.query({
    currentWindow: true,
    active: true,
  });

  browser.tabs.update(currentTab.id, { url });
  window.close();
};


const PopupListItemButton = ({
  changeUrl,
  linkLabels,
  description,
  status,
  labels,
  title,
}) => (
  <div className="popup-list-item">
    <div className="popup-list-item__title">
      {title}
      {description && (
        <span className="popup-list-item__description-tooltip">
          <Tooltip placement="bottom" title={description} arrow>
            <IconQuestionmark />
          </Tooltip>
        </span>
      )}
    </div>
    <div className="popup-list-item__controls">
      <span className={`label label--${CSS_STATUS_MODIFYER[status]}`}>
        {labels[status]}
      </span>
      <a
        href={changeUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={openLink(changeUrl)}
        className="popup-list-item__deactivate-button"
      >
        {linkLabels[status]} <IconArrowRight />
      </a>
    </div>
  </div>
);

PopupListItemButton.propTypes = {
  changeUrl: PropTypes.string.isRequired,
  linkLabels: PropTypes.shape({
    true: PropTypes.string.isRequired,
    false: PropTypes.string.isRequired,
    null: PropTypes.string.isRequired,
  }).isRequired,
  description: PropTypes.string,
  labels: PropTypes.shape({
    true: PropTypes.string.isRequired,
    false: PropTypes.string.isRequired,
    null: PropTypes.string,
  }).isRequired,
  status: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

PopupListItemButton.defaultProps = {
  description: null,
  status: null,
};

export default PopupListItemButton;
