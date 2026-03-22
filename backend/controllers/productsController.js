import mongoose from "mongoose";
import { deleteImage, uploadImage } from "../lib/cloudinary.js";
import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      result: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.status(200).json({
      status: "success",
      product
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = req.body;

    const imageUrl = await uploadImage(product.image);
    const newProduct = await Product.create({
      ...product,
      image: imageUrl
    });
    res.status(201).json({
      status: "success",
      product: newProduct
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldImage, ...data } = req.body;
    if (oldImage) {
      await deleteImage(oldImage);
    }
    if (data.image) {
      data.image = await uploadImage(data.image);
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true
    });

    res.status(200).json({
      status: "success",
      product: updatedProduct
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { image } = await Product.findById(id).select("image");
    await deleteImage(image);
    await Product.findByIdAndDelete(id);

    res.status(204).json({
      status: "success",
      message: "Product has been deleted successfully",
      product: null
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.status(200).json({
      status: "success",
      products
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new Error("Product not found");

    product.isFeatured = !product.isFeatured;
    const updatedProduct = await product.save();
    res.status(203).json({
      status: "success",
      product: updatedProduct
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true });
    res.status(200).json({
      status: "success",
      products: featuredProducts
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
};

// Get recommended products for cart items
export const getRecommendedProducts = async (req, res) => {
  try {
    const { categories, productIds } = req.body;

    // Step 2: Fallback → Same category
    const recommendedProducts = await Product.find({
      category: { $in: categories },
      _id: { $nin: productIds }
    })
      .select("_id name description image price")
      .limit(4);

    res.json({
      status: "success",
      products: recommendedProducts
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
};

//////////////////
// Get recommended products while navigating a product page
/*
exports.getRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Step 1: Find frequently bought together products
    const orders = await Order.aggregate([
      {
        $match: {
          "items.product": new mongoose.Types.ObjectId(productId)
        }
      },
      { $unwind: "$items" },
      {
        $match: {
          "items.product": { $ne: new mongoose.Types.ObjectId(productId) }
        }
      },
      {
        $group: {
          _id: "$items.product",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    let recommendedProducts = [];

    if (orders.length > 0) {
      const productIds = orders.map(o => o._id);
      recommendedProducts = await Product.find({
        _id: { $in: productIds }
      });
    }

    // Step 2: Fallback → Same category
    if (recommendedProducts.length === 0) {
      recommendedProducts = await Product.find({
        category: product.category,
        _id: { $ne: product._id }
      }).limit(5);
    }

    res.json({
      success: true,
      recommendations: recommendedProducts
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 */
