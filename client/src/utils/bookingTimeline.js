const formatStepTime = (value) =>
  value ? new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : null;

export const buildBookingTimeline = (booking = {}) => {
  const status = booking.status;

  if (status === "DECLINED") {
    return [
      { key: "requested", label: "Request sent", state: "done", at: booking.created_at },
      { key: "declined", label: "Declined by owner", state: "done", at: booking.updated_at },
    ].map((s) => ({ ...s, timeLabel: formatStepTime(s.at) }));
  }

  if (status === "CANCELLED") {
    return [
      { key: "requested", label: "Request sent", state: "done", at: booking.created_at },
      { key: "cancelled", label: "Cancelled", state: "done", at: booking.updated_at },
    ].map((s) => ({ ...s, timeLabel: formatStepTime(s.at) }));
  }

  const stepDefs = [
    {
      key: "requested",
      label: "Request sent",
      done: true,
      at: booking.created_at,
      detail: null,
    },
    {
      key: "approved",
      label: "Approved",
      done: Boolean(
        booking.approved_at ||
          ["AWAITING_PAYMENT", "APPROVED", "PAID", "ACTIVE", "COMPLETED"].includes(status)
      ),
      at: booking.approved_at,
      detail: booking.payment_due_at
        ? `Pay by ${formatStepTime(booking.payment_due_at)}`
        : "Awaiting renter payment",
    },
    {
      key: "paid",
      label: "Payment confirmed",
      done: Boolean(booking.paid_at || ["PAID", "ACTIVE", "COMPLETED"].includes(status)),
      at: booking.paid_at,
      detail: booking.latest_transaction?.mpesa_receipt_number
        ? `Receipt ${booking.latest_transaction.mpesa_receipt_number}`
        : null,
    },
    {
      key: "pickup",
      label: "Pickup / rental started",
      done: Boolean(booking.activated_at || ["ACTIVE", "COMPLETED"].includes(status)),
      at: booking.activated_at,
      detail:
        booking.pickup_mileage != null
          ? `Odometer ${Number(booking.pickup_mileage).toLocaleString()} km`
          : "Owner handover checklist",
    },
    {
      key: "return",
      label: "Trip completed",
      done: status === "COMPLETED",
      at: booking.completed_at,
      detail:
        booking.return_mileage != null
          ? `Return ${Number(booking.return_mileage).toLocaleString()} km`
          : "Return checklist & payout",
    },
  ];

  let foundCurrent = false;
  return stepDefs.map((step) => {
    let state = "upcoming";
    if (step.done) {
      state = "done";
    } else if (!foundCurrent) {
      state = "current";
      foundCurrent = true;
    }
    return {
      key: step.key,
      label: step.label,
      state,
      at: step.at,
      detail: step.detail,
      timeLabel: formatStepTime(step.at),
    };
  });
};

export const computeOwnerEarnings = (bookings = []) => {
  let totalEarned = 0;
  let pendingPayout = 0;
  let activeTrips = 0;
  let completedTrips = 0;
  let currency = "KES";

  bookings.forEach((booking) => {
    currency = booking.currency || currency;
    const payout = Number(booking.owner_payout) || 0;
    const txn = booking.latest_transaction;

    if (booking.status === "COMPLETED") {
      completedTrips += 1;
      if (txn?.owner_payout_status === "RELEASED") {
        totalEarned += payout;
      } else if (txn?.status === "COMPLETED") {
        pendingPayout += payout;
      }
    } else if (["PAID", "ACTIVE"].includes(booking.status)) {
      activeTrips += 1;
      pendingPayout += payout;
    }
  });

  return { currency, totalEarned, pendingPayout, activeTrips, completedTrips };
};
