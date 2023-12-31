import React, { useEffect } from 'react';
import './Favourites.css';
import FavaouritePostCard from './FavaouritePostCard';


const Favourites = (props) => {

  const { activeUserDetails } = props;
  const { favorites } = activeUserDetails;

  return (
    <div className='masterFavPageContainer'>
      {favorites && favorites.length > 0 && favorites.map((post) => <FavaouritePostCard post={post} />)}
    </div>
  );
}

export default Favourites;