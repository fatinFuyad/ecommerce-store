import { useEffect, useState } from "react";
import Button from "../components/Button.jsx";
import { useCartStore } from "../store/useCartStore";
import { AnimateFromRight } from "./Animate.jsx";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, getMyCoupon, isCouponApplied, applyCoupon, removeCoupon } =
    useCartStore();

  useEffect(() => {
    getMyCoupon();
  }, [getMyCoupon]);

  // useEffect(() => {
  //   if (coupon) setUserInputCode(coupon.code);
  // }, [coupon]);

  const handleApplyCoupon = () => {
    if (!userInputCode) return;
    applyCoupon(userInputCode.trim());
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
  };

  return (
    <AnimateFromRight className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="voucher"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Do you have a voucher or gift card?
          </label>
          <input
            type="text"
            id="voucher"
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 
            p-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 disabled:text-gray-300 "
            placeholder="Enter code here"
            disabled={isCouponApplied}
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            required
          />
        </div>

        <Button
          type="button"
          size="fluid"
          className="font-medium"
          onClick={handleApplyCoupon}
          disabled={isCouponApplied}
        >
          Apply Code
        </Button>
      </div>
      {isCouponApplied && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Applied Coupon</h3>

          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>

          <Button
            btnType="danger"
            type="button"
            size="fluid"
            className="font-medium mt-2"
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </Button>
        </div>
      )}

      {coupon && !isCouponApplied && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">
            Your Available Coupon:
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
        </div>
      )}
    </AnimateFromRight>
  );
};
export default GiftCouponCard;
