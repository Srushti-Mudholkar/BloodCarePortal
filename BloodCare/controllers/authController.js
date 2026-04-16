import Users from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// REGISTER
export const registerController = async (req, res) => {
  try {
    const { role, name, organisationName, hospitalName, email, password, address, phone, bloodGroup, website } = req.body;

    // Check existing user
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new Users({
      role,
      name,
      organisationName,
      hospitalName,
      email,
      password: hashedPassword,
      address,
      phone,
      // only set bloodGroup if it has a real value (donors only)
      ...(bloodGroup && bloodGroup !== "" && { bloodGroup }),
      website,
    });

    await user.save();

    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: {
        _id: user._id,
        role: user.role,
        name: user.name,
        organisationName: user.organisationName,
        hospitalName: user.hospitalName,
        email: user.email,
        address: user.address,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Register API",
      error: error.message,
    });
  }
};

// LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).send({
        success: false,
        message: "Email, password and role are required",
      });
    }

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== role) {
      return res.status(403).send({
        success: false,
        message: `Role mismatch. This account is registered as ${user.role}`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).send({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        role: user.role,
        name: user.name,
        organisationName: user.organisationName,
        hospitalName: user.hospitalName,
        email: user.email,
        address: user.address,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
      error: error.message,
    });
  }
};

// GET CURRENT USER
export const currentUserController = async (req, res) => {
  try {
    const user = await Users.findById(req.body.userId).select("-password");
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }
    return res.status(200).send({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Unable to get current user",
      error: error.message,
    });
  }
};
