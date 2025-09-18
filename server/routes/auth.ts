import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/database';

const router = express.Router();

// Registration endpoint
router.post('/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').optional().isIn(['admin', 'customer']).withMessage('Role must be admin or customer')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: { message: 'Validation failed', details: errors.array(), status: 400 } 
        });
      }

      const { email, password, role = 'customer' } = req.body;

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(409).json({ 
          error: { message: 'User already exists with this email', status: 409 } 
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user
      const userId = uuidv4();
      const { data: user, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email,
          password_hash: hashedPassword,
          role
        })
        .select('id, email, role, created_at')
        .single();

      if (error) {
        console.error('User creation error:', error);
        return res.status(500).json({ 
          error: { message: 'Failed to create user', status: 500 } 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        error: { message: 'Internal server error', status: 500 } 
      });
    }
  }
);

// Login endpoint
router.post('/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: { message: 'Validation failed', details: errors.array(), status: 400 } 
        });
      }

      const { email, password } = req.body;

      // Find user
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, password_hash, role, created_at')
        .eq('email', email)
        .single();

      if (error || !user) {
        return res.status(401).json({ 
          error: { message: 'Invalid email or password', status: 401 } 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ 
          error: { message: 'Invalid email or password', status: 401 } 
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '7d' }
      );

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        error: { message: 'Internal server error', status: 500 } 
      });
    }
  }
);

export default router;