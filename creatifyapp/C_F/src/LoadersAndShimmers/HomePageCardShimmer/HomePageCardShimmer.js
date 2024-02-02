import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Skeleton from '@mui/material/Skeleton';
import './HomePageCardShimmer.css';
import CircularProgress from '@mui/material/CircularProgress';

function Media(props) {
  const { loading = false } = props;

  return (
    <Card className='homePageSkeletonCard' sx={{ maxWidth: '50vw', maxHeight: '70vh', marginBottom: '30px' }}>
      <CardHeader
        avatar={
            <Skeleton animation="wave" variant="circular" width={40} height={40} />
        }
        
        title={
          <Skeleton
            animation="wave"
            height={10}
            width="80%"
            style={{ marginBottom: 6 }}
          />
        }
        subheader={

          <Skeleton animation="wave" height={10} width="40%" />

        }
      />
      <Skeleton sx={{ height: '40vh' }} animation="wave" variant="rectangular" />

      <CardContent className='shimmerCardCoontent'>

        <React.Fragment>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </React.Fragment>
      </CardContent>
    </Card>
  );
}

Media.propTypes = {
  loading: PropTypes.bool,
};

export default function Facebook() {
  return (
    <div className='homePageLoaders'>
      <Media loading />
      <Media />
      <CircularProgress/>
    </div>
  );
}
