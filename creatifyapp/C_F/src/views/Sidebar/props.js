import {
  getActiveProfileDetails,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  getActiveProfileDetails: () => dispatch(getActiveProfileDetails()),
});

export const mapStateToProps = (state) => ({
  ussToken: state.ussToken,
  isUserLoggedIn: state.isUserLoggedIn,
  activeUserDetails: state.activeUserDetails,
});