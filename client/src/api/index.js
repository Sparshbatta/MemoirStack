import axios from 'axios';

const API = axios.create({baseURL:'http://localhost:3001'});

API.interceptors.request.use((req)=>{
    if(localStorage.getItem('profile')){
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }
    return req;
});

//posts related requests
export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const fetchPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags || ''}`) 
export const createPost = (newPost) => API.post(`/posts/create`, newPost);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id, page) => API.delete(`/posts/${id}?page=${page}`);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const comment = (finalComment, _id) => API.post(`/posts/${_id}/commentPost`, finalComment);

//users related requests
export const signIn = (formData) => API.post('/users/signin', formData);
export const signUp = (formData) => API.post('/users/signup', formData);