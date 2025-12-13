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
import { IconButton, Button, Box, Tooltip } from '@mui/material';
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

  return (
    <>
      <ListItem 
        alignItems="flex-start"
        sx={{
          py: 2,
          px: 2,
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <ListItemAvatar>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main',
              width: 48,
              height: 48,
              fontWeight: 600,
              cursor: activeUserId !== _id ? 'pointer' : 'default',
            }}
            onClick={() => activeUserId !== _id ? handleProfileViewClick() : null}
          >
            {username && username.length > 0&& username.slice(0, 1).toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        
        <ListItemText
          onClick={() => activeUserId !== _id ? handleProfileViewClick() : null}
          sx={{
            cursor: activeUserId !== _id ? 'pointer' : 'default',
            flex: 1,
          }}
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {username}
              </Typography>
              {_id !== activeUserId && (
                <Tooltip title={follow ? 'Unfollow' : 'Follow'}>
                  <IconButton 
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollowClick();
                    }}
                    sx={{
                      bgcolor: follow ? 'error.light' : 'primary.light',
                      color: 'white',
                      width: 32,
                      height: 32,
                      '&:hover': {
                        bgcolor: follow ? 'error.main' : 'primary.main',
                      },
                    }}
                  >
                    {follow ? <PersonRemoveIcon sx={{ fontSize: 18 }} /> : <PersonAddIcon sx={{ fontSize: 18 }} />}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          }
          secondary={
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              sx={{
                display: 'block',
                mt: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {email}
            </Typography>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}

export default UserListCard;