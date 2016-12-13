import { combineReducers } from 'redux';
import locale from './localeReducer';
import log from './logReducer';
import user from './userReducer';
import resource from './resourceReducer';
import metric from './metricReducer';

const reducers = combineReducers({
    locale,
    log,
    user,
    resource,
    metric,
});

export default reducers;
