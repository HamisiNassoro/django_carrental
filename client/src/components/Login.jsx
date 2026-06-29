import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { login, reset } from "../features/auth/authSlice";
import Spinner from "./Spinner";
import PasswordInput from "./PasswordInput";
import PhoneLoginForm from "./PhoneLoginForm";
import "./Login.css";

function Login() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "phone" ? "phone" : "email";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { email, password } = formData;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      setIsSubmitting(false);
      dispatch(reset());
    }

    if (isSuccess) {
      toast.success("Login successful! Welcome back!");
      navigate(location.state?.from || "/");
      dispatch(reset());
    }
  }, [isError, isSuccess, message, navigate, dispatch, location.state]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      dispatch(login({ email, password }));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="auth-page">
      <section className="form auth-card">
        <div className="auth-card__header">
          <h1>Welcome back</h1>
          <p>Sign in with email or phone OTP</p>
        </div>

        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab ${activeTab === "email" ? "active" : ""}`}
            onClick={() => setActiveTab("email")}
          >
            Email
          </button>
          <button
            type="button"
            className={`login-tab ${activeTab === "phone" ? "active" : ""}`}
            onClick={() => setActiveTab("phone")}
          >
            Phone (OTP)
          </button>
        </div>

        {activeTab === "email" ? (
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className={`form-control ${errors.email ? "error" : ""}`}
                id="email"
                name="email"
                value={email}
                placeholder="you@example.com"
                onChange={onChange}
                required
              />
              {errors.email && (
                <small className="field-error">{errors.email}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <PasswordInput
                className={errors.password ? "error" : ""}
                id="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={onChange}
                required
              />
              {errors.password && (
                <small className="field-error">{errors.password}</small>
              )}
            </div>
            <div className="form-group mb-0">
              <button type="submit" className="btn btn-block" disabled={isSubmitting}>
                {isSubmitting ? "Signing in…" : "Sign in"}
              </button>
            </div>
          </form>
        ) : (
          <PhoneLoginForm />
        )}

        <div className="auth-card__footer">
          <p className="auth-card__footer-text">
            Don&apos;t have an account?{" "}
            <Link to="/register">Sign up with email</Link>
          </p>
          <p className="auth-card__footer-hint">
            New to the app? Use the Phone tab — we&apos;ll create your account when you verify your number.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
