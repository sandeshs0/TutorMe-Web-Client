import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { confirmWalletTransaction } from "../services/api";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasRun = useRef(false); 

  useEffect(() => {
    const handlePaymentVerification = async () => {
      if (hasRun.current) return; 
      hasRun.current = true;

      const pidx = searchParams.get("pidx");
      const status = searchParams.get("status");
      const trans_ID = localStorage.getItem("transactionID");
      console.log(
        "Inside payment call back, search paran:",
        searchParams,
        "pidx:",
        pidx,
        "status:",
        status,
        "transaction id:",
        trans_ID
      );

      if (status === "Completed" && pidx) {
        try {
          const response = await confirmWalletTransaction(pidx, trans_ID);
          if (response.success) {
            toast.success("Payment verified and wallet updated!");
          } else {
            toast.error("Payment verification failed.");
          }
        } catch (error) {
          console.error("Error verifying transaction:", error.message);
          toast.error("Failed to verify payment.");
        }
      } else if (status === "User canceled") {
        toast.error("Payment was canceled by the user.");
      } else {
        toast.error("Payment failed or incomplete.");
      }

      navigate("/account-center"); 
    };

    handlePaymentVerification();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Processing your payment...</p>
    </div>
  );
};

export default PaymentCallback;
