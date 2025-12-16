// src/pages/PaypalCancel.tsx
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PaypalCancel = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      window.location.href = `/api/paypal/cancel?token=${token}`;
    } else {
      window.location.href = "/payment-failed";
    }
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment cancelled</h2>
      <p>Redirecting...</p>
    </div>
  );
};

export default PaypalCancel;
