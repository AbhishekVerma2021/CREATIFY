import {
  FETCH_ALL_POSTS,
  FETCH_ALL_POSTS_FULLFILLED,
  FETCH_ALL_POSTS_REJECTED,
  FETCH_ALL_POSTS_PENDING,
} from './actionTypes';

import axios from 'axios';


export const fetchAllPostData = () => {
  return {
    type: 'FETCH_ALL_POSTS',
    payload: axios.get('http://localhost:8000/api/posts', {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user:token")}`,
      }
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    }),
  };
};