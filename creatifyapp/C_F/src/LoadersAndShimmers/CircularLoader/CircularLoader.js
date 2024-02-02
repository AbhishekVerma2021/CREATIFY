import React from 'react';
import { CircularProgress } from '@mui/material';
import './CircularLoader.css';

const CircularLoader = (props) => {
  const {size} = props;
  return <CircularProgress sx={{ margin: '0 auto' }} size={size}/>;
};

export default CircularLoader;