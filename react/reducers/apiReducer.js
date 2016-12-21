import axios from 'axios';

export default function reducer( state = {}, action ) {
    switch ( action.type ) {
        case 'INITIALIZE_API':
            return Object.assign({}, state, axios.create({
                baseURL: action.payload,
                timeout: 1000,
            }));
        default:
            return state;
    }
}
