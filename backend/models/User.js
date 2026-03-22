import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "User must provide a valid email"],
      unique: true
    },
    password: {
      type: String,
      required: [true, "User must set a string password"],
      minlength: [8, "Password must be at least 8 characters"]
    },
    name: {
      type: String,
      required: [true, "User must provide user's name"]
    },
    image: {
      type: String,
      default: "/user-default.jpg"
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        quantity: {
          type: Number,
          default: 1
        }
      }
    ],
    role: {
      type: String,
      enum: ["customer", "admin", "moderator"],
      default: "customer"
    },
    lastLogin: {
      type: Date,
      default: Date.now()
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    passwordResetToken: { type: String },
    passwordResetTokenExpiresAt: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date }
  },
  {
    timestamps: true // The timestamps option tells mongoose to assign createdAt and updatedAt fields to your schema.
  }
);

// userSchema.pre("/^find/", (req, res, next) => {});

const User = mongoose.model("User", userSchema);
export default User;
