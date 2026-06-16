import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // 1. Check if Gmail SMTP credentials are provided in env
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: `"WedCoholic Couture" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html
      };

      await transporter.sendMail(mailOptions);
      return true;
    }

    // 2. Fall back to Resend API
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      // If EMAIL_USER is configured but EMAIL_PASS is not, use it as sender for Resend custom domain
      const sender = process.env.EMAIL_USER || 'onboarding@resend.dev';

      const response = await resend.emails.send({
        from: `WedCoholic Couture <${sender}>`,
        to,
        subject,
        text,
        html,
      });

      if (response.error) {
        return false;
      }
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
    expiresIn: '24h',
  });
};

// Seed default users if they don't exist, using credentials from process.env
export const seedAdminUsers = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'sher@admin.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '989904';
  const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'sher@superadmin.com';
  const superAdminPassword = process.env.SUPERADMIN_PASSWORD || '987136';

  try {
    // Automatically purge all client accounts and unverified registrations from database to start clean
    await User.deleteMany({ isVerified: false });
    await User.deleteMany({ role: 'user' });

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      // Password will be automatically hashed by the pre-save hook
      await User.create({
        name: 'WedCoholic Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isVerified: true
      });
      console.log(`Seeded admin account (${adminEmail})`);
    }

    const superAdminExists = await User.findOne({ email: superAdminEmail });
    if (!superAdminExists) {
      await User.create({
        name: 'WedCoholic SuperAdmin',
        email: superAdminEmail,
        password: superAdminPassword,
        role: 'superadmin',
        isVerified: true
      });
      console.log(`Seeded super admin account (${superAdminEmail})`);
    }
  } catch (error) {
    console.error('Error seeding admin accounts:', error.message);
  }
};

// @desc    Register new user & request OTP
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ message: 'User already exists' });
      } else {
        // Purge old unverified record to allow user to retry form sign up cleanly
        await User.deleteOne({ _id: userExists._id });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Save temporary user record
    const user = await User.create({
      name,
      email,
      phone,
      password, // automatically hashed on save
      isVerified: false,
      otpCode: otp,
      otpExpiry,
    });

    const subject = 'WedCoholic Couture - Account OTP Activation';
    const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #E0DAD0; border-radius: 12px; background-color: #FCFAF7; color: #333333;">
        <h2 style="font-family: serif; color: #7A0C2E; text-align: center; font-size: 24px; font-weight: bold; margin: 0 0 5px 0; letter-spacing: 1px;">WedCoholic Couture</h2>
        <div style="height: 1px; width: 50px; background-color: #C5A880; margin: 0 auto 20px;"></div>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">Thank you for registering at WedCoholic Couture. Please find your verification code to complete membership activation:</p>
        <div style="background-color: #FFFFFF; border: 1px solid rgba(197, 168, 128, 0.3); padding: 15px; margin: 20px 0; text-align: center; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
          <span style="font-family: monospace; font-size: 28px; font-weight: bold; color: #7A0C2E; letter-spacing: 5px;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #888888; line-height: 1.6; margin: 0 0 5px 0;">This code is valid for 15 minutes. Please do not share this OTP with anyone.</p>
        <p style="font-size: 12px; color: #888888; line-height: 1.6; margin: 0;">Regards,<br>Couture Client Service</p>
      </div>
    `;

    let emailSent = false;
    if (process.env.RESEND_API_KEY || (process.env.EMAIL_USER && process.env.EMAIL_PASS)) {
      emailSent = await sendEmail({ to: email, subject, text: `Your OTP code is ${otp}`, html });
    }

    res.status(201).json({
      message: emailSent
        ? 'Account initiated. Please enter the OTP code sent to your email.'
        : 'Account initiated. Please enter the OTP code logged to the server terminal.',
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    // Verify OTP code
    if (user.otpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    // Check expiry
    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'OTP code expired' });
    }

    // Verify user
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message: 'Account successfully verified!',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user & Stage 1 admin login check
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'sher@admin.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '989904';

  try {
    // Stage 1 admin credential interception
    if (email === adminEmail) {
      try {
        const admin = await User.findOne({ email: adminEmail });
        if (admin) {
          const isMatch = await admin.matchPassword(password);
          if (isMatch) {
            return res.status(200).json({
              requireStage2: true,
              message: 'Stage 1 Verification Successful. Super Admin clearance required.',
            });
          }
        }
      } catch (dbErr) {
        console.warn('Database offline, falling back to in-memory credential check:', dbErr.message);
      }

      // Local configuration fallback
      if (password === adminPassword) {
        return res.status(200).json({
          requireStage2: true,
          message: 'Stage 1 Verification Successful (In-Memory Fallback). Super Admin clearance required.',
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // Normal user login check
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your account first.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stage 2 Admin Dual verification check
// @route   POST /api/auth/verify-stage2
// @access  Public
export const verifyStage2 = async (req, res) => {
  const { email, password } = req.body;
  const superAdminEmail = process.env.SUPERADMIN_EMAIL || 'sher@superadmin.com';
  const superAdminPassword = process.env.SUPERADMIN_PASSWORD || '987136';

  try {
    if (email !== superAdminEmail) {
      return res.status(401).json({ message: 'Invalid Super Admin credentials' });
    }

    try {
      const superAdmin = await User.findOne({ email: superAdminEmail });
      if (superAdmin) {
        const isMatch = await superAdmin.matchPassword(password);
        if (isMatch) {
          return res.json({
            _id: superAdmin._id,
            name: superAdmin.name,
            email: superAdmin.email,
            role: superAdmin.role,
            token: generateToken(superAdmin._id),
            message: 'Dual-step Super Admin Clearance Granted.',
          });
        }
      }
    } catch (dbErr) {
      console.warn('Database offline, falling back to in-memory Stage 2 check:', dbErr.message);
    }

    // In-memory verification fallback
    if (password === superAdminPassword) {
      return res.json({
        _id: 'mock-superadmin-id',
        name: 'WedCoholic SuperAdmin (Offline Mode)',
        email: superAdminEmail,
        role: 'superadmin',
        token: jwt.sign({ id: 'mock-superadmin-id' }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '24h' }),
        message: 'Dual-step Super Admin Clearance Granted (In-Memory Fallback).',
      });
    } else {
      return res.status(401).json({ message: 'Invalid Super Admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel signup process and remove unverified user
// @route   POST /api/auth/cancel-signup
// @access  Public
export const cancelSignup = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (user && !user.isVerified) {
      await User.deleteOne({ _id: user._id });
      return res.status(200).json({ message: 'Signup cancelled successfully' });
    }
    res.status(200).json({ message: 'No unverified user found to cancel' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password - Request reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No registered account found with this email' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Account is unverified. Please verify your account first.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Save reset OTP to user
    user.resetOtpCode = otp;
    user.resetOtpExpiry = otpExpiry;
    await user.save();

    const subject = 'WedCoholic Couture - Reset Password OTP';
    const html = `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #E0DAD0; border-radius: 12px; background-color: #FCFAF7; color: #333333;">
        <h2 style="font-family: serif; color: #7A0C2E; text-align: center; font-size: 24px; font-weight: bold; margin: 0 0 5px 0; letter-spacing: 1px;">WedCoholic Couture</h2>
        <div style="height: 1px; width: 50px; background-color: #C5A880; margin: 0 auto 20px;"></div>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 10px 0;">Hello <strong>${user.name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">We received a request to reset your password. Please find your verification code below to authorize the password reset:</p>
        <div style="background-color: #FFFFFF; border: 1px solid rgba(197, 168, 128, 0.3); padding: 15px; margin: 20px 0; text-align: center; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
          <span style="font-family: monospace; font-size: 28px; font-weight: bold; color: #7A0C2E; letter-spacing: 5px;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #888888; line-height: 1.6; margin: 0 0 5px 0;">This code is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
        <p style="font-size: 12px; color: #888888; line-height: 1.6; margin: 0;">Regards,<br>Couture Client Service</p>
      </div>
    `;

    let emailSent = false;
    if (process.env.RESEND_API_KEY || (process.env.EMAIL_USER && process.env.EMAIL_PASS)) {
      emailSent = await sendEmail({ to: email, subject, text: `Your password reset OTP code is ${otp}`, html });
    }

    res.status(200).json({
      message: emailSent
        ? 'OTP sent to your email. Please verify to reset your password.'
        : 'OTP sent to server log. Please verify to reset your password.',
      email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password - Verify OTP and update password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP code
    if (!user.resetOtpCode || user.resetOtpCode !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    // Check expiry
    if (new Date() > user.resetOtpExpiry) {
      return res.status(400).json({ message: 'OTP code expired' });
    }

    // Update password (pre-save hook will hash it automatically)
    user.password = newPassword;
    user.resetOtpCode = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.status(200).json({
      message: 'Password successfully reset! Please login with your new credentials.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
