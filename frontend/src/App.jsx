import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/authStore.js";
import { useCartStore } from "./store/useCartStore.js";

// const LoginPage = lazy(() => import("./pages/LoginPage"));
// const SignUpPage = lazy(() => import("./pages/SignUpPage"));
// const EmailVerificationPage = lazy(
//   () => import("./pages/EmailVerificationPage.jsx")
// );
// const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage.jsx"));
// const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage.jsx"));
// const CategoryPage = lazy(() => import("./pages/CategoryPage"));
// const HomePage = lazy(() => import("./pages/HomePage"));

const Account = lazy(() => import("./pages/Account.jsx"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

const CartPage = lazy(() => import("./pages/CartPage"));
const PurchaseCancelPage = lazy(() => import("./pages/PurchaseCancelPage"));
const PurchaseSuccessPage = lazy(() => import("./pages/PurchaseSuccessPage"));

// const HomePage = lazy(() => import("./pages/HomePage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));

const EmailVerificationPage = lazy(
  () => import("./pages/EmailVerificationPage.jsx")
);
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage.jsx"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));

import HomePage from "./pages/HomePage";
// import CategoryPage from "./pages/CategoryPage";
// import EmailVerificationPage from "./pages/EmailVerificationPage.jsx";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
// import LoginPage from "./pages/LoginPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
// import SignUpPage from "./pages/SignUpPage";

// Protect routes that requires authentication
function ProtectedRoute() {
  const { user, isAuthenticated } = useAuthStore();

  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !user.isVerified) {
    return <Navigate to="/verify-email" />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Outlet />
    </Suspense>
  );
}

// Redirect authenticated & verified user to the homepage
function RedirectAuthenticatedUser({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user?.isVerified) {
    return <Navigate to="/" replace />;
  }
  // if (user && !user.isVerified) {
  //   return <Navigate to="/verify-email" />;
  // }

  return children;
}

function App() {
  const { user, verifyAuth, isVerifyingAuth } = useAuthStore();
  const navigate = useNavigate();
  const { getCartItems } = useCartStore();

  useEffect(() => {
    verifyAuth().catch(() => navigate("/login"));
  }, [verifyAuth]);

  useEffect(() => {
    if (!user) return;
    getCartItems();
  }, [getCartItems, user]);

  if (isVerifyingAuth) return <LoadingSpinner />;
  return (
    <div id="app" className="min-h-screen bg-gray-900 text-white relative">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]" />
        </div>
      </div>

      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" index element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/category/:category"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <CategoryPage />
              </Suspense>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/secret-dashboard" element={<AdminPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
            <Route path="/purchase-cancel" element={<PurchaseCancelPage />} />
            <Route path="/profile/:field" element={<Account />} />
          </Route>

          <Route
            path="/signup"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <SignUpPage />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <Suspense fallback={<LoadingSpinner />}>
                  <LoginPage />
                </Suspense>
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <Suspense fallback={<LoadingSpinner />}>
                  <ForgotPasswordPage />
                </Suspense>
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/reset-password/:resetToken"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <ResetPasswordPage />
              </Suspense>
            }
          />
          <Route
            path="/verify-email"
            element={
              <RedirectAuthenticatedUser>
                <Suspense fallback={<LoadingSpinner />}>
                  <EmailVerificationPage />
                </Suspense>
              </RedirectAuthenticatedUser>
            }
          />
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </div>
      <Toaster
        toastOptions={{
          // Define default options
          duration: 7000,
          removeDelay: 1000,
          style: {
            background: "#363636",
            color: "#fff"
          },

          // Default options for specific types
          success: {
            style: {
              background: "#15803d"
            },
            duration: 4000,
            iconTheme: {
              primary: "#06c14b"
            }
          },
          error: {
            style: {
              background: "#b91c1c"
            }
          }
        }}
      />
    </div>
  );
}

export default App;

/**
 
vite v5.4.21 building for production...
✓ 2821 modules transformed.
dist/index.html                   0.47 kB │ gzip:   0.30 kB
dist/assets/index-otaPnt1x.css   33.50 kB │ gzip:   6.76 kB
dist/assets/index-DZUnZWZM.js   796.89 kB │ gzip: 238.48 kB

dist/assets/PurchaseSuccessPage-LkVTh9CN.js      9.83 kB │ gzip:   3.87 kB
dist/assets/CartPage-qZp3NAyL.js                10.15 kB │ gzip:   3.59 kB
dist/assets/proxy-DNr5rtpX.js                  111.52 kB │ gzip:  36.65 kB
dist/assets/index-DkIvsAKj.js                  235.53 kB │ gzip:  79.70 kB
dist/assets/AdminPage-Cf3nMsrQ.js              399.01 kB │ gzip: 109.88 kB
 */
