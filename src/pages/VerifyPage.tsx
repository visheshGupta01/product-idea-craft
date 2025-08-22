// src/pages/VerifyPage.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Define types for response data
interface VerifyResponse {
  success: boolean;
  message: string;
}

const VerifyPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      // Extract token from query params
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("token");

      if (!token) {
        setMessage("Invalid verification link.");
        setLoading(false);
        return;
      }

      try {
        // Call your Go backend
        const response = await axios.get<VerifyResponse>(
          `http://localhost:8000/verify?token=${token}`
        );

        if (response.data.success) {
          setSuccess(true);
          setMessage(response.data.message || "Email verified successfully!");
          // Auto-redirect after 2 seconds
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setSuccess(false);
          setMessage(response.data.message || "Verification failed.");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const res = error.response?.data as VerifyResponse | undefined;
          setMessage(res?.message || "An error occurred during verification.");
        } else {
          setMessage("An unknown error occurred.");
        }
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [location, navigate]);

  return (
    <div>
      <h2>Email Verification</h2>
      {loading ? (
        <p>Verifying your email...</p>
      ) : success ? (
        <div>
          <p>✅ {message}</p>
          <p>Redirecting to login...</p>
        </div>
      ) : (
        <div>
          <p>❌ {message}</p>
        </div>
      )}
    </div>
  );
};



export default VerifyPage;