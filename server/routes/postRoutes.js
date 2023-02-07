import express from 'express';
import { getPosts, createPost, updatePost, deletePost, likePost, getPostsBySearch, getPost, commentPost } from '../controllers/postController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search',getPostsBySearch);
router.get('/', getPosts);
router.post('/create', auth, createPost);
router.patch('/:id', auth, updatePost);
router.delete('/:id', auth ,deletePost);
router.patch('/:id/likePost', auth, likePost);
router.get('/:id',getPost);
router.post('/:id/commentPost', commentPost);

export default router;