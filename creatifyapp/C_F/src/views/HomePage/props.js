import {
    fetchAllPostData,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
    fetchAllPostData: () => dispatch(fetchAllPostData()),
});

export const mapStateToProps = (state) => ({
    postFeedData: state.postFeedData,
    isUserLoggedIn: state.isUserLoggedIn,
    activeUserDetails: state.activeUserDetails,
});