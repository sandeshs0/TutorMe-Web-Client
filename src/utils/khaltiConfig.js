const khaltiConfig = {
  //   publicKey: process.env.KHALTI_PUBLIC_KEY,
  publicKey: "8c527add932941339ae20d9658212044",
  productIdentity: "student_wallet_load",
  productName: "Wallet Load",
  productUrl: window.location.href, // Replace with the appropriate URL

  eventHandler: {
    onSuccess(payload) {
      // Call the verify transaction endpoint
      console.log("Payment Success:", payload);
    },
    onError(error) {
      console.error("Payment Error:", error);
    },
    onClose() {
      console.log("Payment widget closed.");
    },
  },
};

export default khaltiConfig;
