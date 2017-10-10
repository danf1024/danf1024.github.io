import React from 'react';
import _ from 'lodash';

import AcceptedConfirmation from './AcceptedConfirmation';
import DeclinedConfirmation from './DeclinedConfirmation';
import EntreeSelection from './EntreeSelection';
import GuestName from './GuestName';

export default class Response extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      invitation: this.props.invitation,
      step: 0,
      rsvp: {
        rsvpCode: this.props.invitation.rsvpCode,
        accepted: true,
        guests: this.props.invitation.guests.map((guest) => _.merge(guest, { valid: true, entreeSelection: 'salmon' }))
      }
    };
    this.handleAccpetedChanged = this.handleAccpetedChanged.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleContinue = this.handleContinue.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.updateGuest = this.updateGuest.bind(this);
    this.removeGuest = this.removeGuest.bind(this);
    this.updateComment = this.updateComment.bind(this);
  }
  isValid () {
    return !this.state.rsvp.accepted || this.state.rsvp.guests.every((guest) => !(_.isNull(guest.name) || guest.name === ''));
  }
  validate () {
    if (this.state.rsvp.accepted) {
      this.setState((prevState, props) => {
        let newState = {
          rsvp: _.extend(prevState.rsvp,
            { guests: prevState.rsvp.guests.map((guest) => _.merge(guest, { valid: !(_.isNull(guest.name) || guest.name === '') })) }
          )
        }
        return newState
      });
    }
  }
  handleAccpetedChanged (e) {
    let value = e.target.value;
    this.setState(function(prevState, props) {
      return { rsvp: _.extend(prevState.rsvp, { accepted: (value == 'true') }) };
    }.bind(this));
  }
  handleContinue (e) {
    e.preventDefault();

    this.validate();
    if (!this.isValid()) {
      return;
    }

    if (this.state.step == 0 && !this.state.rsvp.accepted) {
      this.setState({ step: this.state.step + 2 });
    } else {
      this.setState({ step: this.state.step + 1 });
    }
  }
  handleSubmit (e) {
    e.preventDefault();
    this.props.submitRsvp(this.state.rsvp);
  }
  handleBack (e) {
    e.preventDefault();
    if (this.state.rsvp.accepted) {
      this.setState({ step: this.state.step - 1 });
    } else {
      this.setState({ step: 0 });
    }
  }
  removeGuest (guestId) {
    this.setState((prevState, props) => {
      return { rsvp: _.extend(prevState.rsvp, { guests: prevState.rsvp.guests.filter(guest => guest.id !== guestId) }) };
    });
  }
  updateGuest (guest) {
    this.setState((prevState, props) => {
      prevState.rsvp.guests[prevState.rsvp.guests.findIndex(g => g.id === guest.id)] = guest;
      return { rsvp: _.extend(prevState.rsvp, { guests: prevState.rsvp.guests }) };
    });
  }
  updateComment (comment) {
    this.setState((prevState, props) => {
      return { rsvp: _.extend(prevState.rsvp, { comment: comment }) };
    });
  }
  render () {
    if (this.state.step == 0) {
      return (
        <div>
          <form className="uk-form-stacked">
            <legend className="uk-legend uk-text-center uk-margin">{this.state.invitation.addressee}</legend>
            {this.state.rsvp.guests.map((guest, idx) =>
              <GuestName key={idx} idx={idx} guest={guest} updateGuest={this.updateGuest} removeGuest={this.removeGuest} />
            )}
            <div className="uk-grid-small uk-margin-medium" data-uk-grid>
              <div className="uk-width-1-2@s">
                <label className="uk-form-label">
                  <input className="uk-radio" type="radio" value="true" checked={this.state.rsvp.accepted} onChange={this.handleAccpetedChanged} />
                  <span className="uk-padding-small">Accept{this.state.rsvp.guests.length == 1 && 's'} with pleasure</span>
                </label>
              </div>
              <div className="uk-width-1-2@s">
                <label className="uk-form-label">
                  <input className="uk-radio" type="radio" value="false" checked={!this.state.rsvp.accepted} onChange={this.handleAccpetedChanged} />
                  <span className="uk-padding-small">Regretfully decline{this.state.rsvp.guests.length == 1 && 's'}</span>
                </label>
              </div>
            </div>
            <button className="uk-button uk-button-primary uk-width-1-1" onClick={this.handleContinue}>Continue</button>
          </form>
        </div>
      )
    } else if (this.state.step == 1) {
      return <EntreeSelection guests={this.state.rsvp.guests} updateGuest={this.updateGuest} handleBack={this.handleBack} handleContinue={this.handleContinue} />
    } else if (this.state.rsvp.accepted) {
      return <AcceptedConfirmation rsvp={this.state.rsvp} updateComment={this.updateComment} handleBack={this.handleBack} handleSubmit={this.handleSubmit} />
    } else {
      return <DeclinedConfirmation invitation={this.state.invitation} updateComment={this.updateComment} handleBack={this.handleBack} handleSubmit={this.handleSubmit} />
    }
  }
}
