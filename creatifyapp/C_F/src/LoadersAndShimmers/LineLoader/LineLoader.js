import React from 'react';
import './LineLoader.css';
import { Skeleton } from '@mui/material';

const LineLoader = (props) => {
  const { width, fontSize } = props;
  return <Skeleton variant="text" sx={{ fontSize: fontSize ? fontSize : '1rem', width: width ? width : '100%' }} />;
};

export default LineLoader;