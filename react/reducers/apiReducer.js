import axios from 'axios';
import apiEndpoints from '../data/apiEndpointsList';

export default function reducer(state = {}, action) {
    switch (action.type) {
        case 'INITIALIZE_API': {
            const endPoint = apiEndpoints.find(ep => ep.name === action.payload);
            if (endPoint) {
                return axios.create({
                    baseURL: endPoint.config.apiBase,
                    timeout: 1000,
                });
            }
            return state;
        }
        case 'SET_API_BASEURL': {
            return Object.assign({}, state, { defaults: Object.assign({}, state.defaults, { baseURL: action.payload } )});
        }
        default:
            return state;
    }
}
