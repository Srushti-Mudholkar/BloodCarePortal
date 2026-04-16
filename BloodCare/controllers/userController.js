import Users from "../models/userModel.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/emailService.js";

// UPDATE PROFILE
export const updateProfileController = async (req, res) => {
  try {
    const { name, organisationName, hospitalName, phone, address, website } = req.body;

    const user = await Users.findByIdAndUpdate(
      req.body.userId,
      { name, organisationName, hospitalName, phone, address, website },
      { new: true, runValidators: false }
    ).select("-password");

    return res.status(200).send({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error updating profile", error: error.message });
  }
};

// CHANGE PASSWORD (logged in user)
export const changePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await Users.findById(req.body.userId);
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).send({ success: false, message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).send({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error changing password", error: error.message });
  }
};

// FORGOT PASSWORD — send reset email
export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.status(200).send({ success: true, message: "If this email exists, a reset link has been sent." });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const name = user.name || user.organisationName || user.hospitalName;
    await sendPasswordResetEmail({ email: user.email, name, resetToken });

    return res.status(200).send({ success: true, message: "Password reset link sent to your email." });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error sending reset email", error: error.message });
  }
};

// RESET PASSWORD — with token from email
export const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await Users.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({ success: false, message: "Invalid or expired reset token" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).send({ success: true, message: "Password reset successfully. Please login." });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error resetting password", error: error.message });
  }
};
