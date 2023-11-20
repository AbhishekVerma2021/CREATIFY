import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = (props) => {
  const { Component, validateLoginStatus, isUserLoggedIn, componentPath } = props;
  const [shouldRender, setShouldRender] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        await validateLoginStatus(navigate, componentPath);
      } catch (error) {
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    setShouldRender(isUserLoggedIn)
  }, [isUserLoggedIn])
  return (<>
    {shouldRender && <Component />}
  </>)
}

export default ProtectedRoute;