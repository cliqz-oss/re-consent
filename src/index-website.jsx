import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './scss/index-website.scss';


const urlString = 'http://localhost:8080/?data={%22suspiciousFeatures%22:[{%22key%22:%22face%22,%22suspicious%22:true},{%22key%22:%22location%22,%22suspicious%22:false}],%22site%22:%22facebook%22}';

// const { urlString } = window.location.search;

const requestUrl = new URL(urlString);
const urlParams = JSON.parse(requestUrl.searchParams.get('data'));

ReactDOM.render(
  <App
    site={urlParams.site}
    face={urlParams.suspiciousFeatures[0]}
    locationSharing={urlParams.suspiciousFeatures[1]}
  />,
  global.document.getElementById('root'),
);
