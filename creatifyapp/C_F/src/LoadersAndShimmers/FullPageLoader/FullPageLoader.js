import React, { useEffect, useState } from 'react';
import './FullPageLoader.css';
import { CircularProgress } from '@mui/material';

const FullPageLoader = (props) => {
  const { isFullPageLoading } = props;

  useEffect(() => {
    if (isFullPageLoading) {
      document.getElementsByTagName('html')[0].style.cssText = 'overflow: hidden';
    } else {
      document.getElementsByTagName('html')[0].style.cssText = 'overflow: auto';
    }
  }, [isFullPageLoading]);
  return (
    <>
      {isFullPageLoading && <div className="fullPageLoaderContainer">
        <CircularProgress />
      </div>}
    </>
  );
}

export default FullPageLoader;
