/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { APPLICATION_STATE } from '../constants';
import DetectionCardScanning from '../components/DetectionCardScanning';
import DetectionCardSuccess from '../components/DetectionCardSuccess';
import DetectionCardSuspicious from '../components/DetectionCardSuspicious';
import { IconFace, IconLocation, IconStamp } from '../components/Icons';
import PopupHeader from '../components/popup/PopupHeader';
import PopupFooter from '../components/popup/PopupFooter';
import PopupListItemCheckbox from '../components/popup/PopupListItemCheckbox';
import PopupListItemButton from '../components/popup/PopupListItemButton';
import PopupList from '../components/popup/PopupList';
import Popup from '../components/popup/Popup';

import consentFixture from './fixtures/consent.json';
import featuresFixture from './fixtures/features.json';

import '../scss/index.scss';

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

storiesOf('Popup', module)
  .add('Scanning', () => (
    <Popup
      applicationState={APPLICATION_STATE.SCANNING}
      changeConsent={action('Change Consent')}
    />
  ))
  .add('Review with disabled consent', () => (
    <Popup
      applicationState={APPLICATION_STATE.REVIEW}
      features={featuresFixture}
      consent={consentFixture}
      changeConsent={action('Change Consent')}
    />
  ))
  .add('Review with enabled consent', () => (
    <Popup
      applicationState={APPLICATION_STATE.REVIEW}
      features={featuresFixture}
      consent={{ ...consentFixture, storageName: 'some-storage-name' }}
      changeConsent={action('Change Consent')}
    />
  ))
  .add('Review with features only', () => (
    <Popup
      applicationState={APPLICATION_STATE.REVIEW}
      features={featuresFixture}
      changeConsent={action('Change Consent')}
    />
  ));

storiesOf('PopupHeader', module)
  .add('Review', () => (
    <PopupHeader applicationState={APPLICATION_STATE.REVIEW} />
  ))
  .add('Edited', () => (
    <PopupHeader applicationState={APPLICATION_STATE.EDITED} />
  ));

storiesOf('PopupFooter', module)
  .add('PopupFooter', () => (
    <PopupFooter detailPageUrl="http://some-link" />
  ));

storiesOf('PopupList', module)
  .add('PopupList', () => (
    <PopupList
      title="Some title"
      icon="IconFace"
    >
      <PopupListItemButton
        title="Some title"
        isActive
        changeUrl="some-url"
      />
      <PopupListItemCheckbox
        title="Some title"
        checked
        onChange={action('Checkbox changed')}
      />
    </PopupList>
  ))
  .add('PopupList stacked', () => (
    <div>
      <PopupList
        title="List one"
        icon="IconFace"
      >
        <PopupListItemButton
          title="Some title"
          isActive
          changeUrl="some-url"
        />
      </PopupList>
      <PopupList
        title="List two"
        icon="IconFace"
      >
        <PopupListItemCheckbox
          title="Some title"
          checked
          onChange={action('Checkbox changed')}
        />
      </PopupList>
    </div>
  ));

storiesOf('PopupListItem', module)
  .add('PopupListItemButton active', () => (
    <PopupListItemButton
      title="Some title"
      isActive
      changeUrl="some-url"
    />
  ))
  .add('PopupListItemButton inactive', () => (
    <PopupListItemButton
      title="Some title"
      isActive={false}
      changeUrl="some-url"
    />
  ))
  .add('PopupListItemCheckbox checked', () => (
    <PopupListItemCheckbox
      title="Some title"
      checked
      disabled={false}
      onChange={action('Checkbox changed')}
    />
  ))
  .add('PopupListItemCheckbox unchecked', () => (
    <PopupListItemCheckbox
      title="Some title"
      checked={false}
      disabled={false}
      onChange={action('Checkbox changed')}
    />
  ))
  .add('PopupListItemCheckbox disabled', () => (
    <PopupListItemCheckbox
      title="Some title"
      checked
      disabled
      onChange={action('Checkbox changed')}
    />
  ));
