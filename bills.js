import express from 'express';
import Bill from '../models/Bill.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/bills
// @desc    Get all bills for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    
    let query = { user: req.user._id };
    
    if (status === 'paid') {
      query.isPaid = true;
    } else if (status === 'unpaid') {
      query.isPaid = false;
    }
    
    if (upcoming === 'true') {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // Next 30 days
      query.dueDate = { $lte: futureDate };
      query.isPaid = false;
    }

    const bills = await Bill.find(query).sort({ dueDate: 1 });

    res.json({
      success: true,
      bills
    });
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/bills
// @desc    Create new bill
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const bill = new Bill({
      ...req.body,
      user: req.user._id
    });

    await bill.save();

    res.status(201).json({
      success: true,
      message: 'Bill created successfully',
      bill
    });
  } catch (error) {
    console.error('Create bill error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   PUT /api/bills/:id
// @desc    Update bill
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const bill = await Bill.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      message: 'Bill updated successfully',
      bill
    });
  } catch (error) {
    console.error('Update bill error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   PUT /api/bills/:id/pay
// @desc    Mark bill as paid
// @access  Private
router.put('/:id/pay', auth, async (req, res) => {
  try {
    const bill = await Bill.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { 
        isPaid: true, 
        paidDate: new Date() 
      },
      { new: true }
    );

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      message: 'Bill marked as paid',
      bill
    });
  } catch (error) {
    console.error('Pay bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/bills/:id
// @desc    Delete bill
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const bill = await Bill.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    res.json({
      success: true,
      message: 'Bill deleted successfully'
    });
  } catch (error) {
    console.error('Delete bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;