import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try{
        const dbUser = await User.findOne({email});
        if(!dbUser){
            return res.status(404).json({message:'User doesn\'t exist! Please register yourself!'});
        }       
        const isPasswordCorrect = await bcrypt.compare(password, dbUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:'Invalid credentials!'});
        }
        const token = jwt.sign({email:dbUser.email, id: dbUser._id}, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.status(200).json({result: dbUser, token});
    }catch(error){
        res.status(500).json({status:'error', message:error});
    }
};

export const signUp = async (req, res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body;
    try{
        const dbUser = await User.findOne({email});
        if(dbUser){
            return res.status(400).json({message:'User already exists!'});
        }
        if(password !== confirmPassword){
            return res.status(400).json({message:'Passwords do not match!'}); 
        }
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await User.create({email, password: hashedPassword, name:`${firstName} ${lastName}`});
        const token = jwt.sign({email, id: result._id}, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.status(200).json({result, token});   
    }catch(error){
        res.status(500).json({status:'error', message:error.message});
    }
};