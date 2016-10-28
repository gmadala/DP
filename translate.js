import path from 'path';
import Translater from './react/translations/translater';

import enLocale from './react/translations/en';
import esLocale from './react/translations/es';
import frLocale from './react/translations/fr';

const t = new Translater(path.resolve( __dirname, './translations' ), path.resolve( __dirname, 'react/translations' ));

t.translate( enLocale, esLocale, 'en', 'es' );
t.translate( enLocale, frLocale, 'en', 'fr' );
