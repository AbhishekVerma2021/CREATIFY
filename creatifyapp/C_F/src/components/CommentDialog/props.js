import {
  handleCommentOnPost,
  fetchPostsComments,
} from '../../Redux/action';

export const mapStateToProps = (state) => ({
  activeUserDetails: state.activeUserDetails,
  postsComments: state.postsComments,
  isCommentDialogLoading: state.isCommentDialogLoading,
});

export const mapDispatchToProps = (dispatch) => ({
  handleCommentOnPost: (commentString, postId) => dispatch(handleCommentOnPost(commentString, postId)),
  fetchPostsComments: (postId) => dispatch(fetchPostsComments(postId)),
});