import mongoose from 'mongoose';
import Post from '../models/Post.js';


export const getPosts = async (req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 8;
        const startIndex = ((Number(page) - 1) * LIMIT);
        const total = await Post.countDocuments();
        const posts = await Post.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
        const numberOfPages = Math.ceil(total / LIMIT);
        const currentPage = Number(page);
        if (currentPage > numberOfPages) {
            return res.status(200).json({ message: 'Page Not Found' });
        }
        res.status(200).json({ postsData: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const post = req.body;
        const newPost = new Post({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const updatePost = async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        res.status(404).send('No post with that ID');
    }
    const updatedPost = await Post.findByIdAndUpdate(_id, post, { new: true });
    res.json(updatedPost);
};

export const deletePost = async (req, res) => {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('No post with that ID');
    const deletedPost = await Post.findByIdAndRemove(_id);
    res.send({ post: deletedPost, message: 'Post deleted successfully' })
};


export const likePost = async (req, res) => {
    const { id: _id } = req.params;
    if (!req.userId)
        return res.json({ message: 'Unauthenticated!' });
    if (!mongoose.Types.ObjectId.isValid(_id))
        return res.status(404).send('No post with that ID');
    const post = await Post.findById(_id);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
        //like the post
        post.likes.push(req.userId);
    } else {
        //dislike the post
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await Post.findByIdAndUpdate(_id, post, { new: true });
    res.json(updatedPost);
};

//Query and Params are actually two different concepts
//QUERY:-   /posts?page=1 => page = 1 (it's a query)
//PARAMS:-  (/posts/:id) <-> (/posts/123) => id = 123 is param

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query;
    try {
        const allPosts = await Post.find();
        if (searchQuery === 'none' && tags === '')
            return res.json({ data: allPosts });

        const title = new RegExp(searchQuery, 'i');
        // 'i' stands for ignore case
        const posts = await Post.find({ $or: [{ title }, { tags: { $in: tags?.split(',') } }] });
        //$or means, either find the post that matches the title or the tag or both
        //$in means, search within an array of tags
        res.json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const getPost = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Post.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const commentPost = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        console.log(data);
        const post = await Post.findById(id);
        post.comments.push(data.finalComment);
        const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
        res.json(updatedPost);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}