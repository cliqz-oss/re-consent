import React from 'react';

import { DETAIL_PAGE_URL } from 'constants';


const PopupFooter = () => (
  <div className="popup-footer">
    Learn more about
    {' '}
    <a className="link" target="_blank" rel="noopener noreferrer" href={DETAIL_PAGE_URL}>
      Consentric &gt;
    </a>
  </div>
);

export default PopupFooter;
