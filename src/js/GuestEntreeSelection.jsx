import React from 'react';
import _ from 'lodash';

export default class GuestEntreeSelection extends React.Component {
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
          <legend className="uk-legend uk-text-center uk-margin">Entr&eacute;e selection for {this.state.name}</legend>
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
