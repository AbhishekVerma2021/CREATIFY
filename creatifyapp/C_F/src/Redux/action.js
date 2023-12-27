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
  HANDLE_LIKES,
  HANDLE_LIKES_FULFILLED,
  HANDLE_LIKES_REJECTED,
  HANDLE_LIKES_PENDING,
  UPLOAD_IMAGE,
  UPLOAD_IMAGE_FULFILLED,
  UPLOAD_IMAGE_REJECTED,
  UPLOAD_IMAGE_PENDING,
  CREATE_POST,
  CREATE_POST_PENDING,
  CREATE_POST_FULFILLED,
  CREATE_POST_REJECTED,
  FOLLOW_ACCOUNT_PENDING,
  FOLLOW_ACCOUNT_FULFILLED,
  FOLLOW_ACCOUNT_REJECTED,
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


export const fetchProfileIdDetails = (profileId) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    
    dispatch({ type: FETCH_PROFILE_DETAILS_PENDING });
    axios.get(`http://localhost:8000/api/profile?_id=${profileId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ussToken}`,
        }
      })
      .then((res) => {
        dispatch({ type: FETCH_PROFILE_DETAILS_FULFILLED, payload: res.data });
      })
      .catch((err) => { dispatch({ type: FETCH_PROFILE_DETAILS_REJECTED, payload: err.response.data }) })
  }
}

export const handleCommentOnPost = (commentString, postId) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    dispatch({
      type: USER_COMMENT,
      payload: axios.post('http://localhost:8000/api/comment', {
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
        .catch((er) => { throw er; })
    })
  }
};

export const fetchPostsComments = (postId) => {
  return (dispatch, getState) => {
    const { postsComments, ussToken } = getState();
    if (!Object.keys(postsComments).includes(postId)) {
      dispatch({
        type: FETCH_COMMENTS_FOR_POST,
        payload: axios.get(`http://localhost:8000/api/fetchComments?postId=${postId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${ussToken}`,
            },
          }).then((res) => res.data)
          .catch((er) => { throw er; })
      })
    }
    else {
      return Promise.resolve();
    }
  }
}

export const handleLikesAndDislikes = (postId, like) => {
  return (dispatch, getState) => {
    const { ussToken, activeUserDetails } = getState();
    const { _id } = activeUserDetails;
    dispatch({
      type: HANDLE_LIKES,
      payload: axios.post(`http://localhost:8000/api/like`,
        {
          postId,
          like: !like,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ussToken}`,
          },
        })
        .then((res) => {
          dispatch(fetchAllPostData());
          return res.data;
        })
        .catch((er) => { throw er; })
    })
  }
};

export const uploadImageToCloud = (image) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', 'creatify');
  formData.append('cloud_name', 'dbqsuayy3');

  return (dispatch) => {
    dispatch({ type: UPLOAD_IMAGE_PENDING });

    // Return a promise that resolves when the image upload is successful
    return axios.post('https://api.cloudinary.com/v1_1/dbqsuayy3/image/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => {
        dispatch({ type: UPLOAD_IMAGE_FULFILLED, payload: res.data });
        // Resolve the promise with the imageURL
        return res.data.secure_url;
      })
      .catch((err) => {
        dispatch({ type: UPLOAD_IMAGE_REJECTED, payload: err.response });
        // Reject the promise with the error
        throw err;
      });
  };
};

export const createPost = (postData) => {
  const { image, caption, description } = postData;
  return async (dispatch, getState) => {
    try {
      const imageURL = await dispatch(uploadImageToCloud(image));
      const { ussToken } = getState();
      if (imageURL) {
        dispatch({ type: CREATE_POST_PENDING });
        axios.post('http://localhost:8000/api/new-post', {
          url: imageURL,
          desc: description,
          caption,
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ussToken}`,
          }
        }).then((res) => {
          dispatch({ type: CREATE_POST_FULFILLED, payload: res.data });
        }).catch((er) => {
          dispatch({ type: CREATE_POST_REJECTED, payload: er.response });
        });
      } else {
        dispatch({ type: CREATE_POST_REJECTED, payload: { message: 'Image upload failed' } });
      }
    } catch (er) {
      console.error('Error creating post:', er);
      dispatch({ type: CREATE_POST_REJECTED, payload: { message: 'Error creating post' } });
    }
  };
};


export const followAccount = (accountId) => {
  console.log(accountId);
  return (dispatch, getState) => {
    const { ussToken } = getState();
    console.log(ussToken);
    dispatch({ type: FOLLOW_ACCOUNT_PENDING });
    axios.post('http://localhost:8000/api/follow', {
      followedAcountId: accountId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ussToken}`,
      },
    }).then( res => {
      console.log(res)
      dispatch({ type: FOLLOW_ACCOUNT_FULFILLED, payload: res.data });
    }).catch( er => {
      console.log(er)
      dispatch({ type: FOLLOW_ACCOUNT_REJECTED, payload: er.message })
    })
  }
}

