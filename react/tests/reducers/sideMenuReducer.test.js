import { expect } from 'chai'
import reducer from '../../reducers/sideMenuReducer'
import types from '../../actions/actionTypes'
import menuList from '../../data/menuList'
import permissions from '../../data/permissionTypes'

describe('side menu reducer', ( ) => {
    it('should return the initial state', ( ) => {
        expect( // eslint-disable-line
            reducer()
        ).to.be.empty;
    })

    it('should handle TOGGLE_MENU_ITEM', () => {
        expect( // eslint-disable-line
            reducer(menuList, {
                type: types.TOGGLE_MENU_ITEM,
                payload: {
                    itemIndex: null,
                    menuIndex: 0
                }
            })[0].active
        ).to.be.true
    })

    it('should handle UPDATE_SUBMENU_ITEMS', () => {
        const testSubMenu = [
            {
                title: 'test.Title',
                state: 'test',
                active: false,
                permission: permissions.ALL
            }
        ]
        expect(
            reducer(menuList, {
                type: types.UPDATE_SUBMENU_ITEMS,
                payload: {
                    menuId: 'support',
                    subMenu: testSubMenu
                }
            }).find(x => x.id === 'support').subMenu
        ).to.eql(testSubMenu)
    })

    it('should handle ADD_TOP_LEVEL_LINK_FUNC', () => {
        expect( // eslint-disable-line
            reducer(menuList, {
                type: types.ADD_TOP_LEVEL_LINK_FUNC,
                payload: {
                    menuId: 'signOut',
                    func: () => {}
                }
            }).find(x => x.id === 'signOut').func
        ).to.not.be.null
    })
})
