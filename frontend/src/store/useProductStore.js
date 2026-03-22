import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  featuredProducts: [],
  isLoading: false,

  setProducts: () => {},
  createProduct: async (newProduct) => {
    try {
      set({ isLoading: true });
      const response = await axios.post("/products", newProduct);
      set((prevState) => ({
        products: [...prevState.products, response.data.product],
        isLoading: false
      }));
      toast.success("New product created successfully");
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message);
    }
  },

  updateProduct: async (productId, updateData) => {
    try {
      set({ isLoading: true });
      const response = await axios.patch(
        `/products/update/${productId}`,
        updateData
      );
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === productId ? response.data.product : product
        ),
        isLoading: false
      }));
      toast.success("Product updated successfully");
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message);
    }
  },

  fetchProduct: async (productId) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/products/${productId}`);
      set({ products: response.data.product, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message);
    }
  },
  fetchAllProducts: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get("/products");
      set({ products: response.data.products, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message);
    }
  },

  fetchProductsByCategory: async (category) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message);
    }
  },

  deleteProduct: async (productId) => {
    try {
      set({ isLoading: true });
      await axios.delete(`/products/${productId}`);
      set((prevState) => {
        const filteredProducts = prevState.products.filter(
          (product) => product._id !== productId
        );
        return {
          products: filteredProducts,
          isLoading: false
        };
      });
      toast.success("Product deleted successfully");
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message);
    }
  },

  toggleFeaturedProduct: async (productId) => {
    try {
      set({ isLoading: true });
      await axios.patch(`/products/${productId}`);
      set((prevState) => {
        const selectedProduct = prevState.products.find(
          (product) => product._id === productId
        );
        selectedProduct.isFeatured = !selectedProduct.isFeatured;
        return {
          products: prevState.products,
          isLoading: false
        };
      });
      toast.success("Product feature state updated");
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message);
    }
  },

  fetchFeaturedProducts: async () => {
    try {
      set({ isLoading: true });
      const response = await axios.get("/products/featuredProducts");
      set({
        featuredProducts: response.data.products,
        isLoading: false
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message);
    }
  }
}));
