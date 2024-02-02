import React from 'react';
import './CommentTextShimmer.css';
import { CircularProgress, Skeleton, Stack } from '@mui/material';

const CommentTextShimmer = () => {
  return (<>
    <Stack spacing={1} className='commentListShimmerContainer'>
      {/* For variant="text", adjust the height via font-size */}
      {/* For other variants, adjust the size with `width` and `height` */}
      <div className="commentShimmerContainer">
        <div className="commentCircleContainer">
          <Skeleton variant="circular" width='100%' height='100%' />
        </div>
        <div className="textShimmerContainer">

          <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '100%' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '50%' }} />
        </div>
      </div>
      <div className="commentShimmerContainer">
        <div className="commentCircleContainer">

          <Skeleton variant="circular" width='100%' height='100%' />
        </div>
        <div className="textShimmerContainer">

          <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '100%' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '50%' }} />
        </div>
      </div>
      <div className="commentShimmerContainer">
        <div className="commentCircleContainer">

          <Skeleton variant="circular" width='100%' height='100%' />
        </div>
        <div className="textShimmerContainer">

          <Skeleton variant="text" sx={{ fontSize: '1.5rem', width: '100%' }} />
          <Skeleton variant="text" sx={{ fontSize: '1rem', width: '50%' }} />
        </div>
      </div>
      <div className="commentShimmerContainer circularLoader">
        <CircularProgress />

      </div>
      {/* <Skeleton variant="rectangular" width={210} height={60} />
      <Skeleton variant="rounded" width={210} height={60} /> */}
    </Stack>
  </>);
};

export default CommentTextShimmer;