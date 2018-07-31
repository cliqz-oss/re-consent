import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';
import { ConsentString } from 'consent-string';
import { connect } from 'react-redux';

const PURPOSES = {
  1: 'Information storage and access',
  2: 'Personalisation',
  3: 'Ad selection, delivery, reporting',
  4: 'Content selection, delivery, reporting',
  5: 'Measurement',
};

const ConsentCard = ({ consent, changeConsent }) => {
  if (!consent) {
    return null;
  }

  const { consentData, vendorConsents } = consent;
  const { gdprApplies } = consentData;
  const { purposeConsents } = vendorConsents;
  const readOnly = !consent.storageName;
  const consentString = new ConsentString(consentData.consentData);

  return (
    <div>
      <p>GDPR applies? {gdprApplies ? 'Yes' : 'No'}</p>

      {readOnly && (
        <p>No consent cookie found, cannot update consent settings.</p>
      )}

      {Object.keys(PURPOSES).map((purposeId) => {
        const purposeTitle = PURPOSES[purposeId];
        const allowed = purposeConsents[purposeId];
        const optOut = () => changeConsent(consent, [purposeId], false);
        const optIn = () => changeConsent(consent, [purposeId], true);

        return (
          <div key={purposeId}>
            <p>{purposeTitle}</p>
            <p>
              {
                allowed
                ? <button disabled={readOnly} onClick={optOut}>Opt-Out</button>
                : <button disabled={readOnly} onClick={optIn}>Opt-In</button>
              }
            </p>
          </div>
        );
      })}

      <p>
        Obtained {moment(consentString.created).fromNow()},
        updated {moment(consentString.lastUpdated).fromNow()}
      </p>

      <p>
        <a
          href="https://advertisingconsent.eu/cmp-list/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CMP ID:
        </a> {consentString.cmpId}
      </p>
    </div>
  );
};

ConsentCard.propTypes = {
  consent: PropTypes.shape({
    consentData: PropTypes.object.isRequired,
    vendorConsents: PropTypes.object.isRequired,
    vendorList: PropTypes.object,
    storageName: PropTypes.string,
  }),
  changeConsent: PropTypes.func.isRequired,
};

ConsentCard.defaultProps = {
  consent: null,
};

const mapStateToProps = (state) => {
  const { consent } = state;
  return { consent };
};

const mapDispatchToProps = (dispatch, props) => ({
  changeConsent(consent, purposeIds, allowed) {
    const { vendorConsents } = consent;
    const purposeConsents = { ...vendorConsents.purposeConsents };

    purposeIds.forEach((purposeId) => {
      purposeConsents[purposeId] = allowed;
    });

    consent = {
      ...consent,
      vendorConsents: {
        ...vendorConsents,
        purposeConsents,
      },
    };

    props.changeConsent(consent);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ConsentCard);
