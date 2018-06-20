import React from 'react';

import detectIcon from '!url-loader!../assets/scan-icon.png';
import style from '../scss/index-plugin.scss';
import { IconClose } from './Icons';

const DetectionCardScanning = () => (
  <div className={style['detection-card']}>
    <div className={style['detection-card__close']}>
      <IconClose />
    </div>
    <div className={[style['detection-card__icon'], style['detection-card__icon--detect']].join(' ')}>
      <img src={detectIcon} alt="" />
    </div>
    <div className={[style['detection-card__title'], style['detection-card__title--light']].join(' ')}>
      Facebook Privacy Scanning <span className={style['detection-card__title__progress']}><span>.</span><span>.</span><span>.</span></span>
    </div>
  </div>
);

export default DetectionCardScanning;
