"use client";

import { FadeIn, ScaleIn } from "@/components/ui/animations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Passwords do not match";
      setError(errorMsg);
      toast.error("Validation Error", { description: errorMsg });
      return;
    }

    if (formData.password.length < 6) {
      const errorMsg = "Password must be at least 6 characters";
      setError(errorMsg);
      toast.error("Validation Error", { description: errorMsg });
      return;
    }

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }).unwrap();
      dispatch(setCredentials(result.data));
      toast.success("Welcome to VocabPrep!", {
        description: "Your account has been created successfully.",
      });
      router.push("/");
    } catch (err) {
      const error = err as { data?: { message?: string } };
      const errorMessage =
        error?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error("Registration Failed", {
        description: errorMessage,
      });
    }
  };

  const handleGoogleSignup = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <FadeIn>
        <Card className="w-full max-w-md p-8 border-2">
          <ScaleIn>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Create Account
              </h1>
              <p className="text-muted-foreground">
                Start your English learning journey today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="glass-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="glass-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="glass-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  className="glass-input"
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200"
              onClick={handleGoogleSignup}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                />
              </svg>
              Sign up with Google
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Login here
              </Link>
            </p>
          </ScaleIn>
        </Card>
      </FadeIn>
    </div>
  );
}
