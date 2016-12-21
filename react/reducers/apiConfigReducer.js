import apiEndpoints from '../data/apiEndpointsList';

export default function reducer(state = {}, action) {
    switch (action.type) {
        case 'SET_API_CONFIG': {
            const endPoint = apiEndpoints.find(ep => ep.name === action.payload);
            return Object.assign({}, state, endPoint);
        }
        default:
            return state;
    }
}
