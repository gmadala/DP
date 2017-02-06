import { connect } from 'react-redux'
import { logMetric } from '../../actions/angularActions';
import AuctionResources from './AuctionResources';

const mapStateToProps = state => ({
    docs: state.angular.IsUnitedStates ? state.resource.auctionDocs : [],
    metrics: state.resource.metric
})

const mapDispatchToProps = dispatch => ({
    logMetric: (metric) => {
        dispatch(logMetric(metric));
    }
})

export default connect( mapStateToProps, mapDispatchToProps )( AuctionResources )
