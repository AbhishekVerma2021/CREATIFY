import React, { useEffect } from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import './Sidebar.css';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';


const drawerWidth = 240;
const Sidebar = (props) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const navigate = useNavigate();
  const {
    children
  } = props;
  const {
    activeUserDetails,
    ussToken,
  } = props; // states

  const { username, email, _id } = activeUserDetails;
  const {
    
  } = props; // actions
  
  const { window } = props;
// =================================================================================================

const handleHomePage = () => {
  navigate('/');
}

const handleProfile = () => {
  navigate('/profile');
}

const handleCreatePost = () => {
  navigate('/createPost');
}

const handleLogout = () => {
  navigate('/login');
  localStorage.clear();
}

// =================================================================================================


  const container = window !== undefined ? () => window().document.body : undefined;
  const drawer = (
    <div>
      <div className='avatarConatiner'>
        <Avatar sx={{ bgcolor: red[500], height: "125px", width: "125px" }} aria-label="recipe">
          <span className="avatarForProfile">{username.slice(0, 1).toUpperCase()}</span>
        </Avatar>
      </div>
      <div class="usernameContainer">
        {username}
      </div>
      <div class="userEmailContainer">
        {email}
      </div>
      <Divider />
      <List>
        <ListItem key={'Home'} disablePadding onClick={() => handleHomePage()}>
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={'Home'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'Profile'} disablePadding onClick={() => handleProfile()}>
          <ListItemButton>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={'Profile'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'Create new post'} disablePadding onClick={() => handleCreatePost()}>
          <ListItemButton>
            <ListItemIcon>
              <AddBoxIcon />
            </ListItemIcon>
            <ListItemText primary={'Create new post'} />
          </ListItemButton>
        </ListItem>
        <ListItem key={'Logout'} disablePadding onClick={() => handleLogout()}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            backgroundColor: '#FCEDDA',
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{

            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
        <Box
          component="main"
          className='boxContainerForFeedSection'
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, marginTop: "50px" }}
        >
          {children}
        </Box>
    </Box>
  );
}

export default Sidebar;