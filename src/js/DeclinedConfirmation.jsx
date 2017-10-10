import React from 'react';

import Comment from './Comment';

export default class DeclinedConfirmationComponent extends React.Component {
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
          <p className="uk-text-center confirmation-value"><strong>Regretfully decline{this.props.invitation.guests.length == 1 && 's'}</strong></p>
        </div>
        <p className="uk-text-center">We&#39;re sorry you can&#39;t make it!</p>
        <Comment placeholder="Comments" handleBack={this.props.handleBack} handleSubmit={this.props.handleSubmit} updateComment={this.props.updateComment} />
      </div>
    )
  }
}
