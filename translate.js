import Translater from './react/translations/translater';

import enLocale from './react/translations/en';
import esLocale from './react/translations/es';
import frLocale from './react/translations/fr';

const t = new Translater();

t.translate(enLocale, esLocale, 'en', 'es');
t.translate(enLocale, frLocale, 'en', 'fr');
