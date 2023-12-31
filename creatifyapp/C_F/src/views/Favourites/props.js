import {
  setFavouritePost,
} from '../../Redux/action';

export const mapStateToProps = (state) => ({
  activeUserDetails: state.activeUserDetails,
  pageHeaderText: state.pageHeaderText,
});

export const mapDispatchToProps = (dispatch) => ({
  setFavouritePost: (postId, postUid) => dispatch(setFavouritePost(postId, postUid)),
});
