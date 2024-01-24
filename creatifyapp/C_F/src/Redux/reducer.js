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
  FETCH_COMMENTS_FOR_POST,
  FETCH_COMMENTS_FOR_POST_FULFILLED,
  FETCH_COMMENTS_FOR_POST_REJECTED,
  FETCH_COMMENTS_FOR_POST_PENDING,
  USER_COMMENT,
  USER_COMMENT_FULFILLED,
  USER_COMMENT_PENDING,
  USER_COMMENT_REJECTED,
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
  FOLLOW_ACCOUNT,
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

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import socket from 'socket.io-client';


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
    following: [],
    favorites: [],
  },
  selectedUserProfileDetails: {
    fetchedProfileUsername: '',
    fetchedProfileEmail: '',
    fetchedProfileId: '',
    fetchedProfilePosts: [],
    fetchedProfileFollowers: [],
    fetchedProfileFollowing: [],
  },
  userRegistrationSuccessful: undefined,
  postsComments: {},
  postsLikes: {},
  favoritePostIds: [],
  imageURL: '',
  pageHeaderText: '',
  allUsersList: [],
  selectedChat: undefined,
  allUserChats: [],
  activeChatMessagesArray: [],
  SOCKET: null,
  notifications: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_NOTIFICATION_ARRAY: {
      const { newMessage } = action.payload;
      return {
        notifications: [newMessage, ...state.notifications],
      }
    }

    case SET_SOCKET_IN_STORE: {
      const { SOCKET } = action.payload;
      return {
        ...state,
        SOCKET,
      }
    }
    case SEND_MESSAGE: {
      return {
        ...state,
      }
    }
    case SEND_MESSAGE_PENDING: {
      return {
        ...state,
      }
    }
    case SEND_MESSAGE_FULFILLED: {
      const { data } = action.payload;
      // const { _id } = data;
      toast.success('Message Sent', {
        position: toast.POSITION.BOTTOM_LEFT,
      });
      
      state.SOCKET.emit("new message", data);
      // console.log(_id, data)
      let newSelectedChatMessageArray = [...state.activeChatMessagesArray, data];
      // console.log('New Message' , newSelectedChatMessageArray, state.activeChatMessagesArray)
      return {
        ...state,
        activeChatMessagesArray: newSelectedChatMessageArray,
      }
    }
    case SEND_MESSAGE_REJECTED: {
      return {
        ...state,
      }
    }

    case FETCH_CHAT_MESSAGE: {
      return {
        ...state,
      }
    }
    case FETCH_CHAT_MESSAGE_PENDING: {
      return {
        ...state,
      }
    }
    case FETCH_CHAT_MESSAGE_FULFILLED: {
      const { data } = action.payload;
      // console.log(data);
      return {
        ...state,
        activeChatMessagesArray: data,
      }
    }
    case FETCH_CHAT_MESSAGE_REJECTED: {
      return {
        ...state,
      }
    }


    case RENAME_GROUP: {
      return {
        ...state,
      }
    }
    case RENAME_GROUP_PENDING: {
      return {
        ...state,
      }
    }
    case RENAME_GROUP_FULFILLED: {
      const { data } = action.payload;
      // console.log(data);
      const { _id } = data;
      const newAllUserChats = state.allUserChats.map(chat => {
        // console.log(chat._id,_id)
        if(chat._id === _id) return data;
        return chat;
      });
      // console.log(newAllUserChats);
      toast.success('RENAMED!!!', {
        position: toast.POSITION.BOTTOM_LEFT,
      })
      return {
        ...state,
        allUserChats: newAllUserChats,
      }
    };
    case RENAME_GROUP_REJECTED: {
      console.log(action.payload)
      return {
        ...state,
      }
    }
    case REMOVE_FROM_GROUP: {
      return {
        ...state,
      }
    };
    case REMOVE_FROM_GROUP_PENDING: {
      return {
        ...state,
      }
    }
    case REMOVE_FROM_GROUP_FULFILLED: {
      const { data } = action.payload;
      const { _id } = data;
      const newAllUserChats = state.allUserChats.map(chat => chat._id === _id ? data : chat);
      toast.success('Removed!!', {
        position: toast.POSITION.BOTTOM_LEFT,
      })
      return {
        ...state,
        allUserChats: newAllUserChats,
      }
    };
    case REMOVE_FROM_GROUP_REJECTED: {
      console.log(action.payload)
      return {
        ...state,
      }
    };
    case ADD_TO_GROUP: {
      return {
        ...state,
      }
    };
    case ADD_TO_GROUP_PENDING: {
      return {
        ...state,
      }
    }
    case ADD_TO_GROUP_FULFILLED: {
      const { data } = action.payload;
      const { _id } = data;
      const newAllUserChats = state.allUserChats.map(chat => chat._id === _id ? data : chat);
      toast.success('Added to group!!', {
        position: toast.POSITION.BOTTOM_LEFT,
      })
      return {
        ...state,
        allUserChats: newAllUserChats,
      }
    };
    case ADD_TO_GROUP_REJECTED: {
      console.log(action.payload)
      return {
        ...state,
      }
    }
    
    case CREATE_CHAT_GROUP: {
      return {
        ...state,
      }
    };
    case CREATE_CHAT_GROUP_PENDING: {
      return {
        ...state,
      }
    }
    case CREATE_CHAT_GROUP_FULFILLED: {
      const { data } = action.payload;
      toast.success('Created chat group', {
        position: toast.POSITION.BOTTOM_LEFT,
      })
      return {
        ...state,
        // allUserChats: data,
      }
    };
    case CREATE_CHAT_GROUP_REJECTED: {
      console.log(action.payload)
      return {
        ...state,
      }
    }
    
    case FETCH_ALL_CHATS: {
      return {
        ...state,
      }
    };
    case FETCH_ALL_CHATS_PENDING: {
      return {
        ...state,
      }
    }
    case FETCH_ALL_CHATS_FULFILLED: {
      const { data } = action.payload;
      return {
        ...state,
        allUserChats: data,
      }
    };
    case FETCH_ALL_CHATS_REJECTED: {
      console.log(action.payload)
      return {
        ...state,
      }
    }


    case CREATE_CHAT: {
      return {
        ...state,
      }
    };
    case CREATE_CHAT_PENDING: {
      return {
        ...state,
      }
    }
    case CREATE_CHAT_FULFILLED: {
      const chat = action.payload;
      let existingChatFlag = false;
      if (!state.allUserChats.find(c => c._id === chat._id)) {
        existingChatFlag = true;
      }
      return {
        ...state,
        allUserChats: existingChatFlag ? [chat, ...state.allUserChats] : state.allUserChats,
        selectedChat: chat,
      }
    };
    case CREATE_CHAT_REJECTED: {
      console.log(action.payload)
      return {
        ...state,
      }
    }


    case FETCH_ALL_POSTS: {
      return {
        ...state,
      };
    }
    case FETCH_ALL_POSTS_FULFILLED: {
      const { posts } = action.payload;
      // console.log(posts)
      const likesForPost = {};
      posts.forEach((post) => likesForPost[post._id] = post.likes);
      return {
        ...state,
        postFeedData: posts,
        errorForNoData: false,
        isLoading: false,
        postsLikes: { ...state.postsLikes, ...likesForPost }
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
      const { data: { token, user: { username, email, _id, followers, following, favorites } } } = action.payload;
      // console.log(following, action.payload)
      toast.success(`Welcome ${username}`, {
        position: toast.POSITION.BOTTOM_LEFT
      });
      localStorage.setItem('TOKEN', token)
      const user = {
        username,
        email,
        _id,
        following,
        followers,
        favorites: favorites,
      }
      // console.log(user)
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
      toast.error(data, {
        position: toast.POSITION.BOTTOM_LEFT
      })
      return {
        isLoading: false,
      }
    }

    case USER_LOGIN_STATUS: {
      return {
        ...state,
      }
    }
    case USER_LOGIN_STATUS_FULFILLED: {
      const { user, favoritePosts } = action.payload;
      const token = localStorage.getItem('TOKEN')
      const { favorites, username, email, _id, followers, following } = user;

      return {
        ...state,
        isUserLoggedIn: true,
        activeUserDetails: {
          username,
          email,
          _id,
          followers,
          following,
          favorites: favoritePosts,
        },
        favoritePostIds: favorites,
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
        isLoading: true,
      }
    }
    case FETCH_PROFILE_DETAILS_FULFILLED: {
      const { posts, otherAccountFlag } = action.payload;

      if (!otherAccountFlag) {
        const likesForPost = {};
        posts.forEach((post) => likesForPost[post._id] = post.likes);
        return {
          ...state,
          profilePostsData: posts,
          postsLikes: { ...state.postsLikes, ...likesForPost }
        }
      }
      else {
        const { userDetails } = action.payload;
        const {
          followers,
          following,
          username,
          _id,
          email,
        } = userDetails;
        // console.log(userDetails)
        return {
          ...state,
          selectedUserProfileDetails: {
            ...state.selectedUserProfileDetails,
            fetchedProfileFollowers: followers,
            fetchedProfileFollowing: following,
            fetchedProfileUsername: username,
            fetchedProfileId: _id,
            fetchedProfileEmail: email,
            fetchedProfilePosts: posts,
          }
        }
      }
    }
    case FETCH_PROFILE_DETAILS_REJECTED: {
      return {
        ...state,
      }
    }

    case USER_COMMENT: {
      return {
        ...state,
      }
    }
    case USER_COMMENT_PENDING: {
      return {
        ...state,
      }
    }
    case USER_COMMENT_FULFILLED: {
      const { comments, postId } = action.payload;
      const postAndItsComments = {}
      postAndItsComments[postId] = comments
      return {
        ...state,
        postsComments: { ...state.postsComments, ...postAndItsComments }
      }
    }
    case USER_COMMENT_REJECTED: {
      return {
        ...state,
      }
    }

    case FETCH_COMMENTS_FOR_POST: {
      return {
        ...state,
      }
    }
    case FETCH_COMMENTS_FOR_POST_PENDING: {
      return {
        ...state,
      }
    }
    case FETCH_COMMENTS_FOR_POST_FULFILLED: {
      const { comments, postId } = action.payload;
      const newPostComments = {};
      newPostComments[postId] = comments;
      return {
        ...state,
        postsComments: { ...state.postsComments, ...newPostComments }
      }
    }
    case FETCH_COMMENTS_FOR_POST_REJECTED: {
      return {
        ...state,
      }
    }

    case HANDLE_LIKES: {
      return {
        ...state,
      }
    }
    case HANDLE_LIKES_PENDING: {
      return {
        ...state,
      }
    }
    case HANDLE_LIKES_FULFILLED: {
      // console.log(action.payload)
      return {
        ...state,
      }
    }
    case HANDLE_LIKES_REJECTED: {
      return {
        ...state,
      }
    }

    case UPLOAD_IMAGE: {
      return {
        ...state,
      }
    }
    case UPLOAD_IMAGE_PENDING: {
      return {
        ...state,
      }
    }
    case UPLOAD_IMAGE_FULFILLED: {
      const { secure_url } = action.payload;
      return {
        ...state,
        imageURL: secure_url,
      }
    }
    case UPLOAD_IMAGE_REJECTED: {
      const {
        data: {
          message
        }
      } = action.payload;

      toast.error(message, { position: toast.POSITION.BOTTOM_LEFT })
      return {
        ...state,
      }
    }

    case CREATE_POST: {
      return {
        ...state,
      }
    }
    case CREATE_POST_PENDING: {
      return {
        ...state,
      }
    }
    case CREATE_POST_FULFILLED: {
      // console.log(action.payload);
      toast.success(action.payload, { position: toast.POSITION.BOTTOM_LEFT })
      return {
        ...state,
      }
    }
    case CREATE_POST_REJECTED: {
      console.log(action.payload)
      return {
        ...state,
      }
    }

    case FOLLOW_ACCOUNT: {
      return {
        ...state,
      }
    }
    case FOLLOW_ACCOUNT_PENDING: {
      return {
        ...state,
      }
    }
    case FOLLOW_ACCOUNT_FULFILLED: {
      const { followers, following } = action.payload;
      toast.success('Followed!!', { position: toast.POSITION.BOTTOM_LEFT });

      return {
        ...state,
        activeUserDetails: {
          ...state.activeUserDetails,
          followers,
          following,
        }
      }
    }
    case FOLLOW_ACCOUNT_REJECTED: {
      console.log(action.payload)
      toast.error('Some Error occured', { position: toast.POSITION.BOTTOM_LEFT });
      return {
        ...state,
      }
    }

    case FAVORITE_POST: {
      return {
        ...state,
      }
    }
    case FAVORITE_POST_PENDING: {
      return {
        ...state,
      }
    }
    case FAVORITE_POST_FULFILLED: {
      const { favouritePosts, favouritePostIds, message } = action.payload;
      toast.success(message, {
        position: toast.POSITION.BOTTOM_LEFT,
      })
      return {
        ...state,
        activeUserDetails: {
          ...state.activeUserDetails,
          favorites: favouritePosts,
        },
        favoritePostIds: favouritePostIds,
      }
    }
    case FAVORITE_POST_REJECTED: {
      console.log(action.payload);
      return {
        ...state,
      }
    }

    case SET_PAGE_HEADER: {
      const { headerText } = action.payload;
      return {
        ...state,
        pageHeaderText: headerText,
      }
    }

    case FETCH_ALL_USERS: {

    }
    case FETCH_ALL_USERS_PENDING: {
      return {
        ...state,
      }
    }
    case FETCH_ALL_USERS_FULFILLED: {
      const { users } = action.payload;
      // console.log(users);
      return {
        ...state,
        allUsersList: users,
      }
    }
    case FETCH_ALL_USERS_REJECTED: {
      console.log(action.payload);
      return {
        ...state,
      }
    }
    default: return state;
  }
}

export default reducer;