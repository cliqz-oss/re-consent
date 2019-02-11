import React from 'react';
import { injectIntl } from 'react-intl';
import PopupHeader from './PopupHeader';

const Popup = ({
  applicationState,
  consent,
  siteName,
  cmp,
  tab,
  intl: { formatMessage },
}) => {

  console.log('xxx', cmp);

  return (<div className="popup">
    <PopupHeader applicationState={applicationState} siteName={siteName} consent={consent} />
    <div className="popup-list">
      <div className="popup-list__items">
        <div className="popup-list-item">
          <div className="popup-list-item__title">
            <button onClick={cmp.allow}>Allow all</button>
            <button onClick={cmp.deny}>Reject all</button>
            {!cmp.open ? <button onClick={cmp.openPopup}>Review options</button> : null}
          </div>
          <div className="popup-list-item__title">

          </div>
        </div>
      </div>
    </div>
  </div>)
};

export default injectIntl(Popup);
