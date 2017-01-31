import { combineReducers } from 'redux'
import log from './logReducer'
import user from './userReducer'
import resource from './resourceReducer'
import metric from './metricReducer'
import auth from './authReducer'
import api from './apiReducer'
import sideMenu from './sideMenuReducer'

const reducers = combineReducers({
    log,
    user,
    resource,
    metric,
    auth,
    api,
    sideMenu
});

export default reducers;
