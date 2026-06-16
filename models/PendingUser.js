import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    otpCode: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const PendingUser = mongoose.model('PendingUser', pendingUserSchema);
export default PendingUser;
