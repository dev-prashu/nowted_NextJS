"use client";
import AuthForm from "@/components/form/AuthForm";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UserData = {
  name?: string;
  email: string;
  password: string;
};

type ApiError = {
  error?: string;
  message?: string;
};

function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (userData: UserData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/api/auth/register", userData);
      console.log("Registration response:", response.data);
      router.push("/sign-in");
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      console.error("Registration error:", error.response?.data);
      setError(error.response?.data?.error || error.response?.data?.message || error.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      type="sign-up"
      onSubmit={handleSignUp}
      isLoading={isLoading}
      error={error || undefined}
    />
  );
}

export default SignUp;