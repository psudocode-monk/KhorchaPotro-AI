import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema(
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
    source: {
      type: String,
      required: [true, 'Please select a source'],
      enum: ['Salary', 'Freelance', 'Business', 'Investments', 'Gift', 'Other'],
      default: 'Salary',
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

IncomeSchema.index({ userId: 1, date: -1 });

const Income = mongoose.models.Income || mongoose.model('Income', IncomeSchema);

export default Income;
