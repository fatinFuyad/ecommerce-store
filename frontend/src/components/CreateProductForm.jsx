import { useState } from "react";

import { Loader, PlusCircle, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import { useProductStore } from "../store/useProductStore";
import { AnimateFromBottom } from "./Animate.jsx";

const categories = [
  "electronics",
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags"
];

function CreateProductForm({ product = {}, setShowForm }) {
  const { _id, ...productData } = product;
  const isEditSession = Boolean(_id);

  const [newProduct, setNewProduct] = useState(() => {
    return isEditSession
      ? productData
      : {
          name: "",
          description: "",
          price: "",
          category: "",
          image: ""
        };
  });

  const { createProduct, updateProduct, isLoading } = useProductStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isEditSession) {
      await createProduct(newProduct);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        image: ""
      });
      return;
    }

    const updates = {};
    Object.entries(newProduct).forEach(([key, value]) => {
      const isSame = value === productData[key];
      if (!isSame) updates[key] = value;
      if (newProduct.image) updates.oldImage = product.image;
    });
    await updateProduct(_id, updates);
    setShowForm(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isLarge = file.size > 1024 * 1024 * 5;
    if (isLarge)
      return toast.error(
        "Product image size is too large. Allowed image size < 5MB"
      );
    const reader = new FileReader();
    reader.readAsDataURL(file); // base64

    reader.onloadend = () => {
      setNewProduct({ ...newProduct, image: reader.result });
    };
  };

  return (
    <AnimateFromBottom
      id="create-update-form-container"
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6 text-emerald-300">
        Create New Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={newProduct.name}
            disabled={isLoading}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-300"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={newProduct.description}
            disabled={isLoading}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            rows="3"
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-300"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={newProduct.price}
            disabled={isLoading}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            // step='1'
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={newProduct.category}
            disabled={isLoading}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-1 gap-4 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            disabled={isLoading}
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            <Upload className="h-5 w-5 inline-block mr-2" />
            Upload Image
          </label>
          {newProduct.image && (
            <div className="relative w-fit h-fit">
              <button
                type="button"
                className="absolute top-0 right-0 border-none bg-red-500"
                onClick={() => setNewProduct({ ...newProduct, image: "" })}
              >
                <X className="" />
              </button>
              <img
                src={
                  newProduct.image ||
                  URL.createObjectURL(document.getElementById("image").files[0])
                }
                alt="product image"
                className="w-32"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader
                className="mr-2 h-5 w-5 animate-spin"
                aria-hidden="true"
              />
              {!isEditSession ? "Creating Product" : "Editing Product"}
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-5 w-5" />
              {!isEditSession ? "Create Product" : "Edit Product"}
            </>
          )}
        </button>
      </form>
    </AnimateFromBottom>
  );
}

export default CreateProductForm;
