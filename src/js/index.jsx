import 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import React from 'react';
import {render} from 'react-dom';
import _ from 'lodash';

import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

const API_BASE_URL = "https://shielded-hamlet-90527.herokuapp.com/api/";
const ENTREE_NAMES = {
  salmon: 'Atlantic Salmon',
  duck: 'Roast Duck',
  surf_n_turf: 'Surf & Turf',
  veg: 'Vegetarian'
}
const SPINNER_HTML = "<div class=\"rsvp-spinner\" uk-spinner></div>";

let showSpinner = function() {
  let $el = $('#rsvp-form');
  $el.css('opacity', 0.5);
  $el.css('position', 'relative');
  $el.append(SPINNER_HTML);
}

let hideSpinner = function() {
  let $el = $('#rsvp-form');
  $el.find('.rsvp-spinner').remove();
  $el.css('position', 'auto');
  $el.css('opacity', 1);
}

class RsvpComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = { isComplete: false, isError: false, invitation: null, invitationExists: true }
    this.submitRsvp = this.submitRsvp.bind(this);
    this.fetchInvitation = this.fetchInvitation.bind(this);
  }
  submitRsvp (rsvp) {
    showSpinner();
    $.post({ url: API_BASE_URL + 'rsvps', data: rsvp, dataType: 'text'})
      .done(() => this.setState({ isComplete: true }))
      .fail(() => this.setState({ isError: true }))
      .always(() => hideSpinner());
  }
  fetchInvitation (rsvpCode) {
    showSpinner();
    $.get(API_BASE_URL + 'invitations/' + rsvpCode)
      .done((data) => this.setState({ invitation: data, invitationExists: true }))
      .fail(() => this.setState({ invitationExists: false }))
      .always(() => hideSpinner());
  }
  render () {
    if (this.state.isError) {
      return <ErrorComponent />
    } else if (this.state.isComplete) {
      return <CheckmarkComponent message="Your response has been recorded!" />
    } else if (_.isNull(this.state.invitation)) {
      return <RsvpCodeComponent fetchInvitation={this.fetchInvitation} invitationExists={this.state.invitationExists} />
    } else if (this.state.invitation.acceptedAt || this.state.invitation.declinedAt) {
      return <CheckmarkComponent message="You've already responded!" />
    } else {
      return <ResponseComponent submitRsvp={this.submitRsvp} invitation={this.state.invitation} />
    }
  }
}

class ErrorComponent extends React.Component {
  render() {
    return (
      <div>
        <div className="error-icon uk-flex uk-flex-around">
          <svg viewBox="0 0 328.51 328.51">
            <path d="M164.255,0C73.685,0,0,73.685,0,164.255S73.685,328.51,164.255,328.51S328.51,254.825,328.51,164.255S254.825,0,164.255,0
              z M164.255,313.51C81.955,313.51,15,246.555,15,164.255S81.955,15,164.255,15S313.51,81.955,313.51,164.255
              S246.555,313.51,164.255,313.51z"/>
            <polygon points="229.044,88.858 164.255,153.647 99.466,88.858 88.858,99.466 153.647,164.255 88.858,229.044 99.466,239.651
              164.255,174.862 229.044,239.651 239.651,229.044 174.862,164.255 239.651,99.466    "/>
          </svg>
        </div>
        <h4 className="uk-text-center">Something went wrong :(</h4>
        <p className="uk-text-center">
          Try again or <a href="mailto:danf1024@gmail.com">contact us</a> if you continue to have issues.
        </p>
      </div>
    )
  }
}

class CheckmarkComponent extends React.Component {
  render() {
    return (
      <div>
        <div className="checkmark-icon uk-flex uk-flex-around">
          <svg viewBox="0 0 363.025 363.024">
            <path d="M181.512,363.024C81.43,363.024,0,281.601,0,181.513C0,81.424,81.43,0,181.512,0     c100.083,0,181.513,81.424,181.513,181.513C363.025,281.601,281.595,363.024,181.512,363.024z M181.512,11.71     C87.88,11.71,11.71,87.886,11.71,181.513s76.17,169.802,169.802,169.802c93.633,0,169.803-76.175,169.803-169.802     S275.145,11.71,181.512,11.71z" fill="#003728"/>
            <polygon points="147.957,258.935 83.068,194.046 91.348,185.767 147.957,242.375 271.171,119.166     279.451,127.445   " fill="#003728"/>
          </svg>
        </div>
        <h4 className="uk-text-center">{this.props.message}</h4>
      </div>
    )
  }
}

class RsvpCodeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.fetchInvitation = this.fetchInvitation.bind(this);
  }
  handleChange (e) {
    this.setState({ rsvpCode: e.target.value.toLowerCase() });
  }
  fetchInvitation (e) {
    e.preventDefault();
    this.props.fetchInvitation(this.state.rsvpCode);
  }
  render () {
    let label = null;
    let inputClassName = "uk-input uk-form-width-small";

    if (this.props.invitationExists) {
      label = <label className="uk-form-label">Your invitation code</label>;
    } else {
      label = <label className="uk-form-label rsvp-form-error-label">Invitation not found</label>;
      inputClassName += ' uk-form-danger';
    }

    return (
      <div>
        <form className="uk-form-horizontal">
          <div className="uk-margin">
            {label}
            <div className="uk-form-controls">
              <input className={inputClassName} id="form-horizontal-text" type="text" onChange={this.handleChange} />
            </div>
          </div>
          <button className="uk-button uk-button-primary uk-width-1-1" onClick={this.fetchInvitation}>Continue</button>
        </form>
      </div>
    )
  }
}

