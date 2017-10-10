import React from 'react';
import _ from 'lodash';

import Error from './Error';
import Checkmark from './Checkmark';
import RsvpCode from './RsvpCode';
import Response from './Response';

const API_BASE_URL = "https://shielded-hamlet-90527.herokuapp.com/api/";
const SPINNER_HTML = "<div class=\"rsvp-spinner\" uk-spinner></div>";

const showSpinner = () => {
  let $el = $('#rsvp-form');
  $el.css('opacity', 0.5);
  $el.css('position', 'relative');
  $el.append(SPINNER_HTML);
};

const hideSpinner = () => {
  let $el = $('#rsvp-form');
  $el.find('.rsvp-spinner').remove();
  $el.css('position', 'auto');
  $el.css('opacity', 1);
};

export default class Rsvp extends React.Component {
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
      return <Error />
    } else if (this.state.isComplete) {
      return <Checkmark message="Your response has been recorded!" />
    } else if (_.isNull(this.state.invitation)) {
      return <RsvpCode fetchInvitation={this.fetchInvitation} invitationExists={this.state.invitationExists} />
    } else if (this.state.invitation.acceptedAt || this.state.invitation.declinedAt) {
      return <Checkmark message="You've already responded!" />
    } else {
      return <Response submitRsvp={this.submitRsvp} invitation={this.state.invitation} />
    }
  }
}
