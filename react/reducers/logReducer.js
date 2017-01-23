export default function reducer(state = [], action) {
    switch (action.type) {
        case 'LOG_ACTION': {
            return Object.assign([], state, [action.payload]);
        }
        default:
            return state;
    }
}
