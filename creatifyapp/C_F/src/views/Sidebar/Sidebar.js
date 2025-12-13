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
import { Tooltip, Badge, Stack, Paper } from '@mui/material';
import './Sidebar.css';
import { red } from '@mui/material/colors';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();
  
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
    setPageHeader('HOME');
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


  const menuItems = [
    { key: 'Home', icon: <HomeIcon />, label: 'Home', path: '/', onClick: handleHomePage },
    { key: 'Profile', icon: <AccountCircleIcon />, label: 'Profile', path: '/profile', onClick: handleProfile },
    { key: 'Create', icon: <AddBoxIcon />, label: 'Create', path: '/createPost', onClick: handleCreatePost },
    { key: 'Favourites', icon: <FavoriteIcon />, label: 'Favorites', path: '/favorites', onClick: handleFavourites },
    { key: 'Messages', icon: <QuestionAnswerIcon />, label: 'Messages', path: '/messages', onClick: handleMessages },
  ];

  const container = window !== undefined ? () => window().document.body : undefined;
  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      {/* User Profile Section */}
      {!shrinkSidebar && (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 100,
                height: 100,
                fontSize: '2.5rem',
                fontWeight: 600,
                boxShadow: 2,
              }}
            >
              {username.slice(0, 1).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700} color="text.primary">
                {username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {email}
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}
      {/* Logo/Menu for shrunk sidebar */}
      {shrinkSidebar && (
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Stack spacing={2} alignItems="center">
            <Tooltip title="Creatify" placement="right">
              <IconButton sx={{ color: 'primary.main' }}>
                <LogoDevIcon sx={{ fontSize: 32 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Expand Menu" placement="right">
              <IconButton onClick={handleExpandSidebar} sx={{ color: 'primary.main' }}>
                <MenuOpenIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Divider sx={{ mt: 2 }} />
        </Box>
      )}

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: shrinkSidebar ? 1 : 2, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Tooltip
              key={item.key}
              title={shrinkSidebar ? item.label : ''}
              placement="right"
            >
              <ListItem
                disablePadding
                sx={{ mb: 1 }}
              >
                <ListItemButton
                  onClick={item.onClick}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    px: shrinkSidebar ? 1.5 : 2,
                    justifyContent: shrinkSidebar ? 'center' : 'flex-start',
                    bgcolor: isActive ? 'primary.light' : 'transparent',
                    color: isActive ? 'primary.main' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.light' : 'action.hover',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: shrinkSidebar ? 'auto' : 48,
                      color: isActive ? 'primary.main' : 'inherit',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!shrinkSidebar && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '1rem',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}

        {/* Search */}
        <Tooltip title={shrinkSidebar ? 'Search' : ''} placement="right">
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={(e) => toggleDrawer(true, e)}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: shrinkSidebar ? 1.5 : 2,
                justifyContent: shrinkSidebar ? 'center' : 'flex-start',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
                transition: 'all 0.2s',
              }}
            >
              <ListItemIcon sx={{ minWidth: shrinkSidebar ? 'auto' : 48, justifyContent: 'center' }}>
                <PersonSearchIcon />
              </ListItemIcon>
              {!shrinkSidebar && (
                <ListItemText
                  primary="Search"
                  primaryTypographyProps={{ fontWeight: 500, fontSize: '1rem' }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>

      {/* Logout at bottom */}
      <Box sx={{ p: shrinkSidebar ? 1 : 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Tooltip title={shrinkSidebar ? 'Logout' : ''} placement="right">
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: shrinkSidebar ? 1.5 : 2,
                justifyContent: shrinkSidebar ? 'center' : 'flex-start',
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.lighter',
                },
                transition: 'all 0.2s',
              }}
            >
              <ListItemIcon sx={{ minWidth: shrinkSidebar ? 'auto' : 48, color: 'error.main', justifyContent: 'center' }}>
                <LogoutIcon />
              </ListItemIcon>
              {!shrinkSidebar && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ fontWeight: 600, fontSize: '1rem' }}
                />
              )}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </Box>
    </Box>
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
          // backgroundColor: 'red',
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
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: shrinkSidebar ? 70 : drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
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