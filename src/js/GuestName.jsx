import React from 'react';
import _ from 'lodash';

export default class GuestName extends React.Component {
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
