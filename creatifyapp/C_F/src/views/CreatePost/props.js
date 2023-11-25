import {
  createPost,
} from '../../Redux/action';

export const mapStateToProps = (state) => ({
  activeUserDetails: state.activeUserDetails,
});

export const mapDispatchToProps = (dispatch) => ({
  createPost: (postData) => dispatch(createPost(postData)),
});

