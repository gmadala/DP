import * as actions from '../../actions/sideMenuActions';
import types from '../../actions/actionTypes';

describe('side menu actions', () => {
    it('should create an action to toggle a menu item', () => {
        const payload = { menuIndex: 0, itemIndex: 0 }
        const expectedAction = {
            type: types.TOGGLE_MENU_ITEM,
            payload
        }

        assert.deepEqual(actions.toggleMenuItem(0, 0), expectedAction);
    })

    it('should create an action update sub menu items', () => {
        const payload = { menuId: 0, subMenu: [] }
        const expectedAction = {
            type: types.UPDATE_SUBMENU_ITEMS,
            payload
        }

        assert.deepEqual(actions.updateSubMenuItems(0, []), expectedAction);
    })

    it('should create an action add top level link function', () => {
        const pFunc = () => {}
        const payload = { menuId: 0, func: pFunc }
        const expectedAction = {
            type: types.ADD_TOP_LEVEL_LINK_FUNC,
            payload
        }

        assert.deepEqual(actions.addTopLevelLinkFunc(0, pFunc), expectedAction);
    })
})
