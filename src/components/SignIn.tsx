import React, { useState, useEffect } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { loginUser, clearError } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // Navigation will be handled by the useEffect above
    } catch (error) {
      // Error is already handled by the slice
      console.error("Login failed:", error);
    }
  };

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const leftContent = (
    <div className="text-center text-white px-4 md:px-8">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
        Hello Friend!
      </h1>
      <p className="text-lg md:text-xl mb-8 md:mb-12 opacity-90 leading-relaxed">
        Enter your personal details and
        <br className="hidden sm:block" />
        start your journey with us
      </p>
      <button
        onClick={() => navigate("/signup")}
        className="border-2 border-white text-white px-8 md:px-12 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300 transform hover:scale-105"
      >
        SIGN UP
      </button>
    </div>
  );

  const rightContent = (
    <div className="w-full">
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-amber-500 mb-2">
          Sign In to
        </h2>
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          Your Account
        </h3>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <form onSubmit={handleSignIn} className="space-y-4 md:space-y-6">
        <div className="relative">
          <Mail className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-gray-50 border-0 rounded-lg text-base md:text-lg placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all duration-200"
            required
            disabled={isLoading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-gray-50 border-0 rounded-lg text-base md:text-lg placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all duration-200"
            required
            disabled={isLoading}
          />
        </div>

        <div className="text-center">
          <a
            href="#"
            className="text-gray-600 hover:text-amber-500 transition-colors underline text-sm md:text-base"
          >
            forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-amber-500 text-white py-3 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? "Signing In..." : "SIGN IN"}
        </button>
      </form>
    </div>
  );

  return <AuthLayout leftContent={leftContent} rightContent={rightContent} />;
};

export default SignIn;
