import types from '../actions/actionTypes';

export default function reducer(state = [], action) {
    switch (action.type) {
        case types.TOGGLE_MENU_ITEM:
            return state.map((i, index) => Object.assign({}, i, {
                active: i.active ? false : action.payload.menuIndex === index,
                subMenu: i.subMenu ? i.subMenu.map((ii, iindex) => Object.assign({}, ii, { active: action.payload.itemIndex === iindex })) : null
            }))
        case types.UPDATE_SUBMENU_ITEMS: {
            return state.map(i => Object.assign({}, i, {
                subMenu: i.id === action.payload.menuId ? action.payload.subMenu : i.subMenu
            }))
        }
        case types.ADD_TOP_LEVEL_LINK_FUNC: {
            return state.map(i => Object.assign({}, i, {
                func: i.id === action.payload.menuId ? action.payload.func : null
            }))
        }
        default:
            return state;
    }
}
