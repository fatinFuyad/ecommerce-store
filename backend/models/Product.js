import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      minlength: [2, "Product name should be at least 2 characters long"]
    },
    description: {
      type: String,
      required: true,
      maxlength: [
        1000,
        "Product description should not exeed over 1000 characters"
      ]
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      required: [true, "Product should have an image"]
    },
    category: {
      type: String,
      enum: [
        "electronics",
        "jeans",
        "t-shirts",
        "shoes",
        "glasses",
        "jackets",
        "suits",
        "bags"
      ],
      required: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// most of products are isFeatured: false, a normal index is wasteful.
productSchema.index(
  { isFeatured: 1 },
  { partialFilterExpression: { isFeatured: true } }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
