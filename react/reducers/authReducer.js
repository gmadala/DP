export default function reducer(state = {}, action) {
    switch (action.type) {
        case 'SET_AUTH': {
            return Object.assign({}, state, {
                authData: action.payload,
                authToken: action.payload.Token,
                timestamp: Date().now(),
            });
        }
        case 'RESET_AUTH': {
            return Object.assign({}, state, {
                authData: null,
                authToken: null,
                timestamp: Date().now(),
            });
        }
        default:
            return state;
    }
}
