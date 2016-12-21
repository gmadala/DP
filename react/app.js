import store from './store';
import { setLocale } from './actions/localeActions';
import { setApiConfig } from './actions/apiConfigActions';
import { initializeApi } from './actions/apiActions';
import './angular-directives';
import './translations';

// Initialize current language in the store
store.dispatch(setLocale());

// Initialize default api config
store.dispatch(setApiConfig('local'))

// Initialize api
const baseUrl = store.getState().apiConfig.config.apiBase;
store.dispatch(initializeApi(baseUrl))
