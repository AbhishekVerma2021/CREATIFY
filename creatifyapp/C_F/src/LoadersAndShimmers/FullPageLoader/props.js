import {

} from '../../Redux/action'

export const mapStateToProps = (state) => ({
  isFullPageLoading: state.isFullPageLoading,
});