import React from 'react';

import { storiesOf } from '@storybook/react';
import Layout from './index';

import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import addonBackgrounds from "@storybook/addon-backgrounds";
import { Welcome } from '@storybook/react/demo';
import Button from '../components/Button.jsx'



export const backgrounds = addonBackgrounds([
  { name: "twitter-blue", value: "#00aced", default: true },
  { name: "facebook-blue", value: "#3b5998" },
]);

// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);
//
// storiesOf('Button', module)
//   .addDecorator( backgrounds )
//   .add('with text', () => <Button onClick={action('Great')}>Hello Button</Button>)
//   .add('with some emoji', () => (
//     <Button onClick={action('clicked')}>
//       <span role="img" aria-label="so cool">
//         😀 😎 👍 💯
//       </span>
//     </Button>
//   ));

storiesOf('Detection-UI', module)
  .addDecorator( backgrounds )
  .add('primary-button', () => (
    <Button>
      Deactivate
    </Button>
  ))
  .add('default-button', () => (
    <Button>
      Show Settings
    </Button>
  ));
