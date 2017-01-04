import { combineReducers } from 'redux';
import log from './logReducer';
import user from './userReducer';
import resource from './resourceReducer';
import metric from './metricReducer';
import auth from './authReducer';

const reducers = combineReducers({
    log,
    user,
    resource,
    metric,
    auth,
});

export default reducers;
