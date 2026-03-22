import { ShoppingCart } from "lucide-react";
import { AnimateFromBottom, AnimateFromTop } from "../components/Animate.jsx";
import { useCartStore } from "../store/useCartStore";

import ButtonLink from "../components/ButtonLink.jsx";
import CartItem from "../components/CartItem";
import OrderSummary from "../components/OrderSummary";
import GiftCouponCard from "../components/GiftCouponCard";
import PeopleAlsoBought from "../components/PeopleAlsoBought";

const CartPage = () => {
  const { cart } = useCartStore();

  return (
    <div className="py-8 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <AnimateFromTop className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            {cart.length === 0 ? (
              <EmptyCartUI />
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>
            )}

            {cart.length > 0 && <PeopleAlsoBought />}
          </AnimateFromTop>

          {cart.length > 0 && (
            <AnimateFromBottom className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
              <OrderSummary />
              <GiftCouponCard />
            </AnimateFromBottom>
          )}
        </div>
      </div>
    </div>
  );
};
export default CartPage;

const EmptyCartUI = () => (
  <AnimateFromBottom className="flex flex-col items-center justify-center space-y-4 py-16">
    <ShoppingCart className="h-24 w-24 text-gray-300" />
    <h3 className="text-2xl font-semibold ">Your cart is empty</h3>
    <p className="text-gray-400">
      Looks like you {"haven't"} added anything to your cart yet.
    </p>
    <ButtonLink to="/">Start Shopping</ButtonLink>
  </AnimateFromBottom>
);
