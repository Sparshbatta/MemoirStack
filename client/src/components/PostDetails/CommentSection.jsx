import React, {useState, useRef} from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import useStyles from './styles';
import {commentPost} from '../../actions/postsActions'


const CommentSection = ({post}) => {
    const classes = useStyles();
    const [comments,setComments] = useState(post?.comments);
    const [comment, setComment] = useState('');
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    const commentsRef = useRef();

    const handleClick= async ()=>{
        const finalComment = `${user.result.name}: ${comment}`;
        const newComments = await dispatch(commentPost({finalComment}, post._id));
        setComments(newComments);
        setComment('');
        commentsRef.current.scrollIntoView({ behavior:'smooth'});
    }   

    return (
        <div className={classes.commentsOuterContainer}>
            <div className={classes.commentsInnerContainer}>
                <Typography gutterBottom variant='h6'>Comments</Typography>
                {comments.length ? comments.map((comment,index)=>(
                    <Typography key={index} gutterBottom variant='subtitle1'>
                        <strong>{comment.split(':')[0]}</strong>:
                        {comment.split(':')[1]}
                    </Typography>
                )):(
                    <Typography gutterBottom variant='subtitle1'>Sorry! No comments to display</Typography>
                )}
                <div ref={commentsRef} />
            </div>
            <div>
                <TextField 
                fullWidth
                minRows={6}
                variant='outlined'
                label='comment'
                multiline
                value={comment}
                onChange={(e)=>setComment(e.target.value)}/>
                <Button style={{marginTop:'10px'}} fullWidth disabled={!comment} variant='contained' onClick={handleClick}>
                    Comment
                </Button>
            </div>
        </div>
    )
};

export default CommentSection;