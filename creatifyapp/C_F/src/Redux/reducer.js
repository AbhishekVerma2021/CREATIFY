import {
    FETCH_ALL_POSTS,
    FETCH_ALL_POSTS_FULLFILLED,
    FETCH_ALL_POSTS_REJECTED,
    FETCH_ALL_POSTS_PENDING,
} from './actionTypes';

const initialState = {
    postFeedData: [1,2,3,4],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_POSTS: {
            return {
                ...state,
            };
        }
        case FETCH_ALL_POSTS_FULLFILLED: {
            alert(action.payload.data);
            console.log(action.payload.data);
            return {
                ...state,
            }
        }
        case FETCH_ALL_POSTS_REJECTED: {
            return {
                ...state,
            }
        }
        case FETCH_ALL_POSTS_PENDING: {
            return {
                ...state,
            }
        }
    }
}

export default reducer;