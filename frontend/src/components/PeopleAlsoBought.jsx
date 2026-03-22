import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { useCartStore } from "../store/useCartStore.js";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { cart } = useCartStore();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        let categories = [];
        let productIds = [];
        cart.forEach((item) => {
          // const isExistId = productIds.includes(item._id) // cart can hold one product but with multiple in quanities
          productIds.push(item._id);
          const isExist = categories.includes(item.category);
          if (!isExist) {
            categories.push(item.category);
          }
        });
        const res = await axios.post("/products/recommendations", {
          categories,
          productIds
        });
        setRecommendations(res.data.products);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3">
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
export default PeopleAlsoBought;
