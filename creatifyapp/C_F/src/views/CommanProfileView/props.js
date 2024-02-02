import {
  followAccount,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  followAccount: (accountId) => dispatch(followAccount(accountId)),
});

export const mapStateToProps = (state) => ({
  activeUserDetails: state.activeUserDetails,
  selectedUserProfileDetails: state.selectedUserProfileDetails,
  isLoading: state.isLoading,
});