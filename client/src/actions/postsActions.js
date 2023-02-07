import * as api from '../api';
import { CREATE, UPDATE, DELETE, LIKE, FETCH_ALL, FETCH_POST, START_LOADING, END_LOADING, FETCH_BY_SEARCH, COMMENT } from '../constants/actionTypes';

//Action Creators
export const getPosts = ((page) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPosts(page);
        dispatch({ type: FETCH_ALL, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error);
    }
});

export const getPost = ((id) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPost(id);
        dispatch({ type: FETCH_POST, payload: data });
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error);
    }
})

export const createPost = ((post, history) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.createPost(post);
        dispatch({ type: CREATE, payload: data });
        dispatch({ type: END_LOADING });
        console.log('data',data);
        history.push(`/posts/${data._id}`);
    } catch (error) {
        console.log(error);
    }
});


export const updatePost = ((id, post) => async (dispatch) => {
    try {
        const { data } = await api.updatePost(id, post);
        dispatch({ type: UPDATE, payload: data });
    } catch (error) {
        console.log(error);
    }
});

export const deletePost = ((id,page,history) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        await api.deletePost(id, page);
        dispatch({ type: DELETE, payload: id });
        history.push(`/posts?page=${page || 1}`);
        dispatch({ type: END_LOADING });
    } catch (error) {
        console.log(error);
    }
});


export const likePost = (id) => async (dispatch) => {
    try {
        const { data } = await api.likePost(id);
        dispatch({ type: LIKE, payload: data });
    } catch (error) {
        console.log(error);
    }
};


export const getPostsBySearch = (searchQuery) => async (dispatch) => {
    try {
        dispatch({ type: START_LOADING });
        const { data } = await api.fetchPostsBySearch(searchQuery);
        dispatch({ type: END_LOADING });
        dispatch({ type: FETCH_BY_SEARCH, payload: data.data });
    } catch (error) {
        console.log(error);
    }
};


export const commentPost = (finalComment, _id) => async (dispatch) => {
    try {
        const {data} = await api.comment(finalComment, _id);
        dispatch({type:COMMENT, payload:data});
        return data.comments;
    } catch (error) {
        console.log(error);
    }
}