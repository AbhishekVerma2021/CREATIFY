import React, { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import { red } from '@mui/material/colors';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { IconButton } from '@mui/material';
import './UserListCard.css';
import { useNavigate } from 'react-router-dom';


const UserListCard = (props) => {
  const [follow, setFollow] = useState(false);
  const navigate = useNavigate();
  const { userDetails, activeUserDetails, followAccount, fetchProfileIdDetails } = props;
  const { username, _id, email } = userDetails;
  const activeUserId = activeUserDetails?._id;


  useEffect(() => {
    const { following } = activeUserDetails;
    let followFlag = false;
    following && following.length > 0 && following.forEach(followedUser => {
      if (followedUser.uId === _id) {
        followFlag = true;
      }
    })
    setFollow(followFlag);
  }, [activeUserDetails]);

  const handleFollowClick = async () => {
    try {
      await followAccount(_id);
    } catch (e) {
      alert('Something went wrong')
    }
  };

  const handleProfileViewClick = async () => {
    try {
      await fetchProfileIdDetails(_id);
      navigate('/commanProfile')
    }
    catch (er) {
      alert('Something Went wrong!!!')
    }
  };

  return (<>
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
          {username.slice(0, 1).toUpperCase()}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        onClick={() => activeUserId !== _id ? handleProfileViewClick() : null}
        sx={{
          cursor: 'pointer',
        }}
        primary={<div className='userListUsernameContainer'>
          <span>{username}</span> {_id !== activeUserId && <IconButton aria-label="settings" onClick={() => handleFollowClick()}>
            {follow ? <PersonRemoveIcon /> : <PersonAddIcon />}
          </IconButton>}
        </div>
        }
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {email}
            </Typography>

          </React.Fragment>
        }
      />
    </ListItem>
    <Divider variant="inset" component="li" />
  </>
  );
}

export default UserListCard;