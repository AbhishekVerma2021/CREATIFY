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
  FAVORITE_POST,
  FAVORITE_POST_PENDING,
  FAVORITE_POST_FULFILLED,
  FAVORITE_POST_REJECTED,
  SET_PAGE_HEADER,
  FETCH_ALL_USERS,
  FETCH_ALL_USERS_PENDING,
  FETCH_ALL_USERS_FULFILLED,
  FETCH_ALL_USERS_REJECTED,
  CREATE_CHAT,
  CREATE_CHAT_PENDING,
  CREATE_CHAT_FULFILLED,
  CREATE_CHAT_REJECTED,
  FETCH_ALL_CHATS,
  FETCH_ALL_CHATS_PENDING,
  FETCH_ALL_CHATS_FULFILLED,
  FETCH_ALL_CHATS_REJECTED,
  CREATE_CHAT_GROUP,
  CREATE_CHAT_GROUP_PENDING,
  CREATE_CHAT_GROUP_FULFILLED,
  CREATE_CHAT_GROUP_REJECTED,
  RENAME_GROUP,
  RENAME_GROUP_PENDING,
  RENAME_GROUP_FULFILLED,
  RENAME_GROUP_REJECTED,
  ADD_TO_GROUP,
  ADD_TO_GROUP_PENDING,
  ADD_TO_GROUP_FULFILLED,
  ADD_TO_GROUP_REJECTED,
  REMOVE_FROM_GROUP,
  REMOVE_FROM_GROUP_PENDING,
  REMOVE_FROM_GROUP_FULFILLED,
  REMOVE_FROM_GROUP_REJECTED,
  SEND_MESSAGE,
  SEND_MESSAGE_PENDING,
  SEND_MESSAGE_FULFILLED,
  SEND_MESSAGE_REJECTED,
  FETCH_CHAT_MESSAGE,
  FETCH_CHAT_MESSAGE_PENDING,
  FETCH_CHAT_MESSAGE_FULFILLED,
  FETCH_CHAT_MESSAGE_REJECTED,
  SET_SOCKET_IN_STORE,
  SET_NOTIFICATION_ARRAY,
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
    payload: axios.post('https://creatify-backend.onrender.com/api/register', data)
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

    axios.post('https://creatify-backend.onrender.com/api/login', data)
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
      axios.get('https://creatify-backend.onrender.com/api/validateToken', {
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


    axios.post('https://creatify-backend.onrender.com/api/posts',
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
    axios.get(`https://creatify-backend.onrender.com/api/profile?_id=${profileId}`,
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
    dispatch({ type: USER_COMMENT_PENDING });
    axios.post('https://creatify-backend.onrender.com/api/comment', {
      comment: commentString,
      postId,
    },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ussToken}`,
        },
      }).then((res) => {
        dispatch({ type: USER_COMMENT_FULFILLED, payload: res.data });
      })
      .catch((er) => { dispatch({ type: USER_COMMENT_REJECTED, payload: er }) })
  }
};

export const fetchPostsComments = (postId) => {
  return (dispatch, getState) => {
    const { postsComments, ussToken } = getState();
    if (!Object.keys(postsComments).includes(postId)) {
      dispatch({
        type: FETCH_COMMENTS_FOR_POST,
        payload: axios.get(`https://creatify-backend.onrender.com/api/fetchComments?postId=${postId}`,
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
    dispatch({ type: HANDLE_LIKES_PENDING });
    axios.post(`https://creatify-backend.onrender.com/api/like`,
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
        dispatch({ type: HANDLE_LIKES_FULFILLED, payload: res.data });
        // dispatch(fetchAllPostData());
        // return res.data;
      })
      .catch((er) => {
        dispatch({ type: HANDLE_LIKES_REJECTED, payload: er })
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
        axios.post('https://creatify-backend.onrender.com/api/new-post', {
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
    axios.post('https://creatify-backend.onrender.com/api/follow', {
      followedAcountId: accountId,
    },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ussToken}`,
        },
      }).then(res => {
        console.log(res)
        dispatch({ type: FOLLOW_ACCOUNT_FULFILLED, payload: res.data });
      }).catch(er => {
        console.log(er)
        dispatch({ type: FOLLOW_ACCOUNT_REJECTED, payload: er.message })
      })
  }
}

export const setFavouritePost = (postId, postUid) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    dispatch({ type: FAVORITE_POST_PENDING });
    axios.post('https://creatify-backend.onrender.com/api/toggleFavorite', {
      post_id: postId,
      post_uId: postUid,
    },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ussToken}`,
        },
      })
      .then((res) => {
        dispatch({ type: FAVORITE_POST_FULFILLED, payload: res.data });
      })
      .catch((err) => {
        dispatch({ type: FAVORITE_POST_REJECTED, payload: err })
      })
  }
}

export const setPageHeader = (headerText) => {
  return (dispatch) => dispatch({ type: SET_PAGE_HEADER, payload: { headerText } })
}

export const fetchAllUsers = () => {
  console.log('GET ALL USERS')
  return (dispatch, getState) => {
    const { ussToken } = getState();
    dispatch({ type: FETCH_ALL_USERS_PENDING });
    axios.get('https://creatify-backend.onrender.com/api/getUsers', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ussToken}`,
      },
    })
      .then(res => dispatch({ type: FETCH_ALL_USERS_FULFILLED, payload: res.data }))
      .catch(err => dispatch({ type: FETCH_ALL_USERS_REJECTED, payload: err }))
  }
}

export const createNewChat = (userId) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    dispatch({ type: CREATE_CHAT_PENDING });
    axios.post('https://creatify-backend.onrender.com/api/chat', {
      userId,
    },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ussToken}`,
        }
      }).then(res => dispatch({ type: CREATE_CHAT_FULFILLED, payload: res.data }))
      .catch(er => dispatch({ type: CREATE_CHAT_REJECTED, payload: er }))
  };
};

