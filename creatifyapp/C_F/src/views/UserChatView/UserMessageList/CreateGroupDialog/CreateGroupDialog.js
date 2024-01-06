import React, { useState } from 'react';
import './CreateGroupDialog.css';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Button,
  Autocomplete,
  Chip,
} from '@mui/material';

const CreateGroupDialog = (props) => {

  const [addedUsers, setAddedUser] = useState([]);
  const [groupName, setGroupName] = useState('');

  const {
    open,
    handleDialogClose,
    autoCompleteData,
    allUsersList,
    createChatGroup,
  } = props;

  const handleCreateGroup = async () => {
    const userIdArray = addedUsers.map(user => user._id);
    try {
      await createChatGroup(userIdArray, groupName)
    }
    catch (er) {
      alert('Something went wrong!!!')
    }
  }

  const handleChipDelete = (user) => {
    const groupMembers = addedUsers.filter(profile => profile._id !== user._id);
    setAddedUser(groupMembers);
  }

  return (
    <>
      <Dialog open={open} onClose={() => handleDialogClose()}
        className='createGroupDialogMasterContainer'
        PaperProps={{
          sx: {
            width: '40vw',
            height: '70vh',
          }
        }}
      >
        <DialogTitle>
          Create Group
        </DialogTitle>
        <DialogContent>
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
              options={autoCompleteData}
              onChange={(event, newValue) => {
                // console.log(addedUsers.filter(user => user.username === newValue));
                // console.log(addedUsers.filter(user => user.username === newValue.username));
                const selectedUserData = allUsersList.find(user => user.username === newValue);
                if (addedUsers.filter(user => user.username === newValue).length === 0)
                  setAddedUser([selectedUserData, ...addedUsers]);
                // handleAccessChat(selectedUserData);
              }}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Search User" />}
            />
          </Box>
          <div className="usernameChipContainer">
            <div className="addedUserheader">
              Added Users:
            </div>
            <div className="chipsContainer">
              {addedUsers.map((user) =>
                <Chip sx={{ margin: '0 10px 10px 0' }} label={user?.username} onDelete={() => handleChipDelete(user)} />
              )}
            </div>
          </div>
          <TextField
            required
            id="standard-required"
            label="Group Name"
            variant="standard"
            fullWidth
            onChange={(e) => setGroupName(e.target.value)}
            sx={{
              margin: '6px 0 10px 0'
            }}
          />
        </DialogContent>
        <DialogActions>
          
          <Button disabled={addedUsers.length <= 2 || groupName.length === 0} onClick={() => handleCreateGroup()}>CREATE GROUP</Button>
          <Button onClick={() => handleDialogClose()}>CLOSE</Button>
        </DialogActions>
      </Dialog >
    </>
  )
}

export default CreateGroupDialog;