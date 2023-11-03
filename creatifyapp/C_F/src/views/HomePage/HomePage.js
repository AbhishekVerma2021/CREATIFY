import React, { useEffect } from 'react'


const HomePage = (props) => {
    useEffect(() => {
        props.fetchAllPostData();
      }, []);
    return(<>
        HomePage
    </>)
}

export default HomePage;