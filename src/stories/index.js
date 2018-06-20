/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { storiesOf } from '@storybook/react';

import Page from '../components/Page';
import { IconStamp, IconPrivacyOK, IconClose, IconSkull, IconFace, IconCloseCopy } from '../components/Icons';

import '../index.css';
import detectIcon from '../assets/scan-icon.png';

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

storiesOf('Shadow', module)
  .add('default', () => (
    <div className="shadow p-2 m-2">
      Lorem ipsum
    </div>
  ));

storiesOf('Fields', module)
  .add('default', () => (
    <div className="form-group">
      <input type="text" className="form-control" placeholder="First Name" />
    </div>
  ))
  .add('invalid', () => (
    <div className="form-group">
      <input type="text" className="form-control is-invalid" placeholder="First Name" />
    </div>
  ))
  .add('valid', () => (
    <div className="form-group">
      <input type="text" className="form-control is-valid" placeholder="First Name" />
    </div>
  ));

storiesOf('Tick', module)
  .add('default', () => (
    <div className="tick" />
  ));

storiesOf('Arrow Down', module)
  .add('default', () => (
    <div style={{ margin: '2rem' }} >
      <span className="arrow-down" />
    </div>
  ));

storiesOf('Privacy Feature Card', module)
  .add('default', () => (
    <div className="privacy-feature-card shadow">
      <div className="container-fluid">
        <div className="row">
          <div className="col privacy-feature-card__icon">
            <span role="img" aria-label="smile">😀</span>
          </div>
          <div className="col privacy-feature-card__content">
            <strong>Face recognition</strong> <span className="badge badge-danger">Active</span><br />
            <div className="privacy-feature-card__subtitle">
              Allow Facebook to recognise your face in photos and videos?
            </div>
          </div>
          <div className="w-100" />
          <div className="col privacy-feature-card__about">
            <button className="btn btn-link">What is this ?</button>
          </div>
          <div className="col privacy-feature-card__cta">
            <button className="btn btn-primary">Deactivate</button>
          </div>
        </div>
      </div>
    </div>
  ));

storiesOf('Wizard Card', module)
  .add('letter-address-form', () => (
    <div className="wizard-card shadow">
      <div className="container-fluid">
        <div className="row">
          <div className="col wizard-card__icon">
            1
          </div>
          <div className="col wizard-card__content">
            <strong>Personalize your letter</strong> <br />
            Here is some desc
          </div>
          <div className="w-100" />
          <div className="col wizard-card__address-form">
            <form>
              <div className="row">
                <div className="col-6">
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="First Name" />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="Last Name" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="Address" />
                  </div>
                </div>
                <div className="col-3">
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="Post Code" />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <input type="text" className="form-control" placeholder="City" />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col wizard-card__buttons text-right">
            <button className="btn btn-primary">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  ))
  .add('letter-pdf', () => (
    <div className="wizard-card shadow">
      <div className="container-fluid">
        <div className="row">
          <div className="col wizard-card__icon">
            2
          </div>
          <div className="col wizard-card__content">
            <strong>Print generated PDF</strong> <br />
            Here is some desc
          </div>
          <div className="w-100" />
          <div className="col wizard-card__pdf">
            <div className="wizard-card__pdf-box">
              <div className="wizard-card__pdf__icon">
                PDF
              </div>
              <div className="wizard-card__pdf__content">
                <strong>Dana Nedamaldeen Nightmare for Facebook</strong> <nobr>4 MB PDF</nobr>
              </div>
              <div className="wizard-card__pdf__button">
                <button className="btn btn-secondary">
                  Print PDF
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col wizard-card__buttons text-right">
            <button className="btn btn-primary">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  ))
  .add('letter-send', () => (
    <div className="wizard-card shadow">
      <div className="container-fluid">
        <div className="row">
          <div className="col wizard-card__icon">
            3
          </div>
          <div className="col wizard-card__content">
            <strong>Bring it to the post office, we are paying for the stamp</strong> <br />
            Here is some desc
          </div>
        </div>
        <div className="row">
          <div className="col wizard-card__buttons text-right">
            <button className="btn btn-secondary">
              Print Free Stamp
            </button>
            <button className="btn btn-primary">
              Find next post box
            </button>
          </div>
        </div>
      </div>
    </div>
  ))
  .add('letter-done', () => (
    <div className="wizard-card wizard-card--done shadow">
      <div className="container-fluid">
        <div className="row">
          <div className="col wizard-card__icon">
            3
          </div>
          <div className="col wizard-card__content">
            <strong>Bring it to the post office, we are paying for the stamp</strong> <br />
            Here is some desc
          </div>
          <div className="col wizard-card__tick">
            <div className="tick" />
          </div>
        </div>
      </div>
    </div>
  ));

