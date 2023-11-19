import React, { PropTypes } from 'react';
import './Loader.css';
import CircularProgress from '@mui/material/CircularProgress';


const Loader = ({ isLoading }) =>
  isLoading
    ? <div className='loaderContainer'>
      <CircularProgress />
    </div>
    : null;



export default Loader;