class ResponseComponent extends React.Component {
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
    this.setState({ step: this.state.step - 1 });
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
              <GuestNameComponent key={idx} idx={idx} guest={guest} updateGuest={this.updateGuest} removeGuest={this.removeGuest} />
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
                  <span className="uk-padding-small">Decline{this.state.rsvp.guests.length == 1 && 's'} with regret</span>
                </label>
              </div>
            </div>
            <button className="uk-button uk-button-primary uk-width-1-1" onClick={this.handleContinue}>Continue</button>
          </form>
        </div>
      )
    } else if (this.state.step == 1) {
      return <EntreeSelectionComponent guests={this.state.rsvp.guests} updateGuest={this.updateGuest} handleBack={this.handleBack} handleContinue={this.handleContinue} />
    } else if (this.state.rsvp.accepted) {
      return <AcceptedConfirmationComponent rsvp={this.state.rsvp} updateComment={this.updateComment} handleBack={this.handleBack} handleSubmit={this.handleSubmit} />
    } else {
      return <DeclinedConfirmationComponent invitation={this.state.invitation} updateComment={this.updateComment} handleBack={this.handleBack} handleSubmit={this.handleSubmit} />
    }
  }
}

class DeclinedConfirmationComponent extends React.Component {
  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange (e) {
    this.setState({ comment: e.target.value }, () => { this.props.updateComment(this.state.comment); });
  }
  render () {
    return (
      <div>
        <h3 className="uk-text-center">Confirm your response</h3>
        <div className="uk-margin-medium">
          <h4 className="uk-text-center uk-margin-remove-bottom">{this.props.invitation.addressee}</h4>
          <p className="uk-text-center confirmation-value"><strong>Decline{this.props.invitation.guests.length == 1 && 's'} with regret</strong></p>
        </div>
        <p className="uk-text-center">We&#39;re sorry you can&#39;t make it!</p>
        <CommentComponent placeholder="Comments" handleBack={this.props.handleBack} handleSubmit={this.props.handleSubmit} updateComment={this.props.updateComment} />
      </div>
    )
  }
}

class AcceptedConfirmationComponent extends React.Component {
  render () {
    return (
      <div>
        <h3 className="uk-text-center">Confirm your response</h3>
        <div className="uk-margin-medium">
          <h4 className="uk-text-center uk-margin-remove-bottom">{this.props.rsvp.guests.map((guest) => guest.name).join(' & ')}</h4>
          <p className="uk-text-center confirmation-value"><strong>Accept{this.props.rsvp.guests.length == 1 && 's'} with pleasure</strong></p>
        </div>
        {this.props.rsvp.guests.map((guest, idx) =>
          <div key={idx} className="uk-margin-medium">
            <p className="uk-text-center uk-margin-remove-bottom">Entree selection for {guest.name}</p>
            <p className="uk-text-center confirmation-value"><strong>{ENTREE_NAMES[guest.entreeSelection]}</strong></p>
          </div>
        )}
        <CommentComponent placeholder="Comments, food allergies, dietary restrictions, etc." handleBack={this.props.handleBack} handleSubmit={this.props.handleSubmit} updateComment={this.props.updateComment} />
      </div>
    )
  }
}

