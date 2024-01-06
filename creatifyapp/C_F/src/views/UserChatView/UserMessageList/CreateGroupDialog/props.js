import {
  createNewChat,
  createChatGroup,
} from '../../../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  createNewChat: (userId) => dispatch(createNewChat(userId)),
  createChatGroup: (userIdArray, groupName) => dispatch(createChatGroup(userIdArray, groupName)),
});

export const mapStateToProps = (state) => ({
  allUsersList: state.allUsersList,
  allUserChats: state.allUserChats,
});