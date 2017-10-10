import React from 'react';
import _ from 'lodash';

const getUrlParams = (search) => {
  let hashes = search.slice(search.indexOf('?') + 1).split('&')
  let params = {}
  hashes.map(hash => {
      let [key, val] = hash.split('=')
      params[key] = decodeURIComponent(val)
  })

  return params
};

export default class RsvpCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.fetchInvitation = this.fetchInvitation.bind(this);
  }
  componentDidMount () {
    let urlParams = getUrlParams(window.location.search);
    let rsvpCode = urlParams.rsvp_code;

    if (!_.isUndefined(rsvpCode)) {
      this.setState({ rsvpCode: rsvpCode }, () => this.props.fetchInvitation(this.state.rsvpCode));
    }
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
              <input className={inputClassName} id="form-horizontal-text" type="text" value={this.state.rsvpCode || ''} onChange={this.handleChange} />
            </div>
          </div>
          <button className="uk-button uk-button-primary uk-width-1-1" onClick={this.fetchInvitation}>Continue</button>
        </form>
      </div>
    )
  }
}
