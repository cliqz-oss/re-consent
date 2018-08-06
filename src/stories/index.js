/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { storiesOf } from '@storybook/react';

import DetectionCardScanning from '../components/DetectionCardScanning';
import DetectionCardSuccess from '../components/DetectionCardSuccess';
import DetectionCardSuspicious from '../components/DetectionCardSuspicious';
import { IconFace, IconLocation, IconStamp } from '../components/Icons';


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
  .add('info', () => (
    <button className="btn btn-info">
      How to deactivate?
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
  ))
  .add('with-icon', () => (
    <button className="btn btn-secondary btn-icon">
      <IconStamp />
      <span>Print Free Stamp</span>
    </button>
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

storiesOf('Detection Cards', module)
  .add('scanning', () => (
    <div style={{ margin: '2rem' }}>
      <DetectionCardScanning />
    </div>
  ))
  .add('suspicious', () => (
    <div style={{ margin: '2rem' }}>
      <DetectionCardSuspicious
        features={[
          { suspicious: true, icon: <IconFace />, title: 'Face Recognition' },
          { suspicious: true, icon: <IconLocation />, title: 'Location Sharing' },
        ]}
      />
    </div>
  ))
  .add('success', () => (
    <div style={{ margin: '2rem' }}>
      <DetectionCardSuccess />
    </div>
  ));
