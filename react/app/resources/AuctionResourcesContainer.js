import { connect } from 'react-redux'
import counterpart from 'counterpart';
import { logAction } from '../../actions/metricActions';
import AuctionResources from './AuctionResources';

const mapStateToProps = (state, props) => ({
    docs: state.resource.docs,
    language: counterpart.getLocale(),
    isUnitedStates: props.isUnitedStates,
})

const mapDispatchToProps = dispatch => ({
    onResourceClick: ( metric ) => {
        dispatch(logAction( metric ))
    }
})

const AuctionResourcesContainer = connect( mapStateToProps, mapDispatchToProps )( AuctionResources )

export default AuctionResourcesContainer;
