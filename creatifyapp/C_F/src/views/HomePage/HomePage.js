import React, { useEffect } from 'react'
import Post from './Post';
import UserListCard from './UserListCard';
import './HomePage.css';
import { toast } from 'react-toastify';

import {
  List,
  Paper,
} from '@mui/material';




const HomePage = (props) => {

  // ============================================================================================================================
  const {
    fetchAllPostData,
    activeUserDetails,
    fetchAllUsers,
  } = props; // actions

  const {
    postFeedData,
    allUsersList,
  } = props; // states
  const { window } = props;


  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAllPostData();
        await fetchAllUsers();
      }
      catch (er) {
        toast.error('Feed Data Could not be fetched', {
          position: toast.POSITION.BOTTOM_LEFT
        })
      }
    }
    fetchData();
  }, []);

  console.log(activeUserDetails)
  return (
    <div className='masterHomePageContainer'>
      <div className="masterPostsCardContainer">
        {postFeedData && postFeedData.length > 0 && [...postFeedData].reverse().map((post) => <Post post={post} />)}
      </div>
      <Paper elevation={5} className="masterUserListContainer">
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {allUsersList && allUsersList.length > 0 && allUsersList.map((user) => <UserListCard userDetails={user} />)}
        </List>
      </Paper>
    </div>
  );
}


export default HomePage;