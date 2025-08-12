import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  color: {
    type: String,
    required: true,
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color']
  },
  icon: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['expense', 'income', 'both'],
    default: 'expense'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  budget: {
    monthly: { type: Number, min: 0 },
    weekly: { type: Number, min: 0 },
    daily: { type: Number, min: 0 }
  }
}, {
  timestamps: true
});

// Ensure unique category names per user
categorySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);