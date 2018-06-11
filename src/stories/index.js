/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from '../components/Button';

storiesOf('Button', module)
  .add('default', () => (
    <Button>
      Show Settings
    </Button>
  ))
  .add('primary', () => (
    <Button primary>
      Deactivate
    </Button>
  ));
