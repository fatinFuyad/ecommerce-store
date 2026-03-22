import { stripe } from "../lib/stripe.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once"
  });
  return coupon.id;
}

async function createNewCoupon(userId) {
  await Coupon.findOneAndDelete({ userId }); // we need to delete the coupon of the user when creating a new one to prevent a coupon containg duplicate userId;

  const couponCode = `GIFT_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const newCoupon = await Coupon.create({
    code: couponCode,
    discountPercentage: 10,
    expirationDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // valid for 30 days of creation
    userId
  });

  return newCoupon;
}

export const createCheckoutSession = async (req, res) => {
  try {
    // TAKE PRODUCT PRICE FROM THE SERVER
    const { cartItems, couponCode } = req.body;
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid or empty products in your cart"
      });
    }

    const productIds = cartItems.map((item) => item._id);
    const getItemQuantity = function (product) {
      return cartItems.find((item) => item._id === product._id.toString())
        .quantity;
    };

    const products = await Product.find({ _id: { $in: productIds } });
    let totalAmount = 0;
    const lineItems = products.map((product) => {
      // const amount = Math.round(product.price * 100);
      totalAmount += product.price * getItemQuantity(product);

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image]
          },
          unit_amount: product.price * 100 // stripe calculates cents of the amount
        },
        quantity: getItemQuantity(product)
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true
      });
      if (!coupon) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid coupon provided"
        });
      }
      totalAmount -= Math.round(
        (totalAmount * coupon.discountPercentage) / 100
      );
    }

    const redirectURL =
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173"
        : process.env.CLIENT_URL;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: `${redirectURL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${redirectURL}/purchase-cancel`,
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],

      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((product) => ({
            id: product._id.toString(),
            price: product.price,
            quantity: getItemQuantity(product)
          }))
        )
      }
    });

    if (totalAmount >= 200) {
      // if total amount is greater or $200 then give a gift coupon to that user;
      await createNewCoupon(req.user._id);
    }

    res.status(200).json({
      status: "success",
      sessionId: session.id,
      session,
      totalAmount
    });
  } catch (error) {
    console.error("Error processing checkout:", error.message);
    res.status(500).json({
      status: "fail",
      message: "Error processing checkout",
      error: error.message
    });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId
          },
          { isActive: false }
        );
      }
    }

    // create an order
    const products = JSON.parse(session.metadata.products);
    const newOrder = await Order.create({
      user: session.metadata.userId,
      products: products.map((product) => ({
        // using map to change property name id to product. since orderSchema expects product as id
        product: product.id,
        price: product.price,
        quantity: product.quantity
      })),
      totalAmount: session.amount_total / 100, // converting cents to dollars
      stripeSessionId: sessionId
    });

    res.status(201).json({
      status: "success",
      message:
        "Payment successful, order created, and coupon deactivated if used.",
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message:
        error.code === 11000
          ? "Your checkout was already successfull"
          : "Error processing successful checkout",
      error: error.message
    });
  }
};
