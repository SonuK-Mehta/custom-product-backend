import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
      minLength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: (value) =>
          validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          }),
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and symbols",
      },
    },
    address: [
      {
        line1: { type: String, required: [true, "Address line is required"] },
        line2: { type: String }, // Optional (e.g., apartment number)
        city: { type: String, required: [true, "City is required"] },
        state: { type: String, required: [true, "State is required"] },
        zip: { type: String, required: [true, "ZIP code is required"] },
        country: {
          type: String,
          default: "India", // Sets default country if not provided
        },
        isDefault: { type: Boolean, default: false }, // Marks primary address
      },
    ],
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: (value) => validator.isMobilePhone(value, "any"),
        message: "Invalid phone number",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("user", userSchema);

export default User;
