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
