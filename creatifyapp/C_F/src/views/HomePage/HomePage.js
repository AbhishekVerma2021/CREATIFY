import React, { useEffect } from 'react'
import Post from './Post';
import './HomePage.css';
import { toast } from 'react-toastify';



const HomePage = (props) => {
  
  // ============================================================================================================================
  const {
    fetchAllPostData,
  } = props; // actions
  
  const {
    postFeedData,
  } = props; // states
  const { window } = props;


  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAllPostData();
      }
      catch (er) {
        toast.error('Feed Data Could not be fetched', {
          position: toast.POSITION.BOTTOM_LEFT
        })
      }
    }
    fetchData();
  }, []);


  return (
    <div>
      {postFeedData && postFeedData.length > 0 && postFeedData.map((post) => <Post post={post} />)}
    </div>
  );
}


export default HomePage;