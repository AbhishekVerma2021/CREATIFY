import {
  fetchProfileIdDetails,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  fetchProfileIdDetails: (profileId) => dispatch(fetchProfileIdDetails(profileId)),
});

export const mapStateToProps = (state) => ({
  ussToken: state.ussToken,
  isUserLoggedIn: state.isUserLoggedIn,
  activeUserDetails: state.activeUserDetails,
});