class CommentComponent extends React.Component {
  constructor (props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange (e) {
    this.setState({ comment: e.target.value }, () => { this.props.updateComment(this.state.comment); });
  }
  render () {
    return (
      <form className="uk-form-stacked">
        <div className="uk-margin-medium">
          <textarea row="5" cols="60" className="uk-textarea" onChange={this.handleChange} placeholder={this.props.placeholder}></textarea>
        </div>
        <button className="uk-button uk-button-default uk-width-1-2" onClick={this.props.handleBack}>Back</button>
        <button className="uk-button uk-button-primary uk-width-1-2" onClick={this.props.handleSubmit}>Submit</button>
      </form>
    )
  }
}

class EntreeSelectionComponent extends React.Component {
  render () {
    return (
      <div>
        {this.props.guests.map((guest, idx) =>
          <GuestEntreeSelectionComponent key={idx} guest={guest} updateGuest={this.props.updateGuest} />
        )}
        <button className="uk-button uk-button-default uk-width-1-2" onClick={this.props.handleBack}>Back</button>
        <button className="uk-button uk-button-primary uk-width-1-2" onClick={this.props.handleContinue}>Continue</button>
      </div>
    )
  }
}

class GuestNameComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = _.clone(this.props.guest);
    this.handleChange = this.handleChange.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }
  componentWillReceiveProps(newProps) {
    this.setState(_.clone(newProps.guest));
  }
  handleChange (e) {
    this.setState({ name: e.target.value }, () => { this.props.updateGuest(this.state); });
  }
  handleRemove (e) {
    e.preventDefault();
    this.props.removeGuest(this.state.id);
  }
  render () {
    let inputClassName = "uk-input uk-form-width-large";
    let label = null;
    let labelText = null;

    if (!this.state.valid) {
      inputClassName += ' uk-form-danger';

      if (this.props.idx > 0) {
        labelText = "Enter a name or remove this guest using the X on the right";
      } else {
        labelText = "Enter a name";
      }

      label = <label className="uk-form-label rsvp-form-error-label">{labelText}</label>
    }

    return (
      <div>
        <div className="uk-margin">
          {label}
          <div className="uk-flex uk-flex-middle">
            <input className={inputClassName} id="form-horizontal-text" type="text" value={this.state.name || ''} placeholder="(guest)" onChange={this.handleChange} />
            {this.props.idx > 0 &&
              <a className="guest-remove-button" onClick={this.handleRemove} uk-icon="icon: close-icon"></a>
            }
          </div>
        </div>
      </div>
    )
  }
}

class GuestEntreeSelectionComponent extends React.Component {
  constructor (props) {
    super(props);
    this.state = _.clone(this.props.guest);
    if (_.isNull(this.state.entreeSelection)) {
      this.state.entreeSelection = 'salmon';
    }
    this.handleOptionChanged = this.handleOptionChanged.bind(this);
  }
  handleOptionChanged (e) {
    this.setState({ entreeSelection: e.target.value }, () => { this.props.updateGuest(this.state) });
  }
  render () {
    return (
      <div>
        <form>
          <legend className="uk-legend uk-text-center uk-margin">Entree selection for {this.state.name}</legend>
          <div className="uk-margin-medium">
            <div className="uk-grid-small uk-flex-around uk-child-width-1-1 uk-child-width-auto@s" data-uk-grid>
              <div className="">
                <label className="uk-form-label">
                  <input className="uk-radio" type="radio" value="salmon" checked={this.state.entreeSelection === 'salmon'} onChange={this.handleOptionChanged} />
                  <span className="uk-padding-small">Atlantic Salmon</span>
                </label>
              </div>
              <div className="">
                <label className="uk-form-label">
                  <input className="uk-radio" type="radio" value="duck" checked={this.state.entreeSelection === 'duck'} onChange={this.handleOptionChanged} />
                  <span className="uk-padding-small">Roast Duck</span>
                </label>
              </div>
            </div>
            <div className="uk-grid-small uk-flex-around uk-child-width-1-1 uk-child-width-auto@s" data-uk-grid>
              <div className="">
                <label className="uk-form-label">
                  <input className="uk-radio" type="radio" value="surf_n_turf" checked={this.state.entreeSelection === 'surf_n_turf'} onChange={this.handleOptionChanged} />
                  <span className="uk-padding-small">Surf &amp; Turf</span>
                </label>
              </div>
              <div className="">
                <label className="uk-form-label">
                  <input className="uk-radio" type="radio" value="veg" checked={this.state.entreeSelection === 'veg'} onChange={this.handleOptionChanged} />
                  <span className="uk-padding-small">Vegetarian</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

render(<RsvpComponent/>, document.getElementById('rsvp-form'));
