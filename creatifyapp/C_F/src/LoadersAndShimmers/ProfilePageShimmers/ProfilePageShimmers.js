import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import './ProfilePageShimmers.css';
import { CircularProgress } from '@mui/material';

const ProfilePageCardShimmer = () => {
  return (<>
    <Stack className='profilePageCardShimmerContainer' gap={1}>
      <div className="cardHeaderContainerShimer">
        <div className="avatarShimmerContainer">
          <Skeleton variant="circular" width='100%' height='100%' />
        </div>
        <div className="postHeadertextShimmer">
          <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '50%' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '100%' }} />
        </div>
      </div>
      <div className="cardMediaContainerSimmer">
      <Skeleton variant="rectangular" width="100%">
          <div style={{ paddingTop: '57%' }} />
        </Skeleton>
      </div>
      <Skeleton variant="text" sx={{ fontSize: '0.7rem', width: '40%' }} />
      <Skeleton variant="text" sx={{ fontSize: '0.7rem', width: '40%' }} />
    </Stack>
  </>);
};


const ProfilePageShimmers = (props) => {
  const { count } = props;
  const cardIndices = Array.from({ length: count }, (_, index) => index);
  // const cardIndices = [1,2,3,4,5,]
  return (<>
    {
      cardIndices && cardIndices.length > 0 && cardIndices.map((index) => <ProfilePageCardShimmer />)
    }
    {/* <div className='profilePageCircularProgressShimmer'>
    </div> */}

  </>);
};

export default ProfilePageShimmers;