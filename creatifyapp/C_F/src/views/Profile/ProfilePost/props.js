import {
  handleLikesAndDislikes,
} from '../../../Redux/action';

export const mapStateToProps = (state) => ({
  profilePostsData: state.profilePostsData,
  activeUserDetails: state.activeUserDetails,
  postsLikes: state.postsLikes,
});

export const mapDispatchToProps = (dispatch) => ({
  handleLikesAndDislikes: (postId, like) => dispatch(handleLikesAndDislikes(postId, like)),
});