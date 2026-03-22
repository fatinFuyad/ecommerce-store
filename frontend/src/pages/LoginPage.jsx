import { ArrowRight, Loader, LogIn, Mail } from "lucide-react";
import { useState } from "react";
import { AnimateFromBottom, AnimateFromTop } from "../components/Animate.jsx";
import Button from "../components/Button.jsx";
import ButtonLink from "../components/ButtonLink.jsx";
import FormRow from "../components/FormRow.jsx";
import Input from "../components/Input.jsx";
import { useAuthStore } from "../store/authStore.js";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password }, navigate);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AnimateFromTop>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Login Now
        </h2>
      </AnimateFromTop>

      <AnimateFromBottom>
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormRow label="Email Address" id="email">
              <Input
                icon={Mail}
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </FormRow>
            <FormRow label="Password" id="password">
              <Input
                icon={Mail}
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </FormRow>
            <div className="flex gap-1 text-gray-400">
              <p>
                Forgot your password?
                <ButtonLink
                  type="simple"
                  size="small"
                  options={{ color: "emerald", iconStyle: "size-4" }}
                  Icon={ArrowRight}
                  to="/forgot-password"
                >
                  Reset
                </ButtonLink>
              </p>
            </div>
            <Button
              type="submit"
              size="fluid"
              options={{ animateScale: true }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="size-5 animate-spin" aria-hidden="true" />
                  Loading...
                </>
              ) : (
                <>
                  <LogIn className="size-5" aria-hidden="true" />
                  Login
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Not a member?
            <ButtonLink
              type="simple"
              size="small"
              options={{ color: "emerald", iconStyle: "size-4" }}
              Icon={ArrowRight}
              to="/signup"
            >
              Sign up now
            </ButtonLink>
          </p>
        </div>
      </AnimateFromBottom>
    </div>
  );
};
export default LoginPage;
