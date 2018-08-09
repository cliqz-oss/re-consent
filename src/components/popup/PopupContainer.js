import { connect } from 'react-redux';

import Popup from './Popup';


const mapStateToProps = (state) => {
  const {
    applicationState,
    consent,
    features,
    siteName,
  } = state;

  return {
    applicationState,
    consent,
    features,
    siteName,
  };
};


export default connect(mapStateToProps)(Popup);
