import {
  createNewChat,
  fetchAllChats,
} from '../../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  createNewChat: (userId) => dispatch(createNewChat(userId)),
  fetchAllChats: () => dispatch(fetchAllChats()),
});

export const mapStateToProps = (state) => ({
  allUsersList: state.allUsersList,
  allUserChats: state.allUserChats,
  activeUserDetails: state.activeUserDetails,
  SOCKET: state.SOCKET,
});