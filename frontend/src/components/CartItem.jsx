import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../store/useCartStore";
import Button from "./Button.jsx";
import ButtonLink from "./ButtonLink.jsx";

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCartStore();
  // const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate();

  return (
    <div className="rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6">
      <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
        <div className="shrink-0 md:order-1">
          <img className="rounded w-20 h-auto" src={item.image} />
        </div>
        <label className="sr-only">Choose quantity:</label>

        <div className="flex items-center justify-between md:order-3 md:justify-end">
          <div className="flex items-center gap-3">
            <Button
              size="small"
              btnType="warning"
              Icon={Minus}
              onClick={() => updateQuantity(item._id, item.quantity - 1)}
            />
            <p>{item.quantity}</p>
            <Button
              size="small"
              btnType="primary"
              Icon={Plus}
              onClick={() => updateQuantity(item._id, item.quantity + 1)}
            />
          </div>

          <div className="text-end md:order-4 md:w-32">
            <p className="text-base font-bold text-emerald-400">
              ${item.price}
            </p>
          </div>
        </div>

        <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
          <ButtonLink
            type="simple"
            size="text"
            className="text-base font-medium"
            to={`/category/${item.category}?query=${item._id}`}
          >
            {item.name}
          </ButtonLink>
          <p className="text-sm text-gray-400">{item.description}</p>

          <div className="flex items-center gap-4">
            <Button
              btnType="danger"
              size="small"
              Icon={Trash}
              onClick={() => removeFromCart(item._id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartItem;
