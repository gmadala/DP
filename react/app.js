import store from './store';
import { setLocale } from './actions/localeActions';
import './angular-directives';
import './translations';

// Initialize current language in the store
store.dispatch(setLocale());
