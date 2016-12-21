import { combineReducers } from 'redux';
import locale from './localeReducer';
import log from './logReducer';
import user from './userReducer';
import resource from './resourceReducer';
import metric from './metricReducer';
import apiConfig from './apiConfigReducer';
import auth from './authReducer';
import api from './apiReducer';

const reducers = combineReducers({
    locale,
    log,
    user,
    resource,
    metric,
    apiConfig,
    auth,
    api
});

export default reducers;
