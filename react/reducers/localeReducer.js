export default function localeReducer(state = {}, action) {
    switch (action.type) {
        case 'SET_LOCALE': {
            return Object.assign({}, state, action.payload);
        }
        default:
            return state;
    }
}
