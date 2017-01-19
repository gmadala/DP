import { combineReducers } from 'redux';
import resource from './resourceReducer';
import angular from './angularReducer';

const reducers = combineReducers({
    resource,
    angular
});

export default reducers;
