import {

} from '../../../../Redux/action';

export const mapStateToProps = (state) => ({
  SOCKET: state.SOCKET,
  activeUserDetails: state.activeUserDetails,
});

export const mapDispatchToProps = (dispatch) => ({

});