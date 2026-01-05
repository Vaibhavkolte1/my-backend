import express from 'express';
import authUser from '../controllers/auth.controllers.js';

const router = express.Router();


// /api/auth/user/register
router.post('/user/register', authUser.registerUser);

// /api/auth/user/login
router.post('/user/login', authUser.loginUser);

// /api/auth/user/logout
router.get('/user/logout', authUser.logoutUser);

// /api/auth/myProfile
router.get('/myProfile', authUser.myProfile);


export default router;
