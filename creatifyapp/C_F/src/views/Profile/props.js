import {
  getActiveProfileDetails,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  getActiveProfileDetails: () => dispatch(getActiveProfileDetails()),
});

export const mapStateToProps = (state) => ({
  activeUserDetails: state.activeUserDetails,
  profilePostsData: state.profilePostsData,
});