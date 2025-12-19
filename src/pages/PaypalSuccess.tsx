import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const PaypalSuccess = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      window.location.href = "/payment-failed";
      return;
    }

    // Call backend success API
    window.location.href = `/api/paypal/success?token=${token}`;
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Processing your payment...</h2>
      <p>Please wait, do not refresh the page.</p>
    </div>
  );
};

export default PaypalSuccess;
