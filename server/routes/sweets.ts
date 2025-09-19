import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/database.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all sweets (public endpoint)
router.get('/', 
  [
    query('search').optional().isString().trim(),
    query('category').optional().isString().trim(),
    query('minPrice').optional().isNumeric(),
    query('maxPrice').optional().isNumeric(),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: { message: 'Validation failed', details: errors.array(), status: 400 } 
        });
      }

      const { 
        search, 
        category, 
        minPrice, 
        maxPrice, 
        limit = 20, 
        offset = 0 
      } = req.query;

      let query = supabase
        .from('sweets')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice as string));
      }

      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice as string));
      }

      // Apply pagination
      query = query.range(
        parseInt(offset as string), 
        parseInt(offset as string) + parseInt(limit as string) - 1
      );

      const { data: sweets, error, count } = await query;

      if (error) {
        console.error('Sweets fetch error:', error);
        return res.status(500).json({ 
          error: { message: 'Failed to fetch sweets', status: 500 } 
        });
      }

      res.status(200).json({
        sweets: sweets || [],
        total: count || 0,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });
    } catch (error) {
      console.error('Sweets fetch error:', error);
      res.status(500).json({ 
        error: { message: 'Internal server error', status: 500 } 
      });
    }
  }
);

// Search sweets
router.get('/search', 
  [
    query('q').optional().isString().trim(),
    query('category').optional().isString().trim(),
    query('minPrice').optional().isNumeric(),
    query('maxPrice').optional().isNumeric()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: { message: 'Validation failed', details: errors.array(), status: 400 } 
        });
      }

      const { q: search, category, minPrice, maxPrice } = req.query;

      let query = supabase
        .from('sweets')
        .select('*')
        .order('name', { ascending: true });

      // Apply search filters
      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (minPrice) {
        query = query.gte('price', parseFloat(minPrice as string));
      }

      if (maxPrice) {
        query = query.lte('price', parseFloat(maxPrice as string));
      }

      const { data: sweets, error } = await query;

      if (error) {
        console.error('Search error:', error);
        return res.status(500).json({ 
          error: { message: 'Search failed', status: 500 } 
        });
      }

      res.status(200).json({
        sweets: sweets || [],
        query: { search, category, minPrice, maxPrice }
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ 
        error: { message: 'Internal server error', status: 500 } 
      });
    }
  }
);

// Add new sweet (Admin only)
router.post('/', 
  authenticateToken,
  requireAdmin,
  [
    body('name').notEmpty().trim().withMessage('Sweet name is required'),
    body('category').notEmpty().trim().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('description').optional().isString().trim(),
    body('image_url').optional().isURL().withMessage('Image URL must be valid')
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: { message: 'Validation failed', details: errors.array(), status: 400 } 
        });
      }

      const { name, category, price, quantity, description = '', image_url } = req.body;

      const sweetId = uuidv4();
      const { data: sweet, error } = await supabase
        .from('sweets')
        .insert({
          id: sweetId,
          name,
          category,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          description,
          image_url
        })
        .select('*')
        .single();

      if (error) {
        console.error('Sweet creation error:', error);
        return res.status(500).json({ 
          error: { message: 'Failed to create sweet', status: 500 } 
        });
      }

      res.status(201).json({
        message: 'Sweet created successfully',
        sweet
      });
    } catch (error) {
      console.error('Sweet creation error:', error);
      res.status(500).json({ 
        error: { message: 'Internal server error', status: 500 } 
      });
    }
  }
);

