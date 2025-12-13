import React, { useEffect, useState } from 'react';
import ProfilePost from './ProfilePost';
import './Profile.css';

import UsersList from './UsersList';

import Avatar from '@mui/material/Avatar';
import AvatarIcon from '../../images/avatar.svg';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import { Button } from '@mui/base';
import { Button as MUIButton, Dialog, DialogTitle, IconButton, DialogContent, DialogActions } from '@mui/material';

const Profile = (props) => {
  const [toggleListView, setToggleListView] = useState(false);
  const [toggleFollowersList, setToggleFollowersList] = useState(false);
  const {
    fetchProfileIdDetails,
  } = props;

  const [inputImage, setInputImage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const {
    activeUserDetails,
    uploadProfileImage,
    profilePostsData,
  } = props;
  const { _id, username, email, followers, following, image } = activeUserDetails;

  const convertImageToBase64 = async () => {
    const maxSizeMB = 37.5; // Approximate size considering Base64 inflation, adjust as needed
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (inputImage.size > maxSizeBytes) {
      alert(`File size is too large. Please choose a file smaller than ${maxSizeMB} MB.`);
      return Promise.reject(`File size is too large.`);
    }
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(inputImage);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const handleImageUpload = async () => {
    try {
      const base64 = await convertImageToBase64();
      await uploadProfileImage(base64);
      setOpenDialog(false);
    }
    catch (error) {
      alert('Something went wrong!!')
    };
  };

  useEffect(() => {
    try {
      fetchProfileIdDetails(_id);
    } catch (er) {
      toast.error('Could not fetch user details', { position: toast.POSITION.BOTTOM_LEFT });
    }
  }, [])
  return (<>
    {toggleListView ? <UsersList setToggleListView={setToggleListView} usersList={toggleFollowersList ? followers : following} listType={toggleFollowersList ? 'Followers' : 'Following'} /> :
      <div className='profilePageMasterContainer'>
        <div className='profileLeftSection'>
          <Paper className='leftProfileItemsContainer' elevation={3}>
            <Avatar
              alt={username}
              src={image && image.length > 0 ? image : AvatarIcon}
              sx={{ width: 150, height: 150 }}
            />
            <Tooltip title='User Name'>
              <div className='profileUsername'>{username}</div>
            </Tooltip>
            <Tooltip title='User Email'>
              <div class="profileEmail">{email}</div>
            </Tooltip>
            <Tooltip title='User Email'>
              <div class="profileEmail">Phone No.</div>
            </Tooltip>
            <Tooltip title='User Email'>
              <div class="profileEmail">9120522167</div>
            </Tooltip>
            <Tooltip title='User Email'>
              <Button
                variant="contained"
                component="label"
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenDialog(true)}
              >
                Profile Picture
              </Button>
            </Tooltip>
            <Tooltip title='User Email'>
              <div class="profileEmail">Reset Password</div>
            </Tooltip>
          </Paper>
        </div>
        <div className='profileRightSection'>
          {/* <Paper sx={{padding: '20px 10px'}} elevation={2}> */}
          <div class="userProgressDetailsSection">
            <Paper sx={{ width: '15%' }} className='progressBoxContainer' elevation={5}>
              <div className='progressItemContainer'>
                <div class="progessLabelContainer">
                  Posts
                </div>
                <div class="progressCountContainer">
                  {profilePostsData && profilePostsData.length}
                </div>
              </div>
            </Paper>
            <Paper sx={{ width: '15%' }} className='progressBoxContainer' onClick={() => {
              setToggleListView(true);
              setToggleFollowersList(true);
            }} elevation={5}>
              <div className='progressItemContainer'>
                <div class="progessLabelContainer">
                  Followers
                </div>
                <div class="progressCountContainer">
                  {followers && followers.length}
                </div>
              </div>
            </Paper>
            <Paper sx={{ width: '15%' }} className='progressBoxContainer' onClick={() => {
              setToggleListView(true);
              setToggleFollowersList(false);
            }} elevation={5}>
              <div className='progressItemContainer'>
                <div class="progessLabelContainer">
                  Following
                </div>
                <div class="progressCountContainer">
                  {following && following.length}
                </div>
              </div>
            </Paper>
          </div>
          <div class="profilePostsMasterContainer">
            {profilePostsData && profilePostsData.length > 0 && profilePostsData.map((post) => <Paper elevation={5}><ProfilePost post={post} /></Paper>)}
          </div>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>
              Upload Image
            </DialogTitle>
            <DialogContent>
              <MUIButton
                variant="contained"
                component="label"
                style={{ cursor: 'pointer' }}
              >
                {inputImage.length <= 0 ? 'Upload Profile Image' : inputImage?.name}
                <input
                  type="file"
                  name="coverImage"
                  hidden
                  onChange={(e) => setInputImage(e.target.files[0])}
                />
              </MUIButton>
            </DialogContent>
            <DialogActions>
              <MUIButton onClick={() => handleImageUpload()}>
                UPLOAD
              </MUIButton>

              <MUIButton onClick={() => setOpenDialog(false)}>
                CLOSE
              </MUIButton>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    }
  </>)
}

export default Profile;