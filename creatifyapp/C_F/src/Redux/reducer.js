import {
    FETCH_ALL_POSTS,
    FETCH_ALL_POSTS_FULFILLED,
    FETCH_ALL_POSTS_REJECTED,
    FETCH_ALL_POSTS_PENDING,
} from './actionTypes';

const initialState = {
    postFeedData: [1,3,4,5,6,77,23],
    errorForNoData: false,
    isLoading: true,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ALL_POSTS: {
            return {
                ...state,
            };
        }
        case FETCH_ALL_POSTS_FULFILLED: {
            // alert(action.payload.data);
            console.log("------------------------",action.payload);
            return {
                ...state,
                postFeedData: [...state.postFeedData],
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
    }
}

export default reducer;