import React from 'react';

import Comment from './Comment';

const ENTREE_NAMES = {
  salmon: 'Atlantic Salmon',
  duck: 'Roast Duck',
  surf_n_turf: 'Surf & Turf',
  veg: 'Vegetarian'
};

export default (props) => (
  <div>
    <h3 className="uk-text-center">Confirm your response</h3>
    <div className="uk-margin-medium">
      <h4 className="uk-text-center uk-margin-remove-bottom">{props.rsvp.guests.map((guest) => guest.name).join(' & ')}</h4>
      <p className="uk-text-center confirmation-value"><strong>Accept{props.rsvp.guests.length == 1 && 's'} with pleasure</strong></p>
    </div>
    {props.rsvp.guests.map((guest, idx) =>
      <div key={idx} className="uk-margin-medium">
        <p className="uk-text-center uk-margin-remove-bottom">Entr&eacute;e selection for {guest.name}</p>
        <p className="uk-text-center confirmation-value"><strong>{ENTREE_NAMES[guest.entreeSelection]}</strong></p>
      </div>
    )}
    <Comment placeholder="Comments, food allergies, dietary restrictions, etc." handleBack={props.handleBack} handleSubmit={props.handleSubmit} updateComment={props.updateComment} />
  </div>
);
