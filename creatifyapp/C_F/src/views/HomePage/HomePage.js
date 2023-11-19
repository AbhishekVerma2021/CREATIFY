import React, { useEffect } from 'react'


const HomePage = (props) => {
    console.log(props)
    useEffect(() => {
        props.fetchAllPostData();
      }, []);
    return(<>
    {JSON.stringify(props.postFeedData)}
        HomePage
    </>)
}

export default HomePage;