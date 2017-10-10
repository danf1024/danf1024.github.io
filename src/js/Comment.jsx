import React from 'react';

export default class Comment extends React.Component {
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
