import { motion } from "framer-motion";
import { Edit, EllipsisVertical, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import CreateProductForm from "../components/CreateProductForm";
import { useProductStore } from "../store/useProductStore";

const ProductsList = () => {
  const { isLoading, toggleFeaturedProduct, products } = useProductStore();
  const [openId, setOpenId] = useState(null);
  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <table className=" min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Category
            </th>

            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Featured
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {products.map((product, i) => (
            <tr
              key={product._id}
              className={`hover:bg-gray-700 translate-x-${i + 1}`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-white">
                      {product.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">
                  ${product.price.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  disabled={isLoading}
                  onClick={() => toggleFeaturedProduct(product._id)}
                  className={`p-1 rounded-full ${
                    product.isFeatured
                      ? "bg-yellow-400 text-gray-900"
                      : "bg-gray-600 text-gray-300"
                  } hover:bg-yellow-500 transition-colors duration-200`}
                >
                  <Star className="h-5 w-5" />
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <ContextMenu
                  product={product}
                  openId={openId}
                  setOpenId={setOpenId}
                />
                {/* <button
                    disabled={isLoading}
                    onClick={() => deleteProduct(product._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash
                      className={`h-5 w-5 ${isLoading && "animate-pulse"}`}
                    />
                  </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};
export default ProductsList;

export function ContextMenu({ product, openId, setOpenId }) {
  const { deleteProduct, isLoading } = useProductStore();
  const [showForm, setShowForm] = useState(false);

  return (
    <div id="product-context-menu" className="relative">
      <button
        type="button"
        className="text-orange-400 hover:bg-gray-600 bg-gray-700 p-1 rounded-full"
        onClick={() => {
          setOpenId(() => {
            return !openId || openId !== product._id ? product._id : null;
          });
        }}
      >
        <EllipsisVertical />
      </button>
      {openId === product._id && (
        <div className="absolute left-10 top-2 flex flex-col gap-3 bg-gray-800 text-gray-300 p-3 rounded-sm">
          <button
            disabled={isLoading}
            onClick={() => {
              setShowForm((show) => !show);
              setOpenId((open) => !open);
            }}
            className="text-yellow-500 flex gap-1 hover:text-yellow-300"
          >
            <Edit className={`h-5 w-5 ${isLoading && "animate-pulse"}`} />
            Edit
          </button>

          <button
            disabled={isLoading}
            onClick={async () => {
              const isDelete = confirm(
                "Are you sure, you want to delete the product?"
              );
              isDelete && (await deleteProduct(product._id));
              setOpenId(false);
            }}
            className="text-red-500 flex gap-1 hover:text-red-300"
          >
            <Trash2 className={`h-5 w-5 ${isLoading && "animate-pulse"}`} />
            Delete
          </button>
        </div>
      )}
      {showForm &&
        createPortal(
          <div
            className="absolute z-50 backdrop-blur-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full overflow-y-scroll"
            style={{ scrollbarWidth: "none" }}
            onClick={(e) => {
              const isFormEl = e.target.closest(
                "#create-update-form-container"
              );
              if (!isFormEl) {
                setShowForm((open) => !open);
              }
            }}
          >
            <div className="mt-24 mb-24">
              <CreateProductForm product={product} setShowForm={setShowForm} />
            </div>
          </div>,
          document.getElementById("app")
        )}
    </div>
  );
}
