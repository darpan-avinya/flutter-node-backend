const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      default: 'Flutter Dev'
    },
    avatar: {
      type: String,
      default: ''
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true // createdAt અને updatedAt ઓટોમેટિક ઉમેરશે
  }
);

module.exports = mongoose.model('User', userSchema);