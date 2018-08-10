import React from 'react';

import { DETAIL_PAGE_URL } from 'constants';
import { FormattedMessage } from 'react-intl';


const PopupFooter = () => (
  <div className="popup-footer">
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
);

export default PopupFooter;
