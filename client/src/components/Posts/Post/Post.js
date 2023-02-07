import React, {useState} from 'react';
import useStyles from './styles';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined'
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { deletePost, likePost } from '../../../actions/postsActions';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import {useHistory, useLocation} from 'react-router-dom';

//works like a search query hook
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Post = ({ post, setCurrentId }) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const query = useQuery();
    const page = query.get('page') || 1;
    console.log(post);
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes, setLikes] = useState(post?.likes);
    const userId = (user?.result?.sub || user?.result?._id);
    const hasLikedPost = post.likes.find((like) => like === (userId)); 

    const handleLike = async () => {
        dispatch(likePost(post._id));
        if(hasLikedPost){
            setLikes(post.likes.filter((id)=>id !== (userId)));
        }else{
            setLikes([...post.likes, userId]);
        }
    };

    const Likes = () => {
        if (post.likes.length > 0) {
            return post.likes.find((like) => like === (user?.result?.sub || user?.result?._id)) ?
                (
                    <>
                        <ThumbUpAltIcon fontSize='small' />&nbsp;{post.likes.length >= 2 ? `You and ${post.likes.length - 1} ${(post.likes.length - 1) === 1 ? 'other' : 'others'}` : `${post.likes.length}`}
                    </>
                )
                : (
                    <>
                        <ThumbUpAltOutlined fontSize='small' />&nbsp;{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}
                    </>
                )
        }
        return <><ThumbUpAltOutlined fontSize='small' />&nbsp;Like</>
    };

    const openPost = () => {
        history.push(`/posts/${post._id}`);
    }

    return (
        <Card className={classes.card} raised elevation={8}>
            <CardMedia className={classes.media} title={post.title} image={post.selectedFile} component="area" />
            <div className={classes.overlay}>
                <Typography variant='h6'>{post.name}</Typography>
                <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
            </div>
            <div className={classes.overlay2}>
                {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && (
                    <Button style={{ color: 'white' }} size='small' onClick={() => setCurrentId(post._id)}>
                        <EditOutlinedIcon fontSize='medium' />
                    </Button>
                )}

            </div>
            <div className={classes.details}>
                <Typography variant='body2' color='textSecondary'>{post.tags.map((tag) => (`#${tag} `))}</Typography>
            </div>
            <ButtonBase
                component='span'
                name='test'
                className={classes.cardAction}
                onClick={openPost}
            >
            <Typography className={classes.title} variant='h5' gutterBottom>{post.title}</Typography>
            </ButtonBase>
            <CardContent>
                <Typography variant='body2' color='textSecondary' component='p'>{post.message}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <Button size='small' color='primary' disabled={!user?.result} onClick={handleLike}>
                    <Likes />
                </Button>
                {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && (
                    <Button size='small' color='primary' onClick={() => { dispatch(deletePost(post._id, page, history)) }}>
                        <DeleteIcon fontSize='small' />
                    </Button>
                )}
            </CardActions>
        </Card>
    )
};

export default Post;