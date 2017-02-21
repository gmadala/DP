import { connect } from 'react-redux'
import { logMetric } from '../../actions/angularActions';
import { toggleMenuItem, updateSubMenuItems, addTopLevelLinkFunc } from '../../actions/sideMenuActions'
import SideMenu from './SideMenu';

const mapStateToProps = (state, props) => ({
    menuList: state.sideMenu,
    metrics: state.resource.metric,
    isOpen: props.isopen,
    toggleMenu: props.togglemenu,
    angularState: state.angular.$state,
    user: state.angular.User,
    userInfo: state.angular.UserInfo,
    nxgConfig: state.angular.NxgConfig,
    $rootScope: state.angular.$rootScope
})

const mapDispatchToProps = dispatch => ({
    logMetric: ( metric ) => {
        dispatch(logMetric( metric ))
    },
    toggleMenuItem: (menuIndex, itemIndex) => {
        dispatch(toggleMenuItem(menuIndex, itemIndex))
    },
    updateSubMenuItems: (menuId, subMenu) => {
        dispatch(updateSubMenuItems(menuId, subMenu))
    },
    addTopLevelLinkFunc: (menuId, func) => {
        dispatch(addTopLevelLinkFunc(menuId, func))
    }
})

export default connect( mapStateToProps, mapDispatchToProps )( SideMenu )
