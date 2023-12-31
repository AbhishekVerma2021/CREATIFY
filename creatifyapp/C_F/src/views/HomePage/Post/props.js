import {
  fetchPostsComments,
  handleLikesAndDislikes,
  followAccount,
  fetchProfileIdDetails,
  setFavouritePost,
} from '../../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  fetchPostsComments: (postId) => dispatch(fetchPostsComments(postId)),
  handleLikesAndDislikes: (postId, like) => dispatch(handleLikesAndDislikes(postId, like)),
  followAccount: (accountId) => dispatch(followAccount(accountId)),
  fetchProfileIdDetails: (profileId) => dispatch(fetchProfileIdDetails(profileId)),
  setFavouritePost: (postId, postUid) => dispatch(setFavouritePost(postId, postUid)),
});

export const mapStateToProps = (state) => ({
  postsComments: state.postsComments,
  activeUserDetails: state.activeUserDetails,
  postsLikes: state.postsLikes,
  favoritePostIds: state.favoritePostIds,
});