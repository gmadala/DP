import types from './actionTypes';

export function toggleMenuItem(menuIndex, itemIndex) {
    return { type: types.TOGGLE_MENU_ITEM, payload: { menuIndex, itemIndex } }
}

export function updateSubMenuItems(menuId, subMenu) {
    return { type: types.UPDATE_SUBMENU_ITEMS, payload: { menuId, subMenu }}
}

export function addTopLevelLinkFunc(menuId, func) {
    return { type: types.ADD_TOP_LEVEL_LINK_FUNC, payload: { menuId, func }}
}
