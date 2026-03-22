import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import ButtonLink from "../components/ButtonLink.jsx";
import axios from "../lib/axios";
import { useCartStore } from "../store/useCartStore";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [order, setOrder] = useState({});
  const { clearCart } = useCartStore();
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        const response = await axios.post("/payments/checkout-success", {
          sessionId
        });
        clearCart();
        setOrder(response.data.order);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setIsProcessing(false);
      }
    };

    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      setIsProcessing(false);
      setError("No session ID found in the URL");
    }
  }, [clearCart, searchParams]);

  if (isProcessing)
    return (
      <h1 className="text-xl font-bold text-center text-emerald-400">
        Checkout Processing...
      </h1>
    );

  if (error)
    return (
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-red-400">
        Error: {error}
      </h1>
    );

  return (
    <div className="h-screen overflow-x-hidden flex items-center justify-center px-4">
      <Confetti
        className="w-full"
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={500}
        recycle={false}
      />

      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <CheckCircle className="text-emerald-400 w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2">
            Purchase Successful!
          </h1>

          <p className="text-gray-300 text-center mb-2">
            Thank you for your order. {"We're"} processing it now.
          </p>
          <p className="text-emerald-400 text-center text-sm mb-6">
            Check your email for order details and updates.
          </p>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Order ID:</span>
              <span className="text-sm font-semibold text-emerald-400">
                {order._id}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Estimated delivery</span>
              <span className="text-sm font-semibold text-emerald-400">
                3-5 business days
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Button className="w-full flex items-center justify-center">
              <HandHeart className="mr-2" size={18} />
              Thanks for trusting us!
            </Button>
            <ButtonLink to={"/"} className="w-full" Icon={ArrowRight}>
              Continue Shopping
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PurchaseSuccessPage;
