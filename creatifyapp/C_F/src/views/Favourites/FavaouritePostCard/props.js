import {
  fetchPostsComments,
  handleLikesAndDislikes,
  followAccount,
  fetchProfileIdDetails,
  setFavouritePost,
} from '../../../Redux/action';

export const mapStateToProps = (state) => ({
  favoritePostIds: state.favoritePostIds,
  postsComments: state.postsComments,
  activeUserDetails: state.activeUserDetails,
  postsLikes: state.postsLikes,
});

export const mapDispatchToProps = (dispatch) => ({
  fetchPostsComments: (postId) => dispatch(fetchPostsComments(postId)),
  handleLikesAndDislikes: (postId, like) => dispatch(handleLikesAndDislikes(postId, like)),
  followAccount: (accountId) => dispatch(followAccount(accountId)),
  setFavouritePost: (postId, postUid) => dispatch(setFavouritePost(postId, postUid)),
  fetchProfileIdDetails: (profileId) => dispatch(fetchProfileIdDetails(profileId)),
});
