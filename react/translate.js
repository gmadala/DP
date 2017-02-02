import path from 'path';
import translate from './translations/translater';

import enLocale from './translations/en';
import esLocale from './translations/es';
import frLocale from './translations/fr';

const outputPath = path.resolve( __dirname, '../translations' )
const resourcesPath = path.resolve( __dirname, './translations' )

translate( outputPath, resourcesPath, enLocale, esLocale, 'en', 'es' );
translate( outputPath, resourcesPath, enLocale, frLocale, 'en', 'fr' );
