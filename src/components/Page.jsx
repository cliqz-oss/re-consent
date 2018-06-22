import React from 'react';

import { IconLocation, IconFace, IconCloseCopy, IconThirdPartyAccess, IconAds, IconStamp, IconPrint, IconArrowRight, IconOneNo, IconTwoNo, IconThreeNo } from './Icons';


const Page = ({ site, features }) => (
  <div className="page">
    <div className="header">
      <div className="container">
        <p className="header__title">Data infringement detected!</p>
        <p className="header__lead">
          <strong> {site} </strong>
          is collecting your data and you should be aware of that.
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

    <div id="scroll-to" />

    <div className="settings-section">
      <div className="container">
        <p className="settings-section__title">Detected Data</p>
        <div className="settings-section__cards">

          {features.map(feature => (
            <div className="privacy-feature-card shadow">
              <div className="container-fluid">
                <div className="row">
                  <div className="col privacy-feature-card__icon">
                    { feature.icon }
                  </div>
                  <div className="col privacy-feature-card__content">
                    <strong>{feature.title}</strong>
                    { feature.suspicious
                      ? <span className="badge badge-danger">Active</span>
                      : <span className="badge badge-primary">Deactivated</span>
                    }<br />
                    {feature.description}
                  </div>
                  <div className="w-100" />
                  <div className="col privacy-feature-card__about">
                    <button className="btn btn-link">What is this ?</button>
                  </div>
                  <div className="col privacy-feature-card__cta">
                    { feature.suspicious
                      ? <button className="btn btn-primary">Deactivate</button>
                      : <button className="btn btn-secondary">Show Settings</button>
                    }
                  </div>
                </div>
              </div>
            </div>
            ))}

        </div>
      </div>
    </div>

    <div className="settings-section">
      <div className="container">
        <p className="settings-section__title">Manually check data</p>

        <div className="settings-section__cards">
          <div className="privacy-feature-card shadow">
            <div className="container-fluid">
              <div className="row">
                <div className="col privacy-feature-card__icon">
                  <IconThirdPartyAccess />
                </div>
                <div className="col privacy-feature-card__content">
                  <strong>Third Party Data Access</strong><br />
                  <div className="privacy-feature-card__subtitle">
                      Allow third party applications to access your data through Facebook ?
                  </div>
                </div>
                <div className="w-100" />
                <div className="col privacy-feature-card__about">
                  <button className="btn btn-link">What is this ?</button>
                </div>
                <div className="col privacy-feature-card__cta">
                  <button className="btn btn-secondary">Show Setting</button>
                </div>
              </div>
            </div>
          </div>

          <div className="privacy-feature-card shadow">
            <div className="container-fluid">
              <div className="row">
                <div className="col privacy-feature-card__icon">
                  <IconAds />
                </div>
                <div className="col privacy-feature-card__content">
                  <strong>Advertisers who uploaded your data to Facebook</strong><br />
                  <div className="privacy-feature-card__subtitle">
                      Advertisers are running ads using a contact list they uploaded that
                      includes your contact information
                  </div>
                </div>
                <div className="w-100" />
                <div className="col privacy-feature-card__about">
                  <button className="btn btn-link">What is this ?</button>
                </div>
                <div className="col privacy-feature-card__cta">
                  <button className="btn btn-secondary">Show Setting</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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

        <div className="settings-section__cards">
          <div className="wizard-card wizard-card--current shadow">
            <div className="container-fluid">
              <div className="row">
                <div className="col wizard-card__icon">
                  <IconOneNo />
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

          <div className="wizard-card shadow">
            <div className="container-fluid">
              <div className="row">
                <div className="col wizard-card__icon">
                  <IconTwoNo />
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
                      <button className="btn btn-secondary btn-icon">
                        <IconPrint />
                        <span>Print PDF</span>
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

          <div className="wizard-card shadow">
            <div className="container-fluid">
              <div className="row">
                <div className="col wizard-card__icon">
                  <IconThreeNo />
                </div>
                <div className="col wizard-card__content">
                  <strong>Bring it to the post office, we are paying for the stamp <span role="img" aria-label="claps">👏</span></strong><br />
                  Here is some desc
                </div>
              </div>
              <div className="row">
                <div className="col wizard-card__buttons text-right">
                  <button className="btn btn-secondary btn-icon">
                    <IconStamp />
                    <span>Print Free Stamp</span>
                  </button>
                  <button className="btn btn-primary btn-icon">
                    <span>Find next post box</span>
                    <IconArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="footer">
      © 2018 Cliqz All rights reserved.
    </div>
  </div>
);

export default Page;
