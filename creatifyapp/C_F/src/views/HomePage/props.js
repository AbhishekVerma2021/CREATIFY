import {
    fetchAllPostData,
    fetchAllUsers,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
    fetchAllPostData: () => dispatch(fetchAllPostData()),
    fetchAllUsers: () => dispatch(fetchAllUsers()),
});

export const mapStateToProps = (state) => ({
    postFeedData: state.postFeedData,
    isUserLoggedIn: state.isUserLoggedIn,
    activeUserDetails: state.activeUserDetails,
    allUsersList: state.allUsersList,
    isLoading: state.isLoading,
    isLoadingUsersList: state.isLoadingUsersList,
});