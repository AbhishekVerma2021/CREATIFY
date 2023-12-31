import {
  fetchProfileIdDetails,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  fetchProfileIdDetails: (profileId) => dispatch(fetchProfileIdDetails(profileId)),
});

export const mapStateToProps = (state) => ({
  activeUserDetails: state.activeUserDetails,
  profilePostsData: state.profilePostsData,
});