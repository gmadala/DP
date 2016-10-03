import Translater from './react/translations/translater';

var t = new Translater();

t.translate(require('./react/translations/en.js'), require('./react/translations/es.js'), 'en', 'es');
t.translate(require('./react/translations/en.js'), require('./react/translations/fr.js'), 'en', 'fr');
