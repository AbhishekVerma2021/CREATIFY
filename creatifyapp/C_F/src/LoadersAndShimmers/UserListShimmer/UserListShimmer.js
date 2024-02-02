import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import './UserListShimmer.css';
import { CircularProgress } from '@mui/material';


const UserListShimmer = () => {
  return (<>
    <Stack spacing={1} className='useraListShimmerContainer'>
      {/* For variant="text", adjust the height via font-size */}
      {/* For other variants, adjust the size with `width` and `height` */}
      <div className="userDetailsShimmerContainer">
        <div className="circleContainer">

          <Skeleton variant="circular" width='100%' height='100%' />
        </div>
        <div className="textShimmerContainer">

          <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '100%' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '50%' }} />
        </div>
      </div>
      <div className="userDetailsShimmerContainer">
        <div className="circleContainer">

          <Skeleton variant="circular" width='100%' height='100%' />
        </div>
        <div className="textShimmerContainer">

          <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '100%' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '50%' }} />
        </div>
      </div>
      <div className="userDetailsShimmerContainer">
        <div className="circleContainer">

          <Skeleton variant="circular" width='100%' height='100%' />
        </div>
        <div className="textShimmerContainer">

          <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '100%' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '50%' }} />
        </div>
      </div>
      <div className="userDetailsShimmerContainer circularLoader">
        <CircularProgress />

      </div>
      {/* <Skeleton variant="rectangular" width={210} height={60} />
      <Skeleton variant="rounded" width={210} height={60} /> */}
    </Stack>
  </>);
};

export default UserListShimmer;