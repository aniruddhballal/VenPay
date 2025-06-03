import mongoose from 'mongoose';

const productRatingSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductRequest',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index on productRequestId + companyId
productRatingSchema.index({ productRequestId: 1, companyId: 1 }, { unique: true });

// Additional indexes for query performance
productRatingSchema.index({ productId: 1 });
productRatingSchema.index({ companyId: 1 });

export default mongoose.model('ProductRating', productRatingSchema);