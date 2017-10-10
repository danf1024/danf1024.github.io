import 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import React from 'react';
import {render} from 'react-dom';

import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

import Rsvp from './Rsvp';

render(<Rsvp />, document.getElementById('rsvp-form'));
