import React from 'react';

import { IconLocation, IconFace } from '../components/Icons';

async function fetchDocument(url) {
  const response = await fetch(url, { credentials: 'include' });

  if (response.status !== 200) {
    throw Error(response.statusText);
  }

  const text = await response.text();
  const parser = new window.DOMParser();
  const document = parser.parseFromString(text, 'text/html');

  return document;
}

async function detectFaceRecognition() {
  const result = { title: 'Face Recognition', icon: <IconFace /> };

  try {
    const doc = await fetchDocument('https://www.facebook.com/settings?tab=facerec');
    const text = doc.querySelector('.fbSettingsListItemContent .fwb').textContent.toLowerCase();
    const enabled = ['yes', 'ja'].includes(text);

    result.suspicious = enabled;
  } catch (error) {
    result.error = error;
  }

  return result;
}

async function detectLocationSharing() {
  const result = { title: 'Location Sharing', icon: <IconLocation /> };

  try {
    const doc = await fetchDocument('https://www.facebook.com/settings?tab=location');
    const text = doc.getElementById('SettingsPage_Content').innerText.toLowerCase();
    const enabled = [
      'Dein Standort-Verlauf ist ein',
      'Your Location History is on',
    ].some(value => text.includes(value.toLowerCase()));

    result.suspicious = enabled;
  } catch (error) {
    result.error = error;
  }

  return result;
}

export default async function detect() {
  if (window.location.host !== 'www.facebook.com') {
    return [];
  }

  const result = [];

  result.push(await detectFaceRecognition());
  result.push(await detectLocationSharing());

  return result;
}
