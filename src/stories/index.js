/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { APPLICATION_STATE } from '../constants';
import PopupScanning from '../components/popup/PopupScanning';
import { IconCogWheel } from '../components/Icons';
import PopupHeader from '../components/popup/PopupHeader';
import PopupFooter from '../components/popup/PopupFooter';
import PopupListItemCheckbox from '../components/popup/PopupListItemCheckbox';
import PopupListItemButton from '../components/popup/PopupListItemButton';
import PopupList from '../components/popup/PopupList';
import Popup from '../components/popup/Popup';
import Tooltip from '../components/Tooltip';

import consentFixture from './fixtures/consent.json';
import featuresFixture from './fixtures/features.json';

import '../scss/index.scss';

const longTextFixture = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').join(' ');

storiesOf('Label', module)
  .add('active', () => (
    <span className="label label--active">
      Active
    </span>
  ))
  .add('inactive', () => (
    <span className="label label--inactive">
      Deactivated
    </span>
  ));


storiesOf('Tooltip', module)
  .add('placement bottom', () => (
    <Tooltip placement="bottom" content="Some description">
      Trigger Tooltip
    </Tooltip>
  ))
  .add('placement bottom with long content', () => (
    <Tooltip placement="bottom" content={longTextFixture}>
      Trigger
    </Tooltip>
  ))
  .add('placement left', () => (
    <div style={{ 'text-align': 'right', padding: '20px' }}>
      <Tooltip placement="left" content="Some description">
        Trigger Tooltip
      </Tooltip>
    </div>
  ));


storiesOf('Popup', module)
  .add('Scanning', () => (
    <Popup
      applicationState={APPLICATION_STATE.SCANNING}
      changeConsent={action('Change Consent')}
      siteName="Facebook.com"
    />
  ))
  .add('Review with disabled consent', () => (
    <Popup
      applicationState={APPLICATION_STATE.REVIEW}
      features={featuresFixture}
      consent={consentFixture}
      changeConsent={action('Change Consent')}
      siteName="Facebook.com"
    />
  ))
  .add('Review with enabled consent', () => (
    <Popup
      applicationState={APPLICATION_STATE.REVIEW}
      features={featuresFixture}
      consent={{ ...consentFixture, storageName: 'some-storage-name' }}
      changeConsent={action('Change Consent')}
      siteName="Facebook.com"
    />
  ))
  .add('Review with features only', () => (
    <Popup
      applicationState={APPLICATION_STATE.REVIEW}
      features={featuresFixture}
      changeConsent={action('Change Consent')}
      siteName="Facebook.com"
    />
  ));

storiesOf('PopupHeader', module)
  .add('Review', () => (
    <PopupHeader
      applicationState={APPLICATION_STATE.REVIEW}
      siteName="Facebook.com"
    />
  ))
  .add('Edited', () => (
    <PopupHeader
      applicationState={APPLICATION_STATE.EDITED}
      siteName="Facebook.com"
    />
  ));

storiesOf('PopupFooter', module)
  .add('PopupFooter', () => (
    <PopupFooter detailPageUrl="http://some-link" />
  ));

storiesOf('PopupScanning', module)
  .add('default', () => (
    <PopupScanning siteName="Facebook.com" />
  ));

storiesOf('PopupList', module)
  .add('PopupList', () => (
    <PopupList
      title="Some title"
      icon={<IconCogWheel />}
    >
      <PopupListItemButton
        title="Some title"
        description="some description"
        isActive
        deactivateButtonText="Deactivate"
        changeUrl="some-url"
        labels={{ true: 'active', false: 'inactive' }}
      />
      <PopupListItemCheckbox
        title="Some title"
        description="some description"
        checked
        onChange={action('Checkbox changed')}
      />
    </PopupList>
  ))
  .add('PopupList stacked', () => (
    <div>
      <PopupList
        title="List one"
        icon={<IconCogWheel />}
      >
        <PopupListItemButton
          title="Some title"
          description="some description"
          isActive
          deactivateButtonText="Deactivate"
          changeUrl="some-url"
          labels={{ true: 'active', false: 'inactive' }}
        />
      </PopupList>
      <PopupList
        title="List two"
        icon={<IconCogWheel />}
      >
        <PopupListItemCheckbox
          title="Some title"
          description="some description"
          checked
          onChange={action('Checkbox changed')}
        />
      </PopupList>
    </div>
  ));

storiesOf('PopupListItemButton', module)
  .add('PopupListItemButton active', () => (
    <PopupListItemButton
      title="Some title"
      description="some description"
      isActive
      deactivateButtonText="Deactivate"
      changeUrl="some-url"
      labels={{ true: 'active', false: 'inactive' }}
    />
  ))
  .add('PopupListItemButton inactive', () => (
    <PopupListItemButton
      title="Some title"
      description="some description"
      isActive={false}
      changeUrl="some-url"
      labels={{ true: 'active', false: 'inactive' }}
    />
  ))
  .add('PopupListItemButton long description & narrow container', () => (
    <div style={{ width: '300px' }}>
      <PopupListItemButton
        title="title"
        description={longTextFixture}
        isActive
        deactivateButtonText="Deactivate"
        changeUrl="some-url"
        labels={{ true: 'active', false: 'inactive' }}
      />
    </div>
  ))
  .add('PopupListItemButton long title & narrow container', () => (
    <div style={{ width: '300px' }}>
      <PopupListItemButton
        title={longTextFixture}
        description="some description"
        isActive
        deactivateButtonText="Deactivate"
        changeUrl="some-url"
        labels={{ true: 'active', false: 'inactive' }}
      />
    </div>
  ));

storiesOf('PopupListItemCheckbox', module)
  .add('PopupListItemCheckbox checked', () => (
    <PopupListItemCheckbox
      title="Some title"
      description="some description"
      checked
      disabled={false}
      onChange={action('Checkbox changed')}
    />
  ))
  .add('PopupListItemCheckbox unchecked', () => (
    <PopupListItemCheckbox
      title="Some title"
      description="some description"
      checked={false}
      disabled={false}
      onChange={action('Checkbox changed')}
    />
  ))
  .add('PopupListItemCheckbox disabled', () => (
    <PopupListItemCheckbox
      title="Some title"
      description="some description"
      checked
      disabled
      disabledHelpText="Some help text"
      onChange={action('Checkbox changed')}
    />
  ))
  .add('PopupListItemCheckbox without description', () => (
    <PopupListItemCheckbox
      title="Some title"
      checked
      onChange={action('Checkbox changed')}
    />
  ));
