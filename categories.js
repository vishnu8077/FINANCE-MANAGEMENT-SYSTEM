import express from 'express';
import Category from '../models/Category.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Default categories to create for new users
const defaultCategories = [
  { name: 'Food & Dining', color: '#ef4444', icon: '🍽️', type: 'expense' },
  { name: 'Transportation', color: '#3b82f6', icon: '🚗', type: 'expense' },
  { name: 'Shopping', color: '#f59e0b', icon: '🛒', type: 'expense' },
  { name: 'Entertainment', color: '#8b5cf6', icon: '🎬', type: 'expense' },
  { name: 'Bills & Utilities', color: '#06b6d4', icon: '💡', type: 'expense' },
  { name: 'Health & Fitness', color: '#10b981', icon: '💊', type: 'expense' },
  { name: 'Travel', color: '#f97316', icon: '✈️', type: 'expense' },
  { name: 'Education', color: '#6366f1', icon: '📚', type: 'expense' },
  { name: 'Salary', color: '#22c55e', icon: '💰', type: 'income' },
  { name: 'Freelance', color: '#84cc16', icon: '💻', type: 'income' },
];

// @route   GET /api/categories
// @desc    Get all categories for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let categories = await Category.find({ user: req.user._id }).sort({ name: 1 });
    
    // If user has no categories, create default ones
    if (categories.length === 0) {
      const defaultCategoriesWithUser = defaultCategories.map(cat => ({
        ...cat,
        user: req.user._id,
        isDefault: true
      }));
      
      categories = await Category.insertMany(defaultCategoriesWithUser);
    }

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/categories
// @desc    Create new category
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const category = new Category({
      ...req.body,
      user: req.user._id
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;