import {

} from '../../../Redux/action';

export const mapStateToProps = (state) => ({
  profilePostsData: state.profilePostsData,
  activeUserDetails: state.activeUserDetails
});

export const mapDispatchToProps = (dispatch) => ({

});