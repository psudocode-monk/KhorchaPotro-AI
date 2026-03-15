import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Food', 'Travel', 'Rent', 'Shopping', 'Health', 'Entertainment', 'Education', 'Other'],
      default: 'Other',
    },
    paymentMode: {
      type: String,
      required: [true, 'Please select a payment mode'],
      enum: ['Cash', 'UPI', 'Card', 'Net Banking', 'Other'],
      default: 'Cash',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [100, 'Note cannot be more than 100 characters'],
    },
  },
  { timestamps: true }
);

ExpenseSchema.index({ userId: 1, date: -1 });

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);

export default Expense;
