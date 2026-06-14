import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    designer: {
      type: String,
      required: true,
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL'],
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    celebrityCloset: {
      type: Boolean,
      default: false,
    },
    occasions: {
      type: [String],
      default: [],
    },
    discount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1.0,
      max: 5.0,
    }
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
