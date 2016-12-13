export default function reducer(state = {}, action) {
    switch (action.type) {
        case 'USER_LOGIN': {
            return Object.assign({}, state, action.payload);
        }
        case 'USER_LOGIN_SUCCESS': {
            return Object.assign({}, state, action.payload);
        }
        case 'USER_LOGIN_ERROR': {
            return Object.assign({}, state, action.payload);
        }
        default:
            return state;
    }
}
