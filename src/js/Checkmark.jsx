import React from 'react';

export default (props) => (
  <div>
    <div className="checkmark-icon uk-flex uk-flex-around">
      <svg viewBox="0 0 363.025 363.024">
        <path d="M181.512,363.024C81.43,363.024,0,281.601,0,181.513C0,81.424,81.43,0,181.512,0     c100.083,0,181.513,81.424,181.513,181.513C363.025,281.601,281.595,363.024,181.512,363.024z M181.512,11.71     C87.88,11.71,11.71,87.886,11.71,181.513s76.17,169.802,169.802,169.802c93.633,0,169.803-76.175,169.803-169.802     S275.145,11.71,181.512,11.71z" fill="#003728"/>
        <polygon points="147.957,258.935 83.068,194.046 91.348,185.767 147.957,242.375 271.171,119.166     279.451,127.445   " fill="#003728"/>
      </svg>
    </div>
    <h4 className="uk-text-center">{props.message}</h4>
  </div>
);
