import React from 'react';

import { DETAIL_PAGE_URL } from 'constants';
import { FormattedMessage } from 'react-intl';
import { IconCliqzLogo } from '../Icons';


const PopupFooter = () => (
  <div className="popup-footer">
    <div className="popup-footer__link-text">
      <FormattedMessage
        id="popup.footer.link"
        values={{
          consentricLink: (
            <a className="link" target="_blank" rel="noopener noreferrer" href={DETAIL_PAGE_URL}>
              Consentric &gt;
            </a>
          ),
        }}
      />
    </div>
    <div className="popup-footer__powered-by">
      Powered by <IconCliqzLogo />
    </div>
  </div>
);

export default PopupFooter;
