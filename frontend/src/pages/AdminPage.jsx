import { AnimateFromTop } from "../components/Animate.jsx";
import { useProductStore } from "../store/useProductStore";
import { BarChart, PlusCircle, ShoppingBasket } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

import LoadingSpinner from "../components/LoadingSpinner.jsx";
const AnalyticsTab = lazy(() => import("../components/AnalyticsTab"));
const CreateProductForm = lazy(() => import("../components/CreateProductForm"));
const ProductsList = lazy(() => import("../components/ProductsList"));

const tabs = [
  { id: "create", label: "Create Product", icon: PlusCircle },
  { id: "products", label: "Products", icon: ShoppingBasket },
  { id: "analytics", label: "Analytics", icon: BarChart }
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative container mx-auto px-4 py-16">
        <AnimateFromTop>
          <h1 className="text-4xl font-bold mb-8 text-emerald-400 text-center">
            Admin Dashboard
          </h1>
        </AnimateFromTop>

        <div className="flex justify-center mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
        <Suspense fallback={<LoadingSpinner />}>
          {activeTab === "create" && <CreateProductForm />}
          {activeTab === "products" && <ProductsList />}
          {activeTab === "analytics" && <AnalyticsTab />}
        </Suspense>
      </div>
    </div>
  );
};
export default AdminPage;
