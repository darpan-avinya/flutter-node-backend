const User = require('../models/userModel');

// 1. Get All Users from DB
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // DB માંથી બધા યુઝર્સ લાવો
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// 2. Get Single User by MongoDB ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // DB માંથી યુઝર લાવો

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid ID format or server error",
      error: error.message
    });
  }
};

// 3. Create New User in MongoDB
const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const newUser = await User.create({ name, email, role });
    res.status(201).json({
      success: true,
      message: 'User created successfully in Database',
      data: newUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
};

// 4. Delete User by ID (Optional)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid ID format or server error",
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser
};