import React, { useEffect, useState } from 'react';
import ProfilePost from './ProfilePost';
import './Profile.css';

import UsersList from './UsersList';

import Avatar from '@mui/material/Avatar';
import AvatarIcon from '../../images/avatar.svg';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';

const Profile = (props) => {
  const [toggleListView, setToggleListView] = useState(false);
  const [toggleFollowersList, setToggleFollowersList] = useState(false);
  const {
    fetchProfileIdDetails,
  } = props;

  const {
    activeUserDetails,
    profilePostsData,
  } = props;
  const { _id, username, email, followers, following } = activeUserDetails;
  
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
              src={AvatarIcon}
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
        </div>
      </div>
    }
  </>)
}

export default Profile;