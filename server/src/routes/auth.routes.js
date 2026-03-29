import express from 'express';
import { body } from 'express-validator';
import { register, login, logout, refreshToken } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', [
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Please enter a password with 6 or more characters')
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
], login);

router.post('/logout', logout);
router.post('/refresh', refreshToken);

export default router;
