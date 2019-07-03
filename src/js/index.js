// Styles
require('normalize.css/normalize.css');
require('./../styles/index.scss');

import Splitable from  './splitable';

const splitable = new Splitable('#splitable');

// start with 2 payers and 1 item
splitable.addPerson();
splitable.addPerson();
splitable.addItem();