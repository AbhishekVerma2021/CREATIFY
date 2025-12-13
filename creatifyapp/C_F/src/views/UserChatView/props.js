import {
  fetchAllChats,
  setSocketInStore,
  setIncomingVideoCallFlag,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  fetchAllChats: () => dispatch(fetchAllChats()),
});

export const mapStateToProps = (state) => ({
  activeUserDetails: state.activeUserDetails,
  SOCKET: state.SOCKET,
  PEER: state.PEER
});