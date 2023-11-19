import {
    validateLoginStatus,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
    validateLoginStatus: (navigate, componentPath) => dispatch(validateLoginStatus(navigate, componentPath)),
}); 

export const mapStateToProps = (state) => ({
    isUserLoggedIn: state.isUserLoggedIn,
})