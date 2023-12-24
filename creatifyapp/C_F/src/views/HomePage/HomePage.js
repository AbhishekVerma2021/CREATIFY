import React, { useEffect } from 'react'
import Post from './Post';
import './HomePage.css';
import { toast } from 'react-toastify';
// import po from '../../images/following.svg'


const HomePage = (props) => {
  
  // ============================================================================================================================
  const {
    fetchAllPostData,
    activeUserDetails,
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

  console.log(activeUserDetails)
  return (
    <div>
      {postFeedData && postFeedData.length > 0 && [...postFeedData].reverse().map((post) => <Post post={post} />)}
    </div>
  );
}


export default HomePage;