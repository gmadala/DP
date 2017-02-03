import { connect } from 'react-redux'
import { setAngularObj } from '../../actions/angularActions';
import AngularServices from './AngularServices';

const mapStateToProps = () => ({
})

const mapDispatchToProps = dispatch => ({
    setAngularObj: (func, name) => {
        dispatch(setAngularObj(func, name))
    }
})

export default connect( mapStateToProps, mapDispatchToProps )( AngularServices )
