import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import { features } from './features';

import './scss/index-website.scss';

const url = new URL(window.location);
const urlParams = JSON.parse(url.searchParams.get('data'));

const { site, suspiciousFeatures } = urlParams;

function isSuspicious(key) {
  const matches = suspiciousFeatures.filter(suspiciousFeature => suspiciousFeature.key === key);
  if (matches.length) {
    return matches[0].suspicious;
  }

  return false;
}

const enrichedFeatures = features[site.toLowerCase()].map(feature => ({
  ...feature,
  suspicious: isSuspicious(feature.key),
}));


ReactDOM.render(
  <App
    site={site}
    features={enrichedFeatures}
  />,
  global.document.getElementById('root'),
);
