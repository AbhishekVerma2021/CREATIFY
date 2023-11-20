import {
  FETCH_ALL_POSTS,
  FETCH_ALL_POSTS_FULFILLED,
  FETCH_ALL_POSTS_REJECTED,
  FETCH_ALL_POSTS_PENDING,
  SUBMIT_USER,
  SUBMIT_USER_FULFILLED,
  SUBMIT_USER_PENDING,
  SUBMIT_USER_REJECTED,
  LOGIN_USER,
  LOGIN_USER_FULFILLED,
  LOGIN_USER_PENDING,
  LOGIN_USER_REJECTED,
  USER_LOGIN_STATUS,
  USER_LOGIN_STATUS_FULFILLED,
  USER_LOGIN_STATUS_PENDING,
  USER_LOGIN_STATUS_REJECTED,
  FETCH_PROFILE_DETAILS,
  FETCH_PROFILE_DETAILS_FULFILLED,
  FETCH_PROFILE_DETAILS_PENDING,
  FETCH_PROFILE_DETAILS_REJECTED,
} from './actionTypes';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const initialState = {
  postFeedData: [],
  profilePostsData: [],
  errorForNoData: false,
  isLoading: false,
  ussToken: '',
  isUserLoggedIn: false,
  activeUserDetails: {
    username: '',
    email: '',
    _id: '',
    followers: [],
    followings: [],
  },
  userRegistrationSuccessful: undefined,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_POSTS: {
      return {
        ...state,
      };
    }
    case FETCH_ALL_POSTS_FULFILLED: {
      const { posts } = action.payload;
      return {
        ...state,
        postFeedData: posts,
        errorForNoData: false,
        isLoading: false,
      }
    }
    case FETCH_ALL_POSTS_REJECTED: {
      return {
        ...state,
        errorForNoData: true,
        isLoading: false,
      }
    }
    case FETCH_ALL_POSTS_PENDING: {
      return {
        ...state,
        isLoading: true,
      }
    }
    case SUBMIT_USER: {
      return {
        ...state,
        isLoading: true,
      }
    }
    case SUBMIT_USER_FULFILLED: {
      return {
        ...state,
        isLoading: false,
        userRegistrationSuccessful: true,
      }
    }
    case SUBMIT_USER_PENDING: {
      console.log('sadasd')
      return {
        ...state,
        isLoading: true,
      }
    }
    case SUBMIT_USER_REJECTED: {
      alert('asdasd')
      return {
        ...state,
        isLoading: false,
        userRegistrationSuccessful: false,
      }
    }

    case LOGIN_USER: {
      return {
        ...state,
        isLoading: true,
      }
    }
    case LOGIN_USER_FULFILLED: {
      const { data: { token, user: { username, email, _id } } } = action.payload;
      console.log(token)
      toast.success(`Welcome ${username}`, {
        position: toast.POSITION.BOTTOM_LEFT
      });
      localStorage.setItem('TOKEN', token)
      const user = {
        username,
        email,
        _id,
      }
      return {
        ...state,
        isLoading: false,
        ussToken: token,
        activeUserDetails: user,
      }
    }
    case LOGIN_USER_PENDING: {
      return {
        ...state,
        isLoading: true,
      }
    }
    case LOGIN_USER_REJECTED: {
      const { response: { data } } = action.payload;
      console.log(action.payload.response.data)
      toast.error(data,{
        position: toast.POSITION.BOTTOM_LEFT
      })
      return{
        isLoading: false,
      }
    }

    case USER_LOGIN_STATUS: {
      return {
        ...state,
      }
    }
    case USER_LOGIN_STATUS_FULFILLED: {
      const userData = action.payload; // {username: '', email: '', _id: ''}
      console.log('))))))))))))))))))))))))0',action.payload);
      const token = localStorage.getItem('TOKEN')
      console.log(token)
      return {
        ...state,
        isUserLoggedIn: true,
        activeUserDetails: userData,
        ussToken: token,
      }
    }
    case USER_LOGIN_STATUS_PENDING: {
      return {
        ...state,
        isUserLoggedIn: false,
      }
    }
    case USER_LOGIN_STATUS_REJECTED: {
      const { message } = action.payload;
      toast.error(message, {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      return {
        ...state,
        isUserLoggedIn: false,
      }
    }
    case FETCH_PROFILE_DETAILS: {
      return {
        ...state,
      }
    }
    case FETCH_PROFILE_DETAILS_PENDING: {
      return {
        ...state,
      }
    }
    case FETCH_PROFILE_DETAILS_FULFILLED: {
      const { posts } = action.payload;
      console.log(posts)
      return {
        ...state,
        profilePostsData: posts,
      }
    }
    case FETCH_PROFILE_DETAILS_REJECTED: {
      return {
        ...state,
      }
    }
    default: return state;
  }
}

export default reducer;