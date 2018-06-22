import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import DetectionCard from '../components/DetectionCard';
import { triggerDetection } from '../features';


const url = String(window.location);

if (triggerDetection(url)) {
  const element = global.document.createElement('div');

  global.document.body.appendChild(element);

  ReactDOM.render(<DetectionCard />, element);
}
