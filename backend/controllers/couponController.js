import Coupon from "../models/Coupon.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true
    });
    // if (!coupon) throw new Error("No active coupon found");
    res.status(200).json({ status: "success", coupon });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
      coupon: null
    });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code,
      userId: req.user._id,
      isActive: true
    });
    if (!coupon) throw new Error("You provided an invalid coupon!");

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      throw new Error("Invalid coupon code or it's been expired!");
    }

    res.status(200).json({
      status: "success",
      message: "valid coupon",
      coupon
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
      coupon: null
    });
  }
};
