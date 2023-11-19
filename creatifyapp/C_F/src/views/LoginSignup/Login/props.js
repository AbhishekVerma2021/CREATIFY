import {
  loginUser,
  validateLoginStatus,
} from '../../../Redux/action';

export const mapStateToProps = (state) => ({
  ussToken: state.ussToken,
  isUserLoggedIn: state.isUserLoggedIn,
});

export const mapDispatchToProps = (dispatch) => ({
  loginUser: (email, password, navigate) => dispatch(loginUser(email, password, navigate)),
  validateLoginStatus: (navigate) => dispatch(validateLoginStatus(navigate)),
});