/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { storiesOf } from '@storybook/react';

import '../index.css';

storiesOf('Button', module)
  .add('primary', () => (
    <button className="btn btn-primary">
      Deactivate
    </button>
  ))
  .add('secondary', () => (
    <button className="btn btn-secondary">
      Show Setting
    </button>
  ))
  .add('link', () => (
    <button className="btn btn-link">
      What is this?
    </button>
  ))
  .add('light', () => (
    <div style={{ background: '#00AEF0', padding: '2em' }}>
      <button className="btn btn-light">
        Send a nightmare letter
      </button>
      &nbsp;
      <button className="btn btn-outline-light">
        What do they collect?
      </button>
    </div>
  ));

storiesOf('Badge', module)
  .add('primary', () => (
    <span className="badge badge-primary">
      Deactivated
    </span>
  ))
  .add('danger', () => (
    <span className="badge badge-danger">
      Active
    </span>
  ));

storiesOf('Shadow', module)
  .add('default', () => (
    <div className="shadow p-2 m-2">
      Lorem ipsum
    </div>
  ));

storiesOf('Privacy Feature Card', module)
  .add('default', () => (
    <div className="privacy-feature-card shadow">
      <div className="container">
        <div className="row">
          <div className="col privacy-feature-card__icon">
            <span role="img" aria-label="smile">😀</span>
          </div>
          <div className="col privacy-feature-card__content">
            <strong>Face recognition</strong> <span className="badge badge-danger">Active</span><br />
            Allow Facebook to recognise your face in photos and videos?
          </div>
          <div className="col privacy-feature-card__about">
            <button className="btn btn-link">About</button>
          </div>
          <div className="col privacy-feature-card__cta">
            <button className="btn btn-primary">Deactivate</button>
          </div>
        </div>
      </div>
    </div>
  ));

storiesOf('Fields', module)
  .add('default', () => (
    <div clallName="form-group">
      <input type="text" className="form-control" placeholder="First Name" />
    </div>
  ));
