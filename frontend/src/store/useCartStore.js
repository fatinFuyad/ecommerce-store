import { create } from "zustand";

import toast from "react-hot-toast";
import axios from "../lib/axios.js";

export const useCartStore = create((set, get) => ({
  cart: [],
  total: 0,
  subtotal: 0,
  coupon: null,
  isCouponApplied: false,

  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      set({ coupon: response.data.coupon });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data.coupon, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied for discount");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed from calculation");
  },

  getCartItems: async () => {
    try {
      const response = await axios.get("/cart");
      set({ cart: response.data.cartItems });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message);
    }
  },

  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });

      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );

        let newCart;
        if (existingItem) {
          newCart = prevState.cart.map((item) => {
            return item._id === existingItem._id
              ? { ...item, quantity: item.quantity + 1 }
              : item;
          });
        } else {
          product.quantity = 1;
          newCart = [...prevState.cart, product];
        }

        return { cart: newCart };
      });
      get().calculateTotals();
      toast.success("Proudct added to your cart", { id: "addToCart" });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart/${productId}`);
      set((prevState) => {
        const filteredCart = prevState.cart.filter(
          (item) => item._id !== productId
        );
        return { cart: filteredCart };
      });
      get().calculateTotals();
      toast.success("Product removed from your cart", { id: "removeFromCart" });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  clearCart: async () => {
    try {
      await axios.delete("/cart");
      set({
        cart: [],
        total: 0,
        subtotal: 0,
        coupon: null
      });
      toast.success("Your cart is cleared out");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      if (quantity === 0) {
        get().removeFromCart(productId);
        return;
      }
      await axios.patch(`/cart/${productId}`, { productId, quantity });
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === productId
        );
        if (existingItem) existingItem.quantity = quantity;
        return { cart: prevState.cart };
      });
      get().calculateTotals();
      toast.success("Product quantity has been updated", { id: "update" });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  calculateTotals: () => {
    const { cart, coupon, isCouponApplied } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;
    if (coupon && isCouponApplied) {
      total = subtotal - subtotal * (coupon.discountPercentage / 100);
    }
    set({ total, subtotal });
  }
}));
