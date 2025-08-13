import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../features/auth/authSlice";
import Spinner from "./Spinner";
import "./Login.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { username, email, password, password2, first_name, last_name } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
      setIsSubmitting(false);
    }

    if (isSuccess || user) {
      toast.success("Registration successful! Welcome to Car Rental!");
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!first_name) {
      newErrors.first_name = "First name is required";
    }

    if (!last_name) {
      newErrors.last_name = "Last name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!password2) {
      newErrors.password2 = "Please confirm your password";
    } else if (password !== password2) {
      newErrors.password2 = "Passwords do not match";
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      const userData = {
        username,
        email,
        password,
        first_name,
        last_name,
      };

      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>Join Car Rental</h1>
        <p>Create your account to get started</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className={`form-control ${errors.username ? 'error' : ''}`}
              id="username"
              name="username"
              value={username}
              placeholder="Choose a username"
              onChange={onChange}
              required
            />
            {errors.username && (
              <small style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.username}
              </small>
            )}
          </div>
          <div className="form-group">
            <input
              type="text"
              className={`form-control ${errors.first_name ? 'error' : ''}`}
              id="first_name"
              name="first_name"
              value={first_name}
              placeholder="Enter your first name"
              onChange={onChange}
              required
            />
            {errors.first_name && (
              <small style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.first_name}
              </small>
            )}
          </div>
          <div className="form-group">
            <input
              type="text"
              className={`form-control ${errors.last_name ? 'error' : ''}`}
              id="last_name"
              name="last_name"
              value={last_name}
              placeholder="Enter your last name"
              onChange={onChange}
              required
            />
            {errors.last_name && (
              <small style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.last_name}
              </small>
            )}
          </div>
          <div className="form-group">
            <input
              type="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              id="email"
              name="email"
              value={email}
              placeholder="Enter your email address"
              onChange={onChange}
              required
            />
            {errors.email && (
              <small style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.email}
              </small>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              className={`form-control ${errors.password ? 'error' : ''}`}
              id="password"
              name="password"
              value={password}
              placeholder="Create a password"
              onChange={onChange}
              required
            />
            {errors.password && (
              <small style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.password}
              </small>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              className={`form-control ${errors.password2 ? 'error' : ''}`}
              id="password2"
              name="password2"
              value={password2}
              placeholder="Confirm your password"
              onChange={onChange}
              required
            />
            {errors.password2 && (
              <small style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.password2}
              </small>
            )}
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="btn btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>
          <div className="form-group text-center">
            <p>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#667eea", textDecoration: "none", fontWeight: "600" }}>
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;