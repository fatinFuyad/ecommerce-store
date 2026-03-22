import { loadStripe } from "@stripe/stripe-js";
import { Loader, MoveRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios.js";
import { useCartStore } from "../store/useCartStore";
import { AnimateFromRight } from "./Animate.jsx";
import Button from "./Button.jsx";
import ButtonLink from "./ButtonLink.jsx";

function OrderSummary() {
  const { cart, total, subtotal, coupon, isCouponApplied } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  async function handleCheckout() {
    try {
      setIsProcessing(true);
      const stripePromise = loadStripe(
        "pk_test_51T6uzuEWHO8oEN82TusaspGTF7Ov8033dvruL61SMyTTJtMFtbccb9zMudPLDTc1k7IT2NWIKlxcxEwgcxhnyA7l00zXPwDYEt"
      );

      const stripe = await stripePromise;
      const response = await axiosInstance.post(
        "/payments/create-checkout-session",
        { cartItems: cart, couponCode: coupon?.code || null }
      );
      const { session } = response.data;
      await stripe.redirectToCheckout({ sessionId: session.id });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <AnimateFromRight className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6">
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>

      <div className="space-y-4 flex flex-col justify-center">
        <div className="space-y-2">
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ${formattedSubtotal}
            </dd>
          </dl>

          {savings > 0 && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                -${formattedSavings}
              </dd>
            </dl>
          )}

          {coupon && isCouponApplied && (
            <dl className="flex items-center justify-between gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ${formattedTotal}
            </dd>
          </dl>
        </div>
        <Button
          className="inline-flex items-center justify-center gap-2"
          options={{ animateScale: true }}
          onClick={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader className="animate-spin" /> Processing...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </Button>
        <span className="mx-auto text-sm font-normal text-gray-400">or</span>
        <ButtonLink
          className="mx-auto -mt-40"
          to="/"
          Icon={MoveRight}
          type="simple"
        >
          Continue Shopping
        </ButtonLink>
      </div>
    </AnimateFromRight>
  );
}
export default OrderSummary;
