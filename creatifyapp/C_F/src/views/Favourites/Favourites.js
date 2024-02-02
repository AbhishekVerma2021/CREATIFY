import React, { useEffect, useState } from 'react';
import './Favourites.css';
import FavaouritePostCard from './FavaouritePostCard';


const Favourites = (props) => {

  const [postArray, setPostArray] = useState([]);
  const { activeUserDetails } = props;
  const { favorites } = activeUserDetails;
  useEffect(() => {
    if(favorites && favorites.length > 0)
    setPostArray(favorites);
  },[]);

  // useEffect(() => {
  //   console.log('---->',favorites);
  // },[favorites])

  return (
    <div className='masterFavPageContainer'>
      {postArray && postArray.length > 0 && postArray.map((post) => <FavaouritePostCard post={post} />)}
    </div>
  );
}

export default Favourites;