import React from 'react';

import { DETAIL_PAGE_URL } from './../../constants';


const PopupFooter = () => (
  <div className="popup-footer">
    <a className="btn btn-info" target="_blank" rel="noopener noreferrer" href={DETAIL_PAGE_URL}>
      Show me the details
    </a>
  </div>
);

export default PopupFooter;
