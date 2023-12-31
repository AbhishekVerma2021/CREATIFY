import {
  followAccount,
  fetchProfileIdDetails,
} from '../../../Redux/action';


export const mapStateToProps = (state) => ({
  activeUserDetails: state.activeUserDetails,
});

export const mapDispatchToProps = (dispatch) => ({
  followAccount: (accountId) => dispatch(followAccount(accountId)),
  fetchProfileIdDetails: (profileId) => dispatch(fetchProfileIdDetails(profileId)),
});