// Styles
import 'materialize-css/dist/css/materialize.min.css';
import 'animate.css/animate.min.css';
import '../styles/index.scss';

import 'materialize-css/dist/js/materialize.min';
import Splitable from './splitable';

const splitable = new Splitable('#splitable');

// start with 2 payers and 1 item
splitable.addPerson();
splitable.addPerson();
splitable.addItem();
