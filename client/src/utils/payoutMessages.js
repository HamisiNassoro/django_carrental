export const isMockPayout = (payout = {}) => {
  if (payout?.provider === "MOCK") return true;
  const receipt = payout?.receipt || payout?.owner_payout_mpesa_receipt || "";
  return String(receipt).startsWith("MOCKB2C");
};

export const getPayoutStatusLabel = (transaction = {}) => {
  if (transaction?.owner_payout_status !== "RELEASED") return null;

  const receipt = transaction?.owner_payout_mpesa_receipt;
  if (isMockPayout({ receipt })) {
    return receipt
      ? `recorded in dev mode (${receipt})`
      : "recorded in dev mode";
  }

  return receipt ? `sent (${receipt})` : "sent";
};

export const getCompleteTripToast = (payout) => {
  if (!payout) {
    return { type: "success", message: "Trip completed." };
  }

  if (payout.status === "failed") {
    return {
      type: "warning",
      message: `Trip completed, but payout failed: ${
        payout.message || "try again later"
      }`,
    };
  }

  if (payout.status === "released_manual") {
    return {
      type: "warning",
      message:
        payout.message ||
        "Trip completed. Owner payout phone missing — settle manually.",
    };
  }

  if (payout.status === "already_released") {
    return {
      type: "success",
      message: payout.receipt
        ? `Trip completed. Payout was already sent (${payout.receipt}).`
        : "Trip completed. Payout was already sent.",
    };
  }

  if (payout.status === "released" || payout.receipt) {
    if (isMockPayout(payout)) {
      const ref = payout.receipt ? ` Reference: ${payout.receipt}.` : "";
      return {
        type: "success",
        message: `Trip completed. Your payout was recorded in dev mode (no real M-Pesa transfer).${ref}`,
      };
    }

    return {
      type: "success",
      message: payout.receipt
        ? `Trip completed. Payout sent to your M-Pesa. Receipt: ${payout.receipt}.`
        : "Trip completed. Payout sent to your M-Pesa.",
    };
  }

  return { type: "success", message: "Trip completed." };
};
