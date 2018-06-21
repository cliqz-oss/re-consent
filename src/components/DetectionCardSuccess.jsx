import React from 'react';

import style from '../scss/index-plugin.scss';
import { IconClose, IconPrivacyOK } from './Icons';

const DetectionCardSuccess = () => (
  <div className={style['detection-card']}>
    <div className={style['detection-card__close']}>
      <IconClose />
    </div>
    <div className={[style['detection-card__icon'], style['detection-card__icon--success']].join(' ')}>
      <IconPrivacyOK />
    </div>
    <div className={style['detection-card__title']}>
      Privacy Well Set!
    </div>
    <div className={style['detection-card__button']}>
      <button className={[style.btn, style['btn-link']].join(' ')}>
        Show me what I&apos;ve done
      </button>
    </div>
  </div>
);

export default DetectionCardSuccess;
