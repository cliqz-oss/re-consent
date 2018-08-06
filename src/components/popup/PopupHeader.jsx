import PropTypes from 'prop-types';
import React from 'react';

import { getIconByName } from '../Icons';


const PopupHeader = ({
  applicationState,
}) => {
  const title = 'Your privacy settings have never been reviewed on this page.';

  return (
    <div className="popup-header">
      {getIconByName(`Icon${applicationState}`)}
      <div className="popup-header__title">
        {title}
      </div>
    </div>
  );
};

PopupHeader.propTypes = {
  applicationState: PropTypes.string.isRequired,
};

export default PopupHeader;
