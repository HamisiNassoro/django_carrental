import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginWithPhone, reset } from "../features/auth/authSlice";
import authService from "../features/auth/authService";
import Spinner from "./Spinner";
import "./Login.css";

const PhoneLogin = () => {
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpId, setOtpId] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sending, setSending] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
    if (isSuccess) {
      toast.success("Welcome!");
      navigate(location.state?.from || "/");
      dispatch(reset());
    }
  }, [isError, isSuccess, message, navigate, dispatch, location.state]);

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
      setIsNewUser(Boolean(result.is_new_user));
      setStep("verify");
      toast.success(
        result.dev_hint
          ? "Code sent — check the Django server console in development"
          : "Verification code sent to your phone"
      );
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

  const handleVerify = (e) => {
    e.preventDefault();
    if (!otpCode.trim() || !otpId) {
      toast.error("Enter the verification code");
      return;
    }
    dispatch(
      loginWithPhone({
        phoneNumber: phoneNumber.trim(),
        otpCode: otpCode.trim(),
        otpId,
        firstName: isNewUser ? firstName.trim() : "",
        lastName: isNewUser ? lastName.trim() : "",
      })
    );
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <section className="heading">
        <h1>Sign in with phone</h1>
        <p>We&apos;ll send a one-time code to your M-Pesa number</p>
      </section>

      <section className="form">
        {step === "phone" ? (
          <form onSubmit={handleSendCode}>
            <div className="form-group">
              <input
                type="tel"
                className="form-control"
                placeholder="0712345678 or 254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-block" disabled={sending}>
                {sending ? "Sending..." : "Send verification code"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <p className="text-muted small mb-3">
              Code sent to <strong>{phoneNumber}</strong>{" "}
              <button
                type="button"
                className="btn btn-link btn-sm p-0 align-baseline"
                onClick={() => setStep("phone")}
              >
                Change
              </button>
            </p>
            {isNewUser && (
              <>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="6-digit code"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
              />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-block">
                Verify and sign in
              </button>
            </div>
          </form>
        )}

        <div className="form-group text-center">
          <p>
            Prefer email?{" "}
            <Link to="/login" style={{ color: "#667eea", textDecoration: "none", fontWeight: 600 }}>
              Sign in with email
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default PhoneLogin;
