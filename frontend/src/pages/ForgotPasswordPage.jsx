import { motion } from "framer-motion";
import { useState } from "react";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import toast from "react-hot-toast";
import { AnimateFromBottom, AnimateFromTop } from "../components/Animate.jsx";
import Button from "../components/Button.jsx";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { forgotPassword, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AnimateFromTop>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Forgot Password ??
        </h2>
      </AnimateFromTop>

      <AnimateFromBottom>
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-gray-300 mb-6 text-center">
                Enter your email address and w&apos;ll send you a link to reset
                your password.
              </p>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                size="fluid"
                type="submit"
                disabled={isLoading}
                options={{ animateScale: true }}
              >
                {isLoading ? (
                  <>
                    <Loader className="size-5 animate-spin" />
                    Sending Reset Link
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Mail className="h-8 w-8 text-white" />
              </motion.div>
              <p className="text-gray-300 mb-6">
                If an account exists for {email}, you will receive a password
                reset link shortly.
              </p>
            </div>
          )}
        </div>
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          <Link
            to={"/login"}
            className="text-sm text-green-400 hover:underline flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
          </Link>
        </div>
      </AnimateFromBottom>
    </div>
  );
}

export default ForgotPasswordPage;
