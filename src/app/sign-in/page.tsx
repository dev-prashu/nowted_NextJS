"use client";
import AuthForm from '@/components/form/AuthForm';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type UserData = {
  email: string;
  password: string;
};

type ApiError = {
  error?: string;
  message?: string;
};

function SignIn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (userData: UserData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post("/api/auth/login", userData);
      console.log("Login response:", response.data);
      router.push("/folders");
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      console.error("Login error:", error.response?.data);
      setError(
        error.response?.data?.error || 
        error.response?.data?.message || 
        error.message || 
        "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm 
      type="sign-in" 
      onSubmit={handleSignIn} 
      isLoading={isLoading}
      error={error || undefined}
    />
  );
}

export default SignIn;