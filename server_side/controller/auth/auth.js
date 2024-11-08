const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin, SuperAdmin, Instructor, Student } = require('../../models/schema/user');
const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} = require('../../configs/dotenv')

// Helper function to find user by email and role
const findUserByEmail = async (email) => {
  let user = await Admin.findOne({ email });
  if (user) return { user, role: 'admin' };

  user = await SuperAdmin.findOne({ email });
  if (user) return { user, role: 'superadmin' };

  user = await Instructor.findOne({ email });
  if (user) return { user, role: 'instructor' };

  user = await Student.findOne({ email });
  if (user) return { user, role: 'student' };

  return null;
};

// Create access token (short-lived)
const createAccessToken = (user) => {
  return jwt.sign(
    { userId: user.userId, email: user.email, role: user.role },
    JWT_ACCESS_SECRET,
    { expiresIn: '15m' } // Access token expires in 15 minutes
  );
};

// Create refresh token (long-lived)
const createRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.userId, email: user.email, role: user.role },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // Refresh token expires in 7 days
  );
};

// Login logic with access token and refresh token
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const userWithRole = await findUserByEmail(email);

    if (!userWithRole) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { user, role } = userWithRole;

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = createAccessToken({ userId: user.userId, email: user.email, role });
    const refreshToken = createRefreshToken({ userId: user.userId, email: user.email, role });

    // Set tokens in HTTP-only cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,    // Set to `true` in production (HTTPS)
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: 'Strict'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,    // Set to `true` in production (HTTPS)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'Strict'
    });

    // Send response with user info (without sending tokens in body)
    return res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user.userId,
        email: user.email,
        role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Refresh token endpoint
const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken; // Get refreshToken from cookie

  if (!token) return res.status(403).json({ message: 'Refresh token is missing' });

  try {
    // Verify refresh token
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    // Generate a new access token
    const accessToken = createAccessToken({ userId: decoded.userId, email: decoded.email, role: decoded.role });

    // Set the new access token in an HTTP-only cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,    // Set to `true` in production (HTTPS)
      maxAge: 15 * 60 * 1000, // 15 minutes
      sameSite: 'Strict'
    });

    return res.status(200).json({ message: 'Access token refreshed' });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// Logout logic (clears cookies)
const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Logout successful' });
};

module.exports = { login, refreshToken, logout };
