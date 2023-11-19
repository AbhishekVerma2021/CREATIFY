import {
  FETCH_ALL_POSTS,
  SUBMIT_USER,
  LOGIN_USER,
  LOGIN_USER_FULFILLED,
  LOGIN_USER_REJECTED,
  USER_LOGIN_STATUS,
  USER_LOGIN_STATUS_FULFILLED,
  USER_LOGIN_STATUS_REJECTED,
  FETCH_ALL_POSTS_PENDING,
  FETCH_ALL_POSTS_FULFILLED,
  FETCH_ALL_POSTS_REJECTED,
} from './actionTypes';

import axios from 'axios';

export const submitUser = (username, email, password) => {
  const data = {
    username: username,
    email: email,
    password: password,
  };

  return {
    type: SUBMIT_USER,
    payload: axios.post('http://localhost:8000/api/register', data)
      .then((res) => {
        console.log(res);
        return res.data; // Make sure to return the relevant data from the Promise
      })
      .catch((error) => {
        console.error(error);
        throw error; // Throw the error so that redux-promise-middleware can handle it
      }),
  };
};

export const loginUser = (email, password, navigate) => {
  const data = {
    email,
    password,
  }
  localStorage.clear();
  return (dispatch) => {
    dispatch({ type: LOGIN_USER });

    axios.post('http://localhost:8000/api/login', data)
      .then((res) => {
        console.log(res)
        dispatch({ type: LOGIN_USER_FULFILLED, payload: res });
        navigate('/');
        // dispatch(fetchAllPostData());
      })
      .catch((err) => {
        dispatch({ type: LOGIN_USER_REJECTED, payload: err });
      });
  };
}


// export const fetchAllPostData = () => {
//   return {
//     type: FETCH_ALL_POSTS,
//     payload: axios.get('http://localhost:8000/api/posts', {

//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('user:token')}`,
//       },
//     })
//       .then((res) => {console.log(res);return res.data})
//       .catch((err) => {
//         return err.response.data;
//       }),
//   };
// };


export const fetchAllPostData = () => {
  return (dispatch, getState) => {
    const { activeUserDetails } = getState();
    const token = activeUserDetails ? activeUserDetails.token : null;
    
    dispatch({ type: FETCH_ALL_POSTS_PENDING });


    axios.post('http://localhost:8000/api/posts',
      { user: activeUserDetails },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res)
        dispatch({ type: FETCH_ALL_POSTS_FULFILLED, payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: FETCH_ALL_POSTS_REJECTED, payload: err.response.data });
      });
  };
};


export const getActiveProfileDetails = () => {
  return (dispatch, getState) => {
    // dispatch({ type: FETCH_PROFILE_DETAILS_PENDING });
    // axios.get(`httpp://localhost:8000/api/profile`,)
  }
}



export const validateLoginStatus = (navigate, componentPath) => {
  const token = localStorage.getItem('TOKEN');
  if (!token) {
    return (dispatch) => {
      dispatch({ type: USER_LOGIN_STATUS_REJECTED, payload: { message: 'Sorry!! You are not authenticated' } })
      navigate('/login');
    }
  }
  else {
    return (dispatch) => {
      axios.get('http://localhost:8000/api/validateToken', {
        headers: {
          authorization: `Bearer ${localStorage.getItem('TOKEN')}`
        }
      }).then(res => {
        console.log(res)
        dispatch({ type: USER_LOGIN_STATUS_FULFILLED, payload: res.data });
        navigate(componentPath ? componentPath : '/');
      })
        .catch(er => {
          dispatch({ type: USER_LOGIN_STATUS_REJECTED, payload: { message: 'Sorry!! You are not authenticated' } });
          navigate('/login');
        });
    };
  }
};