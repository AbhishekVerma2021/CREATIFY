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
  FETCH_PROFILE_DETAILS,
  FETCH_PROFILE_DETAILS_FULFILLED,
  FETCH_PROFILE_DETAILS_PENDING,
  FETCH_PROFILE_DETAILS_REJECTED,
  USER_COMMENT,
  USER_COMMENT_FULFILLED,
  USER_COMMENT_PENDING,
  USER_COMMENT_REJECTED,
  FETCH_COMMENTS_FOR_POST,
  FETCH_COMMENTS_FOR_POST_FULFILLED,
  FETCH_COMMENTS_FOR_POST_REJECTED,
  FETCH_COMMENTS_FOR_POST_PENDING,
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
        dispatch({ type: LOGIN_USER_FULFILLED, payload: res });
        navigate('/');
        // dispatch(fetchAllPostData());
      })
      .catch((err) => {
        dispatch({ type: LOGIN_USER_REJECTED, payload: err });
      });
  };
}

export const fetchAllPostData = () => {
  return (dispatch, getState) => {
    const { activeUserDetails, ussToken } = getState();

    dispatch({ type: FETCH_ALL_POSTS_PENDING });


    axios.post('http://localhost:8000/api/posts',
      { user: activeUserDetails },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ussToken}`,
        },
      })
      .then((res) => {
        dispatch({ type: FETCH_ALL_POSTS_FULFILLED, payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: FETCH_ALL_POSTS_REJECTED, payload: err.response.data });
      });
  };
};




export const getActiveProfileDetails = () => {
  return (dispatch, getState) => {
    const { activeUserDetails, ussToken } = getState();
    const { _id } = activeUserDetails;
    
    dispatch({ type: FETCH_PROFILE_DETAILS_PENDING });
    axios.get(`http://localhost:8000/api/profile?_id=${_id}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ussToken}`,
      }
    })
    .then((res) => {
      dispatch({ type: FETCH_PROFILE_DETAILS_FULFILLED, payload: res.data });
    })
    .catch((err) => {dispatch({ type: FETCH_PROFILE_DETAILS_REJECTED, payload: err.response.data })})
  }
}

export const handleCommentOnPost = (commentString, postId) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    dispatch({
      type: USER_COMMENT,
      payload: axios.post('http://localhost:8000/api/comment',{
        comment: commentString,
        postId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ussToken}`,
        },
      }).then((res) => {
        return res.data;
      })
      .catch((er) => {throw er;})
    })
  }
};

export const fetchPostsComments = (postId) => {
  return (dispatch, getState) => {
    const { postsComments, ussToken } = getState();
    if(!Object.keys(postsComments).includes(postId)) {
      dispatch({
        type: FETCH_COMMENTS_FOR_POST,
        payload: axios.get(`http://localhost:8000/api/fetchComments?postId=${postId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ussToken}`,
          },
        }).then((res) => res.data)
        .catch((er) => {throw er;})
      })
    }
    else {
      return Promise.resolve();
    }
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