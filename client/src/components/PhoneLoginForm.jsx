import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { loginWithPhone } from "../features/auth/authSlice";
import authService from "../features/auth/authService";

const PhoneLoginForm = ({ disabled = false }) => {
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpId, setOtpId] = useState(null);
  const [sending, setSending] = useState(false);

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast.error("Enter your phone number");
      return;
    }
    setSending(true);
    try {
      const result = await authService.requestPhoneOtp(phoneNumber.trim());
      setOtpId(result.otp_id);
      setOtpCode("");
      setStep("otp");
      const sms = result.delivery_methods?.sms?.sent;
      const email = result.delivery_methods?.email?.sent;
      let msg = result.message || "Verification code sent";
      if (email && sms) {
        msg = "Code sent to your phone and email";
      } else if (email) {
        msg = `Code sent to ${result.delivery_methods?.email?.address || "your email"}`;
      } else if (sms) {
        msg = "Code sent to your phone";
      }
      toast.success(result.dev_hint ? `${msg}. ${result.dev_hint}` : msg);
    } catch (error) {
      const detail =
        error.response?.data?.message ||
        error.response?.data?.phone_number?.[0] ||
        "Could not send verification code";
      toast.error(detail);
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6 || !otpId) {
      toast.error("Enter the 6-digit code we sent you");
      return;
    }
    const result = await dispatch(
      loginWithPhone({
        phoneNumber: phoneNumber.trim(),
        otpCode: otpCode.trim(),
        otpId,
      })
    );
    if (loginWithPhone.fulfilled.match(result)) {
      if (result.payload?.is_new_user) {
        toast.info("Welcome! Update your name anytime under Profile.");
      }
    }
  };

  if (step === "phone") {
    return (
      <form onSubmit={handleSendCode}>
        <div className="form-group">
          <input
            type="tel"
            className="form-control"
            placeholder="0712345678 or 254712345678"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={disabled || sending}
            required
          />
          <small className="text-muted d-block mt-2">
            We&apos;ll text you a one-time code. New numbers get an account automatically.
          </small>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-block" disabled={disabled || sending}>
            {sending ? "Sending..." : "Send verification code"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleVerify}>
      <p className="text-muted small mb-3">
        Enter the 6-digit code sent to <strong>{phoneNumber}</strong>{" "}
        <button
          type="button"
          className="btn btn-link btn-sm p-0 align-baseline"
          onClick={() => {
            setStep("phone");
            setOtpCode("");
          }}
        >
          Change number
        </button>
      </p>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="6-digit code"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          disabled={disabled || isLoading}
          autoFocus
          required
        />
      </div>
      <div className="form-group">
        <button type="submit" className="btn btn-block" disabled={disabled || isLoading}>
          {isLoading ? "Verifying..." : "Verify and sign in"}
        </button>
      </div>
      <p className="text-muted small mb-0 text-center">
        Didn&apos;t get it? Wait a minute, then send again.
      </p>
    </form>
  );
};

export default PhoneLoginForm;
