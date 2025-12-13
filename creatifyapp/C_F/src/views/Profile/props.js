import {
  fetchProfileIdDetails,
  uploadProfileImage,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  fetchProfileIdDetails: (profileId) => dispatch(fetchProfileIdDetails(profileId)),
  uploadProfileImage: (image) => dispatch(uploadProfileImage(image)),
});

export const mapStateToProps = (state) => ({
  activeUserDetails: state.activeUserDetails,
  profilePostsData: state.profilePostsData,
});