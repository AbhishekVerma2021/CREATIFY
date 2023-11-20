import {
  fetchPostsComments
} from '../../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  fetchPostsComments: (postId) => dispatch(fetchPostsComments(postId)),
});

export const mapStateToProps = (state) => ({
  postsComments: state.postsComments,
});