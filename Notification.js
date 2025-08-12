import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['budget_alert', 'bill_reminder', 'spending_warning', 'achievement', 'info'],
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String,
    trim: true
  },
  metadata: {
    budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
    billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
    expenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
    amount: Number,
    category: String
  }
}, {
  timestamps: true
});

// Index for better query performance
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ user: 1, type: 1 });

export default mongoose.model('Notification', notificationSchema);