import { connect } from 'react-redux'
import { setAngularObj } from '../../actions/angularActions';
import AngularServices from './AngularServices';

const mapStateToProps = (state, props) => ({
    isLoggedIn: props.isloggedin
})

const mapDispatchToProps = dispatch => ({
    setAngularObj: (func, name) => {
        dispatch(setAngularObj(func, name))
    }
})

export default connect( mapStateToProps, mapDispatchToProps )( AngularServices )
