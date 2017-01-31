import { connect } from 'react-redux'
import { logMetric } from '../../actions/metricActions';
import { toggleMenuItem, updateSubMenuItems, addTopLevelLinkFunc } from '../../actions/sideMenuActions'
import SideMenu from './SideMenu';

const mapStateToProps = (state, props) => ({
    menuList: state.sideMenu,
    metrics: state.metric,
    isOpen: props.isopen,
    toggleMenu: props.togglemenu,
    angularState: props.$state,
    user: props.User
})

const mapDispatchToProps = (dispatch, props) => ({
    logMetric: ( metric ) => {
        dispatch(logMetric( metric ))
        props.kissMetricInfo.getKissMetricInfo( ).then(( result ) => {
            props.segmentio.track( metric, result );
        });
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
