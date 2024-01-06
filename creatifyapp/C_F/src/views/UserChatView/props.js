import {
  fetchAllChats,
  setSocketInStore,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
  fetchAllChats: () => dispatch(fetchAllChats()),
  setSocketInStore: (socket) => dispatch(setSocketInStore(socket)),
});

export const mapStateToProps = (state) => ({
  activeUserDetails: state.activeUserDetails,
});