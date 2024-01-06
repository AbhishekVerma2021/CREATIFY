import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  IconButton,
  Paper,
  Avatar,
  Tooltip,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import React, { useEffect, useState } from 'react';
import './EditGroupDialog.css';

const EditGroupDialog = (props) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [autoCompleteData, setAutoCompleteData] = useState([]);

  const {
    handleEditDialogClose,
    openEditDialog,
    groupDetails,
    removeMemberFromGroup,
    addNewMemberToGroup,
    editGroupName,
    allUsersList,
  } = props;
  const groupName = groupDetails?.chatName;
  const membersList = groupDetails?.users;
  const groupId = groupDetails?._id;

  const updateAvailableMembersList = () => {
    const { users } = groupDetails;
    const newUserArray = users.map(user => {
      const { _id } = user;
      return _id;
    })
    const memberList = allUsersList.filter(user => !newUserArray.includes(user._id));
    
    setAutoCompleteData(memberList);
  }

  useEffect(() => {
    
    updateAvailableMembersList();
  }, []);
  
  useEffect(() => {
    setNewGroupName(groupName);
    updateAvailableMembersList();
  }, [groupDetails])


  const handleGroupEdit = async () => {
    if (newGroupName.length > 0 && groupName !== newGroupName) {
      try {
        await editGroupName(newGroupName, groupId);
      }
      catch (err) {
        alert('Something went wrong!!!');
      }
    }
  };

  const handleMemberList = async (flag, userId) => {
    try {
      if (flag) {
        await addNewMemberToGroup(userId, groupId);
      } else {
        await removeMemberFromGroup(userId, groupId);
      }
    }
    catch (err) {
      alert('Something went wrong!!!');
    }
  };

  return (
    <>
      <Dialog
        open={openEditDialog}
        onClose={() => handleEditDialogClose()}
        PaperProps={{
          sx: {
            width: '40vw',
            height: '70vh',
          }
        }}>
        <DialogTitle>
          Edit Group
        </DialogTitle>
        <DialogContent>
          <TextField
            required
            id="standard-required"
            label="Group Name"
            variant="standard"
            fullWidth
            defaultValue={groupName}
            // defaultValue={groupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            sx={{
              margin: '6px 0 10px 0'
            }}
          />
          <Box
            role="presentation"
            sx={{
              width: "100%",
              margin: '10px 0'
            }}
          >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={autoCompleteData.map(user => user.username)}
              onChange={(event, newValue) => {
                const selectedUserData = allUsersList.find(user => user.username === newValue);
                handleMemberList(true, selectedUserData._id);
              }}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Search User" />}
            />
          </Box>
          <div className="groupMembersContainer">
            <div className="groupMembersheader">
              MEMBERS:
            </div>
            <div className="groupMembersListContainer">
              {membersList && membersList.length > 0 && membersList.map((user) =>
                <Paper elevation={3} className='memberListCard'>
                  <span className='memberNameContainer'>
                    <Avatar sx={{ bgcolor: 'orange', height: "40px", width: "40px", margin: '0 10px 0 0' }} aria-label="recipe">
                      <span>{user?.username.slice(0, 1).toUpperCase()}</span>
                    </Avatar>
                    <span>
                      {user?.username}
                    </span>
                  </span>
                  <span>
                    <Tooltip title='Remove from group'>
                      <IconButton onClick={() => handleMemberList(false, user._id)}>
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                  </span>
                </Paper>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button disabled={newGroupName.length === 0 || groupName === newGroupName} onClick={() => handleGroupEdit()}>
            EDIT
          </Button>
          <Button onClick={() => handleEditDialogClose()}>CLOSE</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditGroupDialog