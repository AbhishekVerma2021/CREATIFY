import {
  removeMemberFromGroup,
  editGroupName,
  addNewMemberToGroup
} from '../../../../Redux/action';

export const mapStateToProps = (state) => ({
  activeUserDetails: state.activeUserDetails,
  allUsersList: state.allUsersList,
});

export const mapDispatchToProps = (dispatch) => ({
  removeMemberFromGroup: (memberId, groupId) => dispatch(removeMemberFromGroup(memberId, groupId)),
  addNewMemberToGroup: (memberId, groupId) => dispatch(addNewMemberToGroup(memberId, groupId)),
  editGroupName: (newGroupName, groupId) => dispatch(editGroupName(newGroupName, groupId)),
});