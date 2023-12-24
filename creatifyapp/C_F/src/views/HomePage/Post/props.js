import {
  fetchPostsComments,
  handleLikesAndDislikes,
  followAccount,
} from '../../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  fetchPostsComments: (postId) => dispatch(fetchPostsComments(postId)),
  handleLikesAndDislikes: (postId, like) => dispatch(handleLikesAndDislikes(postId, like)),
  followAccount: (postUserId) => dispatch(followAccount(postUserId)),
});

export const mapStateToProps = (state) => ({
  postsComments: state.postsComments,
  activeUserDetails: state.activeUserDetails,
  postsLikes: state.postsLikes,
});