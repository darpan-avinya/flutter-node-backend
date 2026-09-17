const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  // Header માંથી 'Authorization: Bearer <token>' રીડ કરવો
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // "Bearer eyJhbGci..." માંથી ફક્ત ટોકન અલગ કરવો
      token = req.headers.authorization.split(' ')[1];

      // Token verify કરવો
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Token માંથી મળેલા userId દ્વારા database માંથી user નો ડેટા શોધવો (password વગર)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }

      // આગળના controller function પર જવા દેવું
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };