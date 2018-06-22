import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './scss/index-website.scss';


const urlString = 'http://localhost:8080/?data={%22suspiciousFeatures%22:[{%22key%22:%22face%22,%22suspicious%22:false},{%22key%22:%22location%22,%22suspicious%22:true}],%22site%22:%22facebook%22}';

// const { urlString } = window.location.search;

const requestUrl = new URL(urlString);
const urlParams = JSON.parse(requestUrl.searchParams.get('data'));

const features = [
  {
    key: 'face',
    icon: 'IconFace',
    title: 'Face Recognition',
    description: 'Allow Facebook to recognise your face in photos and videos?',
    suspicious: urlParams.suspiciousFeatures[0].suspicious,
  },
  {
    key: 'location',
    icon: 'IconLocation',
    title: 'Location Sharing',
    description: 'Allow Facebook to build a history of the locations you have been to?',
    suspicious: urlParams.suspiciousFeatures[1].suspicious,
  },
];

ReactDOM.render(
  <App
    site={urlParams.site}
    features={features}
  />,
  global.document.getElementById('root'),
);
