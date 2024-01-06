import React, { useEffect, useState } from 'react'
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
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddBoxIcon from '@mui/icons-material/AddBox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LogoDevIcon from '@mui/icons-material/LogoDev';
import './Sidebar.css';
import { red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const Sidebar = (props) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSearch, setSearchDrawer] = useState(false);
  const [autoCompleteData, setAutoCompleteData] = useState([]);
  const [shrinkSidebar, setShrinkSidebar] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigate = useNavigate();
  const {
    children,
    setPageHeader,
    allUsersList,
  } = props;

  const {
    pageHeaderText,
    activeUserDetails,
  } = props; // states

  const { username, email, _id } = activeUserDetails;
  const {

  } = props; // actions

  const { window } = props;

  useEffect(() => {
    if (allUsersList && allUsersList.length > 0) {
      const profileNameArray = allUsersList.map(user => user.username);
      setAutoCompleteData(profileNameArray);
    }
  }, [allUsersList])
  // =================================================================================================

  const handleHomePage = () => {
    navigate('/');
    setShrinkSidebar(false);
    setPageHeader('HOME');
  }

  const handleProfile = () => {
    navigate('/profile');
    setShrinkSidebar(false);
    setPageHeader('PROFILE')
  }

  const handleCreatePost = () => {
    navigate('/createPost');
    setShrinkSidebar(false);
    setPageHeader('CREATE A NEW POST')
  }

  const handleFavourites = () => {
    navigate('/favorites');
    setShrinkSidebar(false);
    setPageHeader('YOUR FAVORITES')
  }

  const handleMessages = () => {
    setShrinkSidebar(true);
    setPageHeader('YOUR CHATS');
    navigate('/messages');
  };
  const handleLogout = () => {
    navigate('/login');
    localStorage.clear();
  }

  const handleExpandSidebar = () => {
    setShrinkSidebar(false);
  }


  // ======================================SEARCH DRAWER===========================================================


  const toggleDrawer = (open, event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setSearchDrawer(open);
  };

  const list = () => (
    <Box
      role="presentation"
    // onClick={(e) => toggleDrawer(false, e)}
    // onKeyDown={(e) => toggleDrawer(false, e)}
    >
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={autoCompleteData}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
    </Box>);

  // ======================================MAIN DRAWER===========================================================


  const container = window !== undefined ? () => window().document.body : undefined;
  const drawer = (
    <div className={shrinkSidebar ? 'listOfShrinkSidebar' : ''}>
      {!shrinkSidebar && <span>
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
      </span>}
      <List>
        {shrinkSidebar && <ListItem key={'Logo'}
          sx={{
            marginBottom: '50px',
          }}
          disablePadding={!shrinkSidebar}>
          <ListItemButton className={shrinkSidebar ? 'sideBarButton' : ''} >
            <ListItemIcon sx={{
              minWidth: '100%',
              display: shrinkSidebar && 'flex',
              justifyContent: shrinkSidebar && 'center'
            }}>
              <LogoDevIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>}
        {shrinkSidebar && <ListItem key={'Menu'} disablePadding={!shrinkSidebar} onClick={() => handleExpandSidebar()}>
          <ListItemButton className={shrinkSidebar ? 'sideBarButton' : ''} >
            <ListItemIcon sx={{
              minWidth: '100%',
              display: shrinkSidebar && 'flex',
              justifyContent: shrinkSidebar && 'center'
            }}>
              <MenuOpenIcon />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>}
        <ListItem key={'Home'} disablePadding={!shrinkSidebar} onClick={() => handleHomePage()}>
          <ListItemButton className={shrinkSidebar ? 'sideBarButton' : ''}>
            <ListItemIcon sx={{
              minWidth: shrinkSidebar ? '100%' : '56px',
              display: shrinkSidebar && 'flex',
              justifyContent: shrinkSidebar && 'center'
            }}>
              <HomeIcon />
            </ListItemIcon>
            {!shrinkSidebar && <ListItemText primary={'Home'} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={'Profile'} disablePadding={!shrinkSidebar} onClick={() => handleProfile()}>
          <ListItemButton className={shrinkSidebar ? 'sideBarButton' : ''}>
            <ListItemIcon sx={{
              minWidth: shrinkSidebar ? '100%' : '56px',
              display: shrinkSidebar && 'flex',
              justifyContent: shrinkSidebar && 'center'
            }}>
              <AccountCircleIcon />
            </ListItemIcon>
            {!shrinkSidebar && <ListItemText primary={'Profile'} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={'Favourites'} disablePadding={!shrinkSidebar} onClick={() => handleFavourites()}>
          <ListItemButton className={shrinkSidebar ? 'sideBarButton' : ''}>
            <ListItemIcon sx={{
              minWidth: shrinkSidebar ? '100%' : '56px',
              display: shrinkSidebar && 'flex',
              justifyContent: shrinkSidebar && 'center'
            }}>
              <FavoriteIcon />
            </ListItemIcon>
            {!shrinkSidebar && <ListItemText primary={'Favourites'} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={'Messages'} disablePadding={!shrinkSidebar} onClick={() => handleMessages()}>
          <ListItemButton className={shrinkSidebar ? 'sideBarButton' : ''}>
            <ListItemIcon sx={{
              minWidth: shrinkSidebar ? '100%' : '56px',
              display: shrinkSidebar && 'flex',
              justifyContent: shrinkSidebar && 'center'
            }}>
              <QuestionAnswerIcon />
            </ListItemIcon>
            {!shrinkSidebar && <ListItemText primary={'Messages'} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={'Create new post'} disablePadding={!shrinkSidebar} onClick={() => handleCreatePost()}>
          <ListItemButton className={shrinkSidebar ? 'sideBarButton' : ''}>
            <ListItemIcon sx={{
              minWidth: shrinkSidebar ? '100%' : '56px',
              display: shrinkSidebar && 'flex',
              justifyContent: shrinkSidebar && 'center'
            }}>
              <AddBoxIcon />
            </ListItemIcon>
            {!shrinkSidebar && <ListItemText primary={'Create new post'} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={'Search'} disablePadding={!shrinkSidebar} onClick={(e) => toggleDrawer(true, e)}>
          <ListItemButton className={shrinkSidebar ? 'sideBarButton' : ''}>
            <ListItemIcon sx={{
              minWidth: shrinkSidebar ? '100%' : '56px',
              display: shrinkSidebar && 'flex',
              justifyContent: shrinkSidebar && 'center'
            }}>
              <PersonSearchIcon />
            </ListItemIcon>
            {!shrinkSidebar && <ListItemText primary={'Search'} />}
          </ListItemButton>
        </ListItem>
        <ListItem key={'Logout'} disablePadding={!shrinkSidebar} onClick={() => handleLogout()}>
          <ListItemButton className={shrinkSidebar ? 'sideBarButton' : ''}>
            <ListItemIcon sx={{
              minWidth: shrinkSidebar ? '100%' : '56px',
              display: shrinkSidebar && 'flex',
              justifyContent: shrinkSidebar && 'center'
            }}>
              <LogoutIcon />
            </ListItemIcon>
            {!shrinkSidebar && <ListItemText primary={'Logout'} />}
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );


  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        open={openSearch}
        onClose={(e) => toggleDrawer(false, e)}
        onOpen={(e) => toggleDrawer(true, e)}
      >
        {list()}
      </Drawer>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${shrinkSidebar ? 70 : drawerWidth}px)` },
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
            {pageHeaderText}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: shrinkSidebar ? 70 : drawerWidth }, flexShrink: { sm: 0 } }}
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
          // className='desktopScreenDrawer'
          sx={{
            // width: "50px !important",
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: shrinkSidebar ? 70 : drawerWidth },
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