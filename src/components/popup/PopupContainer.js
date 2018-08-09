import { connect } from 'react-redux';

import Popup from './Popup';
import { getApplicationState } from '../../selectors';


const mapStateToProps = (state) => {
  const {
    consent,
    features,
    siteName,
  } = state;

  return {
    applicationState: getApplicationState(state),
    consent,
    features,
    siteName,
  };
};


export default connect(mapStateToProps)(Popup);
