import {CREATE, UPDATE, DELETE, LIKE, FETCH_ALL, FETCH_POST, FETCH_BY_SEARCH, START_LOADING, END_LOADING, COMMENT} from '../constants/actionTypes';

const posts = (state = {posts:[], isLoading:true},action) => {
    switch(action.type){
        case START_LOADING:
            return {...state, isLoading:true};
        case END_LOADING:
            return {...state, isLoading:false};
        case FETCH_ALL:
            return {...state,
                posts:action.payload.postsData,
                currentPage:action.payload.currentPage,
                numberOfPages:action.payload.numberOfPages,
                message:action.payload.message
            };
        case FETCH_BY_SEARCH:
            return {...state,
                posts:action.payload
            };
        case FETCH_POST:
            return {...state,
            post:action.payload}
        case DELETE:
            return {...state, posts:state.posts.filter((post) => post._id !== action.payload)};
        case LIKE:  
        case UPDATE:
            return {...state, posts:state.posts.map((post)=> post._id === action.payload._id ? action.payload : post)};
        case CREATE:
            return {...state,posts:[...state.posts, action.payload]};
        case COMMENT:
            return {...state,
            posts:state.posts.map((post)=>{
                if(post._id === action.payload.id)
                    return action.payload;
                return post;
            })
        }
        default:
            return state;
    }
};

export default posts;