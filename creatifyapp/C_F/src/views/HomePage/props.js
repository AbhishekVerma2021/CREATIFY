import {
    fetchAllPostData,
} from '../../Redux/action';

export const mapDispatchToProps = (dispatch) => ({
    fetchAllPostData: () => dispatch(fetchAllPostData()) // Use dispatch to dispatch the action
});