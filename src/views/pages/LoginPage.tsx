import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../store/auth.store";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Loader } from "../components/ui/Loader";
import { authService } from "../../services/auth.service";
import { useNavigate } from "react-router";
import type { LoginDTO } from "../../models/auth.types";

const LoginPage = () => {
  const [error, setError] = useState("");
  const { setUser, isAuthenticated, isCheckingAuth } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginDTO>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginDTO) => {
    try {
      setError("");
      const user = await authService.login(data);
      setUser(user);
      // Navigation will be handled by useEffect
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">SMS Login</h1>
          <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@school.com"
            {...register("email", { required: "Email is required" })}
            error={errors.email?.message}
          />
          
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password", { required: "Password is required" })}
            error={errors.password?.message}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
