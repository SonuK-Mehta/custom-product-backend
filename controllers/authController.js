import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Signup Controller
export const register = async (req, res) => {
  try {
    const { name, email, password, address, phoneNumber } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      const message =
        existingUser.email === email
          ? "User already exists"
          : "Phone number already in use";
      return res.status(400).json({ message });
    }

    const user = await User.create({
      name,
      email,
      password,
      address,
      phoneNumber,
    });
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log(`Singup Error: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password)))
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(`Login Error: ${error}`);
    res.status(500).json({ message: "Server error" });
  }
};
