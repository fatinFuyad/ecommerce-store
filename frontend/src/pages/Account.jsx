import {
  BadgeDollarSign,
  Loader,
  Lock,
  Mail,
  Settings,
  Star,
  Upload,
  X
} from "lucide-react";
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { AnimateFromBottom, AnimateFromTop } from "../components/Animate.jsx";
import { useAuthStore } from "../store/authStore.js";

import toast from "react-hot-toast";
import Button from "../components/Button.jsx";
import FormRow from "../components/FormRow.jsx";
import Input from "../components/Input.jsx";

function Account() {
  const { updateProfile, updatePassword, isLoading, user, logout } =
    useAuthStore();
  const { field } = useParams();
  const [preview, setPreview] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image);

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    await updateProfile({ name, image });
    setPreview(null);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    setIsUpdatingPassword(true);
    await updatePassword({ password, newPassword });
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsUpdatingPassword(false);
  };

  return (
    <div className="grid grid-cols-3 w-4/5 m-auto">
      <aside className="col-span-1 max-h-[500px] flex flex-col gap-3 px-8 py-6  border-r-2 border-r-green-800">
        <NavLink
          className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 text-white ${field === "settings" && " bg-emerald-800"}`}
          to="/profile/settings"
        >
          <Settings className="mr-2 h-5 w-5" />
          Settings
        </NavLink>
        <NavLink
          className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 text-white ${field === "orders" && " bg-emerald-800"}`}
          to="/profile/orders"
        >
          <BadgeDollarSign className="mr-2 h-5 w-5" />
          Orders
        </NavLink>
        <NavLink
          className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 text-white ${field === "reviews" && " bg-emerald-800"}`}
          to="/profile/reviews"
        >
          <Star className="mr-2 h-5 w-5" />
          Reviews
        </NavLink>
        <Button
          options={{ color: "gray", animateScale: true }}
          className="mt-auto self-start w-full "
          onClick={() => logout()}
        >
          Log out
        </Button>
      </aside>
      <div
        className="col-span-2 max-h-[500px] overflow-auto top-0  py-12 sm:px-6 lg:px-8"
        style={{
          scrollbarWidth: "thin"
        }}
      >
        <AnimateFromTop>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
            Your Account
          </h2>
        </AnimateFromTop>

        <AnimateFromBottom>
          <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg mt-8 sm:px-10 sm:mx-auto sm:w-full">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
              Update Profile
            </h2>
            <form className="space-y-6" onSubmit={handleUpdateProfile}>
              <FormRow label={"Full Name"} id="name">
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  // defaultValue={user.name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </FormRow>

              <FormRow label={"Email Address"} id="email">
                <Input
                  icon={Mail}
                  id="email"
                  type="email"
                  required
                  placeholder="johndoe@example.com"
                  value={user.email}
                  disabled
                />
              </FormRow>

              <div className="flex items-end gap-6">
                <img
                  className="w-20 aspect-square rounded-full border-green-500 border-2"
                  accept="image/png, image/jpg, image/jpeg"
                  src={`${preview || image || "/user-default.jpg"}`}
                  alt="image"
                  loading="lazy"
                />

                {preview ? (
                  <button
                    className="flex items-center gap-2 text-red-500 whitespace-nowrap"
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      setPreview(null);
                    }}
                  >
                    <X className="h-5 w-5" aria-hidden="true" /> Cancel Upload
                  </button>
                ) : (
                  <label
                    className="flex items-center gap-2 mt-2 text-gray-300 whitespace-nowrap hover:text-emerald-500 hover:first:text-emerald-500 "
                    htmlFor="image"
                  >
                    <Upload className="h-5 w-5" aria-hidden="true" />
                    Upload image
                  </label>
                )}
                <input
                  className="h-0"
                  type="file"
                  name="image"
                  accept="image/*"
                  id="image"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file.type.startsWith("image")) return;
                    setPreview(URL.createObjectURL(file));
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = async () => {
                      const base64Image = reader.result;
                      setImage(base64Image);
                    };
                  }}
                />
              </div>
              <Button
                options={{ animateScale: true }}
                className="flex justify-center"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader
                      className="mr-2 h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Updating Profile
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </div>
          <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg mt-8 sm:px-10 sm:mx-auto sm:w-full">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-emerald-400">
              Update Password
            </h2>
            <form className="space-y-6" onSubmit={handleUpdatePassword}>
              <FormRow label={"Current Password"} id="currentPassword">
                <Input
                  icon={Lock}
                  id="currentPassword"
                  type="password"
                  required
                  placeholder="********"
                  disabled={isUpdatingPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormRow>
              <FormRow label={"New Password"} id="newPassword">
                <Input
                  icon={Lock}
                  id="newPassword"
                  type="password"
                  required
                  placeholder="********"
                  disabled={isUpdatingPassword}
                  value={newPassword}
                  minLength={8}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </FormRow>
              <FormRow label={"Confirm Password"} id="confirmPassword">
                <Input
                  icon={Lock}
                  id="confirmPassword"
                  type="password"
                  placeholder="********"
                  required
                  disabled={isUpdatingPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormRow>

              <Button
                className="flex justify-center"
                type="submit"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader
                      className="mr-2 h-5 w-5 animate-spin"
                      aria-hidden="true"
                    />
                    Updating Password
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </div>
        </AnimateFromBottom>
      </div>
    </div>
  );
}

export default Account;
