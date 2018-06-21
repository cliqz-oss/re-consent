import PropTypes from 'prop-types';
import React from 'react';

import style from '../scss/index-plugin.scss';
import { IconClose, IconPrivacyOK } from './Icons';

const DetectionCardSuccess = ({ onClose, infoUrl }) => (
  <div className={style['detection-card']}>
    <div className={style['detection-card__close']} onClick={onClose}>
      <IconClose />
    </div>
    <div className={[style['detection-card__icon'], style['detection-card__icon--success']].join(' ')}>
      <IconPrivacyOK />
    </div>
    <div className={style['detection-card__title']}>
      Privacy Well Set!
    </div>
    <div className={style['detection-card__button']}>
      <a className={[style.btn, style['btn-link']].join(' ')} target="_blank" rel="noopener noreferrer" href={infoUrl}>
        Show me what I&apos;ve done
      </a>
    </div>
  </div>
);

DetectionCardSuccess.propTypes = {
  onClose: PropTypes.func,
  infoUrl: PropTypes.string,
};

DetectionCardSuccess.defaultProps = {
  onClose: null,
  infoUrl: '#',
};

export default DetectionCardSuccess;
