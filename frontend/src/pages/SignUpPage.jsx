import { ArrowRight, Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AnimateFromBottom, AnimateFromTop } from "../components/Animate.jsx";
import Button from "../components/Button.jsx";
import FormRow from "../components/FormRow.jsx";
import Input from "../components/Input.jsx";
import { useAuthStore } from "../store/authStore.js";
import ButtonLink from "../components/ButtonLink.jsx";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter.jsx";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    await signup(formData, navigate);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AnimateFromTop>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Create your account
        </h2>
      </AnimateFromTop>

      <AnimateFromBottom>
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 sm:mx-auto sm:w-full sm:max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormRow label="Full Name" id="name">
              <Input
                icon={User}
                id="name"
                type="text"
                required
                value={formData.name}
                placeholder="John Doe"
                disabled={isLoading}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </FormRow>

            <FormRow label="Email address" id="email">
              <Input
                icon={Mail}
                id="email"
                type="email"
                required
                value={formData.email}
                disabled={isLoading}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
              />
            </FormRow>

            <FormRow label="Password" id="password">
              <Input
                icon={Lock}
                id="password"
                type="password"
                minLength={8}
                required
                value={formData.password}
                disabled={isLoading}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="*******"
              />
            </FormRow>
            {formData.password && (
              <PasswordStrengthMeter password={formData.password} />
            )}
            <FormRow label="Confirm Password" id="confirmPassword">
              <Input
                icon={Lock}
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                disabled={isLoading}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value
                  })
                }
                placeholder="*******"
              />
            </FormRow>

            <Button
              // className="w-full flex justify-center"
              size="fluid"
              options={{ animateScale: true }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="size-5 animate-spin" aria-hidden="true" />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="size-5" aria-hidden="true" />
                  Sign up
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?
            <ButtonLink
              type="simple"
              size="small"
              options={{ color: "emerald", iconStyle: "size-4" }}
              Icon={ArrowRight}
              to="/login"
            >
              Login here
            </ButtonLink>
          </p>
        </div>
      </AnimateFromBottom>
    </div>
  );
};
export default SignUpPage;
