import './angular-directives';
import './translations';
import { setLocale } from './config/localConfig';
import { initializeApi } from './actions/apiActions';
import store from './store';

// Initialize language
setLocale();

// Initialize api
store.dispatch(initializeApi(ENVIRONMENT));
