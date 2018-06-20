import React from 'react';
import ReactDOM from 'react-dom';

import DetectionCard from './components/DetectionCard';

const element = global.document.createElement('div');

global.document.body.appendChild(element);

ReactDOM.render(<DetectionCard />, element);
