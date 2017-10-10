import React from 'react';

import GuestEntreeSelection from './GuestEntreeSelection';

export default (props) => (
  <div>
    {props.guests.map((guest, idx) =>
      <GuestEntreeSelection key={idx} guest={guest} updateGuest={props.updateGuest} />
    )}
    <button className="uk-button uk-button-default uk-width-1-2" onClick={props.handleBack}>Back</button>
    <button className="uk-button uk-button-primary uk-width-1-2" onClick={props.handleContinue}>Continue</button>
  </div>
);