// Update sweet (Admin only)
router.put('/:id',
  authenticateToken,
  requireAdmin,
  [
    body('name').optional().notEmpty().trim(),
    body('category').optional().notEmpty().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('quantity').optional().isInt({ min: 0 }),
    body('description').optional().isString().trim(),
    body('image_url').optional().isURL()
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: { message: 'Validation failed', details: errors.array(), status: 400 } 
        });
      }

      const { id } = req.params;
      const updateData = { ...req.body };

      if (updateData.price) updateData.price = parseFloat(updateData.price);
      if (updateData.quantity) updateData.quantity = parseInt(updateData.quantity);

      const { data: sweet, error } = await supabase
        .from('sweets')
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Sweet update error:', error);
        return res.status(500).json({ 
          error: { message: 'Failed to update sweet', status: 500 } 
        });
      }

      if (!sweet) {
        return res.status(404).json({ 
          error: { message: 'Sweet not found', status: 404 } 
        });
      }

      res.status(200).json({
        message: 'Sweet updated successfully',
        sweet
      });
    } catch (error) {
      console.error('Sweet update error:', error);
      res.status(500).json({ 
        error: { message: 'Internal server error', status: 500 } 
      });
    }
  }
);

// Delete sweet (Admin only)
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      const { error } = await supabase
        .from('sweets')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Sweet deletion error:', error);
        return res.status(500).json({ 
          error: { message: 'Failed to delete sweet', status: 500 } 
        });
      }

      res.status(200).json({
        message: 'Sweet deleted successfully'
      });
    } catch (error) {
      console.error('Sweet deletion error:', error);
      res.status(500).json({ 
        error: { message: 'Internal server error', status: 500 } 
      });
    }
  }
);

// Purchase sweet
router.post('/:id/purchase',
  authenticateToken,
  [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: { message: 'Validation failed', details: errors.array(), status: 400 } 
        });
      }

      const { id } = req.params;
      const { quantity: purchaseQuantity } = req.body;

      // Get current sweet data
      const { data: sweet, error: fetchError } = await supabase
        .from('sweets')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !sweet) {
        return res.status(404).json({ 
          error: { message: 'Sweet not found', status: 404 } 
        });
      }

      if (sweet.quantity < purchaseQuantity) {
        return res.status(400).json({ 
          error: { message: 'Insufficient quantity in stock', status: 400 } 
        });
      }

      // Update quantity
      const newQuantity = sweet.quantity - purchaseQuantity;
      const { data: updatedSweet, error: updateError } = await supabase
        .from('sweets')
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (updateError) {
        console.error('Purchase update error:', updateError);
        return res.status(500).json({ 
          error: { message: 'Failed to process purchase', status: 500 } 
        });
      }

      // Record purchase (optional - could be implemented later)
      const totalPrice = sweet.price * purchaseQuantity;

      res.status(200).json({
        message: 'Purchase successful',
        purchase: {
          sweet_id: id,
          sweet_name: sweet.name,
          quantity: purchaseQuantity,
          unit_price: sweet.price,
          total_price: totalPrice,
          remaining_stock: newQuantity
        },
        sweet: updatedSweet
      });
    } catch (error) {
      console.error('Purchase error:', error);
      res.status(500).json({ 
        error: { message: 'Internal server error', status: 500 } 
      });
    }
  }
);

// Restock sweet (Admin only)
router.post('/:id/restock',
  authenticateToken,
  requireAdmin,
  [
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          error: { message: 'Validation failed', details: errors.array(), status: 400 } 
        });
      }

      const { id } = req.params;
      const { quantity: restockQuantity } = req.body;

      // Get current sweet data
      const { data: sweet, error: fetchError } = await supabase
        .from('sweets')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !sweet) {
        return res.status(404).json({ 
          error: { message: 'Sweet not found', status: 404 } 
        });
      }

      // Update quantity
      const newQuantity = sweet.quantity + restockQuantity;
      const { data: updatedSweet, error: updateError } = await supabase
        .from('sweets')
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (updateError) {
        console.error('Restock update error:', updateError);
        return res.status(500).json({ 
          error: { message: 'Failed to restock sweet', status: 500 } 
        });
      }

      res.status(200).json({
        message: 'Restock successful',
        restock: {
          sweet_id: id,
          sweet_name: sweet.name,
          added_quantity: restockQuantity,
          previous_stock: sweet.quantity,
          new_stock: newQuantity
        },
        sweet: updatedSweet
      });
    } catch (error) {
      console.error('Restock error:', error);
      res.status(500).json({ 
        error: { message: 'Internal server error', status: 500 } 
      });
    }
  }
);

export default router;