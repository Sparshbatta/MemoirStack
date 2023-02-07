import React, { useState } from "react";
import { Grow, Grid, Container, Paper, AppBar, TextField, Button, Typography } from '@material-ui/core';
import Posts from "../Posts/Posts";
import Form from "../Form/Form";
import { getPostsBySearch } from "../../actions/postsActions";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../../actions/postsActions";
import useStyles from './styles.js';
import Paginate from "../Pagination/Pagination";
import { useHistory, useLocation, Redirect } from "react-router-dom";
import ChipInput from 'material-ui-chip-input';
import { useEffect } from "react";


//works like a search query hook
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    
    const dispatch = useDispatch();
    const history = useHistory();
    const query = useQuery();
    const page = query.get('page') || 1;

    useEffect(()=>{
        dispatch(getPosts(page || 1, history));
    },[page,dispatch]);


    const classes = useStyles();
    const {numberOfPages, message} = useSelector((state)=>state.posts);
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);



    const searchPost = () => {
        if (search || tags) {
            //dispatch -> fetch search post 
            setSearch(search.trim());
            dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
            history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',') || ''}`)
        } else {
            history.push('/')
        }
    }

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            searchPost();
        }
    }

    const handleAdd = (tagToAdd) => setTags([...tags, tagToAdd])

    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete))

    return (message?(
        <Paper elevation={6} style={{borderRadius:'15px',padding:'15px 15px'}}>
            <Typography variant='h1' component='h1'>Sorry! Page not found 😥</Typography>
        </Paper>
    ):(
        <Grow in>
            <Container maxWidth="xl">
                <Grid container className={classes.gridContainer} justifyContent='space-between' alignItems='stretch' spacing={3}>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <AppBar className={classes.appBarSearch} position="static" color="inherit">
                            <TextField name="search" variant="outlined" label="Search Memories" value={search} fullWidth onChange={(e) => { setSearch(e.target.value) }} />
                            <ChipInput
                                style={{ margin: '10px 0' }}
                                value={tags}
                                onAdd={handleAdd}
                                variant="outlined"
                                label="Search Tags"
                                onDelete={handleDelete}
                            />
                            <Button color="primary" variant="contained" className={classes.searchButton} onClick={searchPost}>Search</Button>
                        </AppBar>
                        <Form currentId={currentId} setCurrentId={setCurrentId} page={page}/>
                        {(!search && !tags.length && numberOfPages && (
                            <Paper elevation={6} className={classes.pagination}>
                                <Paginate page={page} numberOfPages={numberOfPages}/>
                            </Paper>
                        ))}
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    )
    )
};

export default Home;