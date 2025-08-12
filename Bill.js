import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Bill name is required'],
    trim: true,
    maxlength: [100, 'Bill name cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  dueDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  recurring: {
    type: String,
    enum: ['none', 'weekly', 'monthly', 'yearly'],
    default: 'none'
  },
  reminderDays: {
    type: Number,
    min: 1,
    max: 30,
    default: 3
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidDate: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  paymentMethod: {
    type: String,
    trim: true
  },
  vendor: {
    name: String,
    website: String,
    phone: String
  }
}, {
  timestamps: true
});

// Index for better query performance
billSchema.index({ user: 1, dueDate: 1 });
billSchema.index({ user: 1, isPaid: 1 });

export default mongoose.model('Bill', billSchema);