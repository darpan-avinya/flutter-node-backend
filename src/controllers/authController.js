const crypto = require('crypto');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Token Generate કરવાનું Helper Function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d' // 30 દિવસ સુધી ટોકન વેલિડ રહેશે
  });
};

// 1. User Register (Sign Up)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Password Hash કરવો (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. User Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // પાસવર્ડ મેચ કરવો
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get Current User Profile (Private Route)
const getMyProfile = async (req, res) => {
  // protect middleware એ req.user સેટ કરી દીધો છે
  res.status(200).json({
    success: true,
    data: req.user
  });
};

// 4. Upload Profile Picture
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }

    // Database માં ઇમેજનો પાથ સેવ કરવો
    const filePath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: filePath },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl: `${req.protocol}://${req.get('host')}${filePath}`,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Forgot Password - Generate Reset Token
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // 20 bytes નો રેન્ડમ હેક્સ ટોકન જનરેટ કરવો
    const resetToken = crypto.randomBytes(20).toString('hex');

    // DB માં સેવ કરવા માટે ટોકનને SHA256 થી હેશ કરવો (સિક્યોરિટી માટે)
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 10 મિનિટની એક્સપાયરી સેટ કરવી
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // સામાન્ય રીતે આ લિંક ઈમેલ થાય, અત્યારે ટેસ્ટિંગ માટે JSON માં પાસ કરીએ છીએ
    res.status(200).json({
      success: true,
      message: 'Reset token generated successfully',
      resetToken: resetToken // યુઝર આ ટોકન પાસવર્ડ બદલવા માટે વાપરશે
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Reset Password - Verify Token & Update Password
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Please provide a new password' });
    }

    // URL માંથી મળેલા ટોકનનું હેશ બનાવીને DB સાથે સરખાવવું
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // ટોકન મેચ થાય અને સમય 10 મિનિટથી ઓછો હોય તેવો યુઝર શોધવો
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    // નવો પાસવર્ડ હેશ કરવો
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // ટોકન અને એક્સપાયરી ખાલી કરી દેવા
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with the new password.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// module.exports માં બંને ફંક્શન્સ એડ કરી દો:
module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  uploadAvatar,
  forgotPassword,
  resetPassword
};
