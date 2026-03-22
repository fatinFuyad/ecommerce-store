import Product from "../models/Product.js";

/**
 * finds the specific products from the collection. then maps through the user cartItems and finds matching product with id.
 * then returns the product adding quantity of the item from the user cartItems
 */
export const getCartProducts = async (req, res) => {
  try {
    const productIds = req.user.cartItems.map((item) => item.product);

    const products = await Product.find({
      _id: { $in: productIds }
    });

    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.product.toString() === product._id.toString() // product in cartItems holds an id
      );
      return { ...product._doc, quantity: item.quantity };
    });

    res.status(200).json({
      status: "success",
      cartItems
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Server error", error: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const { user } = req;
    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({ product: productId, quantity: 1 }); // we need to add quantity since default quantity is not set
    }

    await user.save();
    res.status(200).json({
      status: "success",
      cartItems: user.cartItems
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { user } = req;
    if (productId) {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== productId
      );
    }
    await user.save();

    res.status(200).json({ status: "success", cartItems: user.cartItems });
  } catch (error) {
    res.status(500).json({ status: "fail", message: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { user } = req;
    user.cartItems = [];
    await user.save();
    res.status(200).json({ status: "success", cartItems: [] });
  } catch (error) {
    res
      .status(500)
      .json({ status: "fail", message: "Server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const { user } = req;
    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId
    );

    if (!existingItem)
      throw new Error(`Product not found with id: ${productId}`);

    if (quantity === 0) {
      user.cartItems = user.cartItems.filter(
        (item) => item.product.toString() !== productId
      );
      await user.save();
    } else {
      existingItem.quantity = quantity;
      await user.save();
    }

    res.status(200).json({
      status: "success",
      cartItems: user.cartItems
    });
  } catch (error) {
    res
      .status(404)
      .json({ status: "fail", message: "Server error", error: error.message });
  }
};
