import {
fetchProfileIdDetails,
sendMessage,
fetchAllMessagesOfChat,
setNotificationArray,
fetchAllChats,
setPeerInStore,
} from '../../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  fetchProfileIdDetails: (profileId) => dispatch(fetchProfileIdDetails(profileId)),
  sendMessage: (chatId, messageContent) => dispatch(sendMessage(chatId, messageContent)),
  fetchAllMessagesOfChat: (chatId) => dispatch(fetchAllMessagesOfChat(chatId)),
  fetchAllChats: (ussToken) => dispatch(fetchAllChats(ussToken)),
  setNotificationArray: (newMessage) => dispatch(setNotificationArray(newMessage)),
  setPeerInStore: (peer) => dispatch(setPeerInStore(peer)),
});

export const mapStateToProps = (state) => ({
  ussToken: state.ussToken,
  allUserChats: state.allUserChats,
  activeChatMessagesArray: state.activeChatMessagesArray,
  activeUserDetails: state.activeUserDetails,
  notifications: state.notifications,
  SOCKET: state.SOCKET,
  PEER: state.PEER,
});