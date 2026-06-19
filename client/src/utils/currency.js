const CURRENCY_LOCALES = {
  KES: "en-KE",
  USD: "en-US",
  GBP: "en-GB",
  CAD: "en-CA",
  AUD: "en-AU",
};

export const formatMoney = (amount, currency = "KES") => {
  const value = Number(amount) || 0;
  const code = currency || "KES";
  const locale = CURRENCY_LOCALES[code] || "en-KE";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `KSh ${value.toLocaleString()}`;
  }
};

export const formatDailyRate = (amount, currency = "KES") =>
  `${formatMoney(amount, currency)}/day`;

export const bookingStatusLabel = {
  PENDING: "Pending approval",
  AWAITING_PAYMENT: "Awaiting payment",
  PAID: "Paid",
  ACTIVE: "Active rental",
  COMPLETED: "Completed",
  APPROVED: "Awaiting payment",
  DECLINED: "Declined",
  CANCELLED: "Cancelled",
};

export const bookingStatusVariant = {
  PENDING: "warning",
  AWAITING_PAYMENT: "info",
  PAID: "success",
  ACTIVE: "primary",
  COMPLETED: "secondary",
  APPROVED: "info",
  DECLINED: "danger",
  CANCELLED: "secondary",
};
