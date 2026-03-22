import { Lock, LogIn, ShoppingCart, UserPlus } from "lucide-react";
import { useAuthStore } from "../store/authStore.js";
import { useCartStore } from "../store/useCartStore";
import ButtonLink from "./ButtonLink.jsx";

const Navbar = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <ButtonLink
            type="simple"
            className="text-2xl font-bold"
            options={{ color: "emerald" }}
            to="/"
          >
            E-Commerce
          </ButtonLink>

          <nav className="flex flex-wrap items-center gap-2 *:text-lg">
            <ButtonLink type="simple" size="small" to="/">
              Home
            </ButtonLink>
            {user && (
              <ButtonLink
                type="simple"
                className="relative"
                size="small"
                to={"/cart"}
              >
                <ShoppingCart className="inline-block mr-1 group-hover:text-emerald-400" />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span
                    className="absolute left-4 top-0 bg-emerald-500 text-white rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
                  >
                    {cart.length}
                  </span>
                )}
              </ButtonLink>
            )}
            {isAdmin && (
              <ButtonLink
                size="small"
                Icon={Lock}
                options={{ iconSize: 15 }}
                to={"/secret-dashboard"}
              >
                <span className="hidden sm:inline">Dashboard</span>
              </ButtonLink>
            )}

            {user ? (
              <ButtonLink
                type="simple"
                className="inline-flex gap-2 items-center"
                to={"/profile/settings"}
              >
                <img
                  src={user.image}
                  alt="user image"
                  loading="lazy"
                  className="w-9 aspect-square bg- rounded-full border-2 border-green-700"
                />
                {user.name.split(" ")[0]}
              </ButtonLink>
            ) : (
              <>
                <ButtonLink className="mx-2" Icon={UserPlus} to={"/signup"}>
                  {/* <UserPlus className="mr-2" size={18} /> */}
                  Sign Up
                </ButtonLink>
                <ButtonLink
                  to={"/login"}
                  type="secondary"
                  className="inline-flex items-center gap-2"
                >
                  <LogIn size={18} />
                  Login
                </ButtonLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
