import { Lock } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { AnimateFromBottom, AnimateFromTop } from "../components/Animate.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore.js";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, isLoading } = useAuthStore();

  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password confirmation failed!");
      return;
    }
    try {
      await resetPassword({ password, resetToken }, navigate);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AnimateFromTop>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
          Reset Your Password
        </h2>
      </AnimateFromTop>

      <AnimateFromBottom>
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              icon={Lock}
              type="password"
              placeholder="New Password"
              value={password}
              required
              minLength={8}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />

            <Button
              options={{ animateScale: true }}
              type={"submit"}
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Set New Password"}
            </Button>
          </form>
        </div>
      </AnimateFromBottom>
    </div>
  );
}
export default ResetPasswordPage;
