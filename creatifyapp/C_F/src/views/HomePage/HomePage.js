import React, { useEffect } from 'react'
import Post from './Post';
import UserListCard from './UserListCard';
import './HomePage.css';
import { toast } from 'react-toastify';
import HomePageShimmers from '../../LoadersAndShimmers/HomePageCardShimmer/';
import UserListShimmer from '../../LoadersAndShimmers/UserListShimmer/';
import {
  List,
  Paper,
  Box,
  Container,
  Grid,
  Typography,
  Divider,
  Stack,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

const HomePage = (props) => {
  
  const {
    fetchAllPostData,
    activeUserDetails,
    fetchAllUsers
  } = props;

  const {
    postFeedData,
    allUsersList,
    isLoading,
    isLoadingUsersList,
    SOCKET,
    PEER
  } = props;
  

  // Note: SOCKET and PEER are now set up in App.js (centralized setup)
  // This ensures they're only initialized when user is logged in

  
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


  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 3 }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Posts Feed Section */}
          <Grid item xs={12} md={8} lg={8}>
            <Stack spacing={2}>
              {isLoading ? (
                <HomePageShimmers isLoading={true} />
              ) : postFeedData && postFeedData.length > 0 ? (
                [...postFeedData].reverse().map((post) => (
                  <Post key={post._id} post={post} />
                ))
              ) : (
                <Paper
                  elevation={2}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    No posts yet. Start following people to see their posts!
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Grid>

          {/* Users List Section */}
          <Grid item xs={12} md={4} lg={4}>
            <Box
              sx={{
                position: 'sticky',
                top: 16,
              }}
            >
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  maxHeight: '80vh',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* User List Header */}
                <Box
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <PeopleIcon />
                  <Typography variant="h6" fontWeight={600}>
                    Suggested Users
                  </Typography>
                </Box>

                {/* User List Content */}
                {isLoadingUsersList ? (
                  <Box sx={{ p: 2 }}>
                    <UserListShimmer />
                  </Box>
                ) : (
                  <List
                    sx={{
                      width: '100%',
                      bgcolor: 'background.paper',
                      overflow: 'auto',
                      flex: 1,
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: '4px',
                      },
                    }}
                  >
                    {allUsersList && allUsersList.length > 0 ? (
                      allUsersList.map((user) => (
                        <UserListCard key={user._id} userDetails={user} />
                      ))
                    ) : (
                      <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          No users found
                        </Typography>
                      </Box>
                    )}
                  </List>
                )}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default HomePage;