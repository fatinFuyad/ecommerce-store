import bcryptjs from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { Email } from "../email/nodeMailer.config.js";
import { generateSetCookie } from "../utils/generateSetCookie.js";
import { uploadImage } from "../lib/cloudinary.js";

export const resendVerificationToken = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) throw new Error("You must provide your email");

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = await User.findOneAndUpdate(
      { email },
      {
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000 // 10 mins
      },
      {
        new: true
      }
    );
    if (!user) throw new Error("No user found with the email you provided!");
    await new Email(user).verifyEmail(verificationToken);

    res.status(200).json({
      status: "success",
      message: "A new verification token has been sent to your email address.",
      verificationToken
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    });
  }
};

export const signup = async function (req, res) {
  try {
    const { email, password, name } = req.body;
    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      throw new Error(
        "A user already exists with the provided email! Try using another."
      );
    }
    if (!email || !password || !name) {
      throw new Error("Please provide the required fields");
    }

    if (password.length < 8)
      throw new Error("Password should be atleast 8 characters long!");

    const hashedPassword = await bcryptjs.hash(password, 12);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 10 * 60 * 1000 // 10 mins
    });
    // await user.save({ validateBeforeSave: false });
    generateSetCookie(res, user._id); // creates auth token as cookie and attaches to response
    await new Email(user).verifyEmail(verificationToken);

    res.status(201).json({
      status: "success",
      message: "Sign up for your account has been successful",
      user: { ...user._doc, password: undefined },
      verificationToken
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
};

export const verifyEmail = async function (req, res) {
  try {
    const { code } = req.body;
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: {
        $gt: Date.now() // to check if the expiry date is in future
      }
    });

    if (!user) {
      throw new Error("Invalid token or it's been expired!");
    }

    // if a user is found then verify the user with isVerified:true & remove associated props
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();
    // await sendEmail({
    //   to: user.email,
    //   subject: "Thanks for joining with us",
    //   emailTemplate: WELCOME_EMAIL_TEMPLATE.replace("[USERNAME]", user.name),
    // });

    await new Email(user).sendWelcome();
    res.status(200).json({
      status: "success",
      message: "Your email has been verified successfully",
      user: { ...user._doc, password: undefined }
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
};

export const login = async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      throw new Error("Invalid email or password! Please try again later.");
    // if (!user.isVerified)
    // throw new Error(
    //   "Unverified Email! Please verify your email with the verification code"
    // );

    const isCorrectPassword = await bcryptjs.compare(password, user.password);
    if (!isCorrectPassword)
      throw new Error("Incorrect email or password! Please try again later.");

    user.lastLogin = new Date();
    await user.save();
    generateSetCookie(res, user._id);

    res.status(200).json({
      status: "success",
      message: "Logged into your account successfully.",
      user: { ...user._doc, password: undefined }
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message
    });
  }
};

export const logout = async function (req, res) {
  res.clearCookie("authToken");
  res.status(200).json({
    status: "success",
    message: "Logged out successfully."
  });
};

export const forgotPassword = async function (req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("No user found with the email address!");
    const resetToken = crypto.randomBytes(32).toString("hex");
    const encryptedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = encryptedToken;
    user.passwordResetTokenExpiresAt = Date.now() + 10 * 60 * 1000;
    await user.save();
    await new Email(user).passwordResetEmail(resetToken);

    res.status(200).json({
      status: "success",
      message: "Your password reset token has been sent to your email",
      resetToken
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message
    });
  }
};

export const resetPassword = async function (req, res) {
  const { resetToken } = req.params;
  const { password } = req.body;
  try {
    if (password.length < 8)
      throw new Error("Password must be at least 8 characters long!");
    const encryptedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: encryptedToken,
      passwordResetTokenExpiresAt: {
        $gt: Date.now()
      }
    });

    if (!user) throw new Error("Invalid reset token or it's been expired!");

    user.password = await bcryptjs.hash(password, 12);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiresAt = undefined;

    await user.save();

    await new Email(user).passwordResetSuccessEmail();
    res.status(200).json({
      status: "success",
      message: "You have successfully reset your password"
      // user: { ...user._doc, password: undefined }
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    if (!newPassword) throw new Error("Password is required");

    const user = await User.findById(req.user._id).select("password");

    const isCorrectPassword = await bcryptjs.compare(password, user.password);
    if (!isCorrectPassword) throw new Error("Incorrect password!");

    const hashedPassword = await bcryptjs.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "You have successfully updated your password",
      user
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message
    });
  }
};

export const protectRoute = async function (req, res, next) {
  try {
    const { authToken } = req.cookies;
    if (!authToken)
      throw new Error(
        "You are not logged in! Please log in and try again later."
      );

    const isValidToken = jwt.verify(authToken, process.env.JWT_SECRET);
    if (!isValidToken)
      throw new Error(
        "Unauthorized! Invalid auth token received from request."
      );

    const decodedToken = jwt.decode(authToken);

    // check if the auth token is valid
    const isExpiredToken = Date.now() > decodedToken.exp * 1000; // exp time is in seconds
    if (isExpiredToken)
      throw new Error(
        "You are not logged in! Please log in and try again later."
      );

    // check if user exists with the userId
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user)
      throw new Error(
        "Unauthorized! No user is associated with the auth token we got from the request"
      );

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message
    });
  }
};

export const adminRoute = (req, res, next) => {
  const isAdmin = req.user?.role === "admin";
  if (isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};

export const getProfile = (req, res) => {
  try {
    res.status(200).json({
      status: "success",
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, image } = req.body;
    const { user } = req;
    // image: 'data:image/png;base64,
    if (!name || !image) throw new Error("Input value is empty");
    if (name) user.name = name;
    if (image && image.startsWith("data:image")) {
      const imageURL = await uploadImage(image, "users");
      user.image = imageURL;
    }

    const updatedUser = await user.save(); // returns updated fields

    res.status(200).json({
      status: "success",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const verifyAuth = async function (req, res, next) {
  try {
    const { authToken } = req.cookies;
    if (!authToken)
      throw new Error(
        "You are not logged in! Please log in and try again later."
      );

    const isValidToken = jwt.verify(authToken, process.env.JWT_SECRET);
    if (!isValidToken)
      throw new Error(
        "Unauthorized! Invalid auth token received from request."
      );

    const decodedToken = jwt.decode(authToken);

    // check if the auth token is valid
    const isExpiredToken = Date.now() > decodedToken.exp * 1000; // exp time is in seconds
    if (isExpiredToken)
      throw new Error(
        "You are not logged in! Please log in and try again later."
      );

    // check if user exists with the userId
    const user = await User.findById(decodedToken.userId).select("-password");
    if (!user)
      throw new Error(
        "Unauthorized! No user is associated with the auth token we got from the request"
      );

    // ℹ️ in the frontend, we actually would need the user from the reponse; otherwise we got an error (404 Not found) as this route doesn't send a response. Also we need the user for authentication & verification in while Route redirections.
    req.user = user;
    res.status(200).json({ success: true, user });
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message
    });
  }
};
