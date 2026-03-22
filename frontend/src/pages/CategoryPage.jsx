import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  AnimateFromBottom,
  AnimateTextFromTop
} from "../components/Animate.jsx";
import ProductCard from "../components/ProductCard";
import { useProductStore } from "../store/useProductStore";

const CategoryPage = () => {
  const { fetchProductsByCategory, products } = useProductStore();
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const filteredProducts = !searchParams.get("query")
    ? products
    : products.filter((item) => item._id === searchParams.get("query"));

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [fetchProductsByCategory, category]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimateTextFromTop className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-8">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </AnimateTextFromTop>

        <AnimateFromBottom className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {products?.length === 0 && (
            <h2 className="text-3xl font-semibold text-gray-300 text-center col-span-full">
              No products found
            </h2>
          )}

          {filteredProducts?.map((product) => {
            return <ProductCard key={product._id} product={product} />;
          })}
        </AnimateFromBottom>
      </div>
    </div>
  );
};
export default CategoryPage;
