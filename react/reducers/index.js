import { combineReducers } from 'redux'
import resource from './resourceReducer'
import angular from './angularReducer'
import sideMenu from './sideMenuReducer'

const reducers = combineReducers({
    resource,
    angular,
    sideMenu
});

export default reducers;
