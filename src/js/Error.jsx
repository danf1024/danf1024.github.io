import React from 'react';

export default () => (
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
);