export const fetchAllChats = (token) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    // console.log(ussToken)
    dispatch({ type: FETCH_ALL_CHATS_PENDING });
    axios.get('https://creatify-backend.onrender.com/api/getUserChats', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ussToken ? ussToken : token}`,
      }
    })
      .then(res => dispatch({ type: FETCH_ALL_CHATS_FULFILLED, payload: res }))
      .catch(er => dispatch({ type: FETCH_ALL_CHATS_REJECTED, payload: er }));
  };
}

export const createChatGroup = (usersIdArray, groupName) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    dispatch({ type: CREATE_CHAT_GROUP_PENDING });
    axios.post('https://creatify-backend.onrender.com/api/createGroup', {
      users: usersIdArray,
      group_name: groupName,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ussToken}`,
      }
    })
      .then(res => dispatch({ type: CREATE_CHAT_GROUP_FULFILLED, payload: res }))
      .catch(er => dispatch({ type: CREATE_CHAT_GROUP_REJECTED, payload: er }));
  };
};

export const editGroupName = (newGroupName, groupId) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    dispatch({ type: RENAME_GROUP_PENDING });
    axios.post('https://creatify-backend.onrender.com/api/renameGroup', {
      chatId: groupId,
      updated_name: newGroupName,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ussToken}`,
      }
    })
      .then(res => dispatch({ type: RENAME_GROUP_FULFILLED, payload: res }))
      .catch(err => dispatch({ type: RENAME_GROUP_REJECTED, payload: err }));
  };
};

export const addNewMemberToGroup = (memberId, groupId) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    dispatch({ type: ADD_TO_GROUP_PENDING });
    axios.post('https://creatify-backend.onrender.com/api/addToGroup', {
      chatId: groupId,
      userId: memberId,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ussToken}`,
      }
    }).then(res => dispatch({ type: ADD_TO_GROUP_FULFILLED, payload: res }))
      .catch(err => dispatch({ type: ADD_TO_GROUP_REJECTED, payload: err }));
  };
};

export const removeMemberFromGroup = (memberId, groupId) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    dispatch({ type: REMOVE_FROM_GROUP_PENDING });
    axios.post('https://creatify-backend.onrender.com/api/removeFromGroup', {
      chatId: groupId,
      userId: memberId,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ussToken}`,
      }
    }).then(res => dispatch({ type: REMOVE_FROM_GROUP_FULFILLED, payload: res }))
      .catch(err => dispatch({ type: REMOVE_FROM_GROUP_REJECTED, payload: err }));
  };
};

export const sendMessage = (chatId, messageContent) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    dispatch({ type: SEND_MESSAGE_PENDING });
    axios.post('https://creatify-backend.onrender.com/api/sendMessage', {
      chatId,
      content: messageContent,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ussToken}`,
      }
    })
      .then(res => dispatch({ type: SEND_MESSAGE_FULFILLED, payload: res }))
      .catch(err => dispatch({ type: SEND_MESSAGE_REJECTED, payload: err }));
  };
};

export const fetchAllMessagesOfChat = (chatId) => {
  return (dispatch, getState) => {
    const { ussToken } = getState();
    dispatch({ type: FETCH_CHAT_MESSAGE_PENDING });
    axios.get(`https://creatify-backend.onrender.com/api/${chatId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ussToken}`,
      }
    })
      .then(res => dispatch({ type: FETCH_CHAT_MESSAGE_FULFILLED, payload: res }))
      .catch(err => dispatch({ type: FETCH_CHAT_MESSAGE_REJECTED, payload: err }));
  };
};

export const setSocketInStore = (socket) => {
  return (dispatch) => {
    dispatch({ type: SET_SOCKET_IN_STORE, payload: { SOCKET: socket } })
  }
};

export const setNotificationArray = (newMessage) => {
  console.log('----------------------------------------------------------------', newMessage)
  return (dispatch) => {
    dispatch({ type: SET_NOTIFICATION_ARRAY, payload: { newMessage } })
  };
};