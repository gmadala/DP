import { connect } from 'react-redux'
import { logMetric } from '../../actions/angularActions';
import AuctionResources from './AuctionResources';

const mapStateToProps = state => ({
    docs: state.resource.auctionDocs,
    metrics: state.resource.metric,
    isUnitedStates: state.angular.isUnitedStates
})

const mapDispatchToProps = dispatch => ({
    logMetric: (metric) => {
        dispatch(logMetric(metric));
    }
})

export default connect( mapStateToProps, mapDispatchToProps )( AuctionResources )
