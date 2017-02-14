import counterpart from 'counterpart';

import enLocale from './en';
import esLocale from './es';
import frLocale from './fr';

counterpart.registerTranslations( 'en', enLocale );
counterpart.registerTranslations( 'es', esLocale );
counterpart.registerTranslations( 'fr', frLocale );
counterpart.setFallbackLocale('en');
