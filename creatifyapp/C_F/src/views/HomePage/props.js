import {
    fetchAllPostData,
    fetchAllUsers,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
    fetchAllPostData: () => dispatch(fetchAllPostData()),
    fetchAllUsers: () => dispatch(fetchAllUsers()),
    // Note: setSocketInStore and setPeerInStore are now in App.js
});

export const mapStateToProps = (state) => ({
    postFeedData: state.postFeedData,
    isUserLoggedIn: state.isUserLoggedIn,
    activeUserDetails: state.activeUserDetails,
    allUsersList: state.allUsersList,
    isLoading: state.isLoading,
    isLoadingUsersList: state.isLoadingUsersList,
    SOCKET: state.SOCKET,
    PEER: state.PEER
});