storiesOf('Header', module)
  .add('default', () => (
    <div className="header">
      <div className="container">
        <p className="header__title">Data infringement detected!</p>
        <p className="header__lead">
          <strong>Facebook</strong> is collecting your data and you should be aware of that.
          We have detected some of the suspicious ones.
        </p>
        <div className="header__buttons">
          <button className="btn btn-outline-light">
            What do they collect?
          </button>
          <button className="btn btn-light">
            Send a nightmare letter
          </button>
        </div>
        <a className="header__scroll-indicator" href="#scroll-to">
          <div className="header__scroll-indicator__arrow" />
        </a>
      </div>
    </div>
  ));

storiesOf('Settings Section', module)
  .add('default', () => (
    <div className="settings-section">
      <div className="container">
        <p className="settings-section__title">Write a Nightmare letter</p>
        <p className="settings-section__content">
          Lorem ipsum dolor sit amet, consetetur sadipscing elitr,
          sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
        </p>
        <div className="settings-section__button">
          <button className="btn btn-link">
            Show me a nightmare letter example
          </button>
        </div>
      </div>
    </div>
  ));

storiesOf('Footer', module)
  .add('default', () => (
    <div className="footer">
      © 2018 Cliqz All rights reserved.
    </div>
  ));

storiesOf('Detection Cards', module)
  .add('scanning', () => (
    <div style={{ margin: '2rem' }}>
      <div className="detection-card">
        <div className="detection-card__close">
          <IconClose />
        </div>
        <div className="detection-card__icon detection-card__icon--detect">
          <img src={detectIcon} alt="" />
        </div>
        <div className="detection-card__title detection-card__title--light">
          Facebook Privacy Scanning <span className="detection-card__title__progress"><span>.</span><span>.</span><span>.</span></span>
        </div>
      </div>
    </div>
  ))
  .add('suspicious', () => (
    <div style={{ margin: '2rem' }}>
      <div className="detection-card">
        <div className="detection-card__close">
          <IconClose />
        </div>
        <div className="detection-card__icon detection-card__icon--suspicious">
          <IconSkull />
        </div>
        <div className="detection-card__title">
          Suspicious infringement of privacy detected!
        </div>
        <div className="detection-card__summary">
          <div className="detection-card__summary__item">
            <div className="detection-card__summary__item__icon">
              <IconFace />
            </div>
            <div className="detection-card__summary__item__title">
              Face Recognition
            </div>
            <div className="detection-card__summary__item__badge">
              <span className="badge badge-danger">
                Active
              </span>
            </div>
          </div>
          <div className="detection-card__summary__line" />
          <div className="detection-card__summary__item">
            <div className="detection-card__summary__item__icon">
              <IconCloseCopy />
            </div>
            <div className="detection-card__summary__item__title">
              Cambridge Analytica
            </div>
            <div className="detection-card__summary__item__badge">
              <span className="badge badge-danger">
                Public
              </span>
            </div>
          </div>
          <div className="detection-card__summary__cta">
            <button className="btn btn-primary">
              How to Deactivate?
            </button>
          </div>
          <div className="detection-card__summary__ignore-link">
            <button className="btn btn-link btn-icon">
              <span>Remind me later</span> &nbsp;
              <span className="arrow-down" />
            </button>
          </div>
        </div>
      </div>
    </div>
  ))
  .add('success', () => (
    <div style={{ margin: '2rem' }}>
      <div className="detection-card">
        <div className="detection-card__close">
          <IconClose />
        </div>
        <div className="detection-card__icon detection-card__icon--success">
          <IconPrivacyOK />
        </div>
        <div className="detection-card__title">
          Privacy Well Set!
        </div>
        <div className="detection-card__button">
          <button className="btn btn-link">
            Show me what I&apos;ve done
          </button>
        </div>
      </div>
    </div>
  ));

storiesOf('Page', module)
  .add('default', () => (
    <Page />
  ));
