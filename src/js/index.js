import '../../node_modules/material-design-lite/material.min';
import Splitable from './splitable';

// Styles
require('./../styles/index.scss');

const splitable = new Splitable('#splitable');

// start with 2 payers and 1 item
splitable.addPerson();
splitable.addPerson();
splitable.addItem();
