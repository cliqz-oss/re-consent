import React from 'react';

import style from '../scss/index-plugin.scss';
import { IconClose, IconCloseCopy, IconFace, IconSkull } from './Icons';

const DetectionCardSuspicious = () => (
  <div className={style['detection-card']}>
    <div className={style['detection-card__close']}>
      <IconClose />
    </div>
    <div className={[style['detection-card__icon'], style['detection-card__icon--suspicious']].join(' ')}>
      <IconSkull />
    </div>
    <div className={style['detection-card__title']}>
      Suspicious infringement of privacy detected!
    </div>
    <div className={style['detection-card__summary']}>
      <div className={style['detection-card__summary__item']}>
        <div className={style['detection-card__summary__item__icon']}>
          <IconFace />
        </div>
        <div className={style['detection-card__summary__item__title']}>
          Face Recognition
        </div>
        <div className={style['detection-card__summary__item__badge']}>
          <span className={[style.badge, style['badge-danger']].join(' ')}>
            Active
          </span>
        </div>
      </div>
      <div className={style['detection-card__summary__line']} />
      <div className={style['detection-card__summary__item']}>
        <div className={style['detection-card__summary__item__icon']}>
          <IconCloseCopy />
        </div>
        <div className={style['detection-card__summary__item__title']}>
          Cambridge Analytica
        </div>
        <div className={style['detection-card__summary__item__badge']}>
          <span className={[style.badge, style['badge-danger']].join(' ')}>
            Public
          </span>
        </div>
      </div>
      <div className={style['detection-card__summary__cta']}>
        <button className={[style.btn, style['btn-primary']].join(' ')}>
          How to Deactivate?
        </button>
      </div>
      <div className={style['detection-card__summary__ignore-link']}>
        <button className={[style.btn, style['btn-link']].join(' ')}>
          <span>Remind me later</span> &nbsp;
          <span className={style['arrow-down']} />
        </button>
      </div>
    </div>
  </div>
);

export default DetectionCardSuspicious;
