import React from 'react';
import { Paper } from '@mui/material';
import './UsersList.css';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { red } from '@mui/material/colors';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Button from '@mui/material/Button';

const UsersList = (props) => {
  const {
    setToggleListView,
    usersList,
    listType,
  } = props;

  return (
    <div className="masterUserListContainer">
    <div className='userListLeftSideView'>
      <Button title='Go Back' onClick={() => setToggleListView(false)}>
        <ArrowBackIosIcon/>
      </Button>
      <div className='userListHeader'>
        {listType}
      </div>
    </div>
      <div className='userListCont'>
        <Paper elivation={4} sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper' }}>
            {
              usersList && usersList.length > 0 && usersList.map((user) => {
                const { username, email, uId } = user;
                return (<ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                      <span>{username.slice(0, 1).toUpperCase()}</span>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={username} secondary={email} />
                </ListItem>)
              })
            }
          </List>
        </Paper>
      </div>
    </div>
    );
};

export default UsersList;