import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import PasswordInput from "../components/PasswordInput";
import profileAPIService from "../features/profile/profileAPIService";
import authService from "../features/auth/authService";
import { getCurrentUser } from "../features/auth/authSlice";

const parseApiErrors = (error) => {
  const data = error.response?.data;
  if (!data) return { _form: error.message || "Something went wrong" };

  const payload = data.profile && typeof data.profile === "object" ? data.profile : data;
  const fieldErrors = {};
  let formMessage = "";

  if (typeof payload === "string") {
    return { _form: payload };
  }
  if (payload.detail) {
    formMessage = payload.detail;
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (key === "detail") return;
    const message = Array.isArray(value) ? value.join(" ") : String(value);
    fieldErrors[key] = message;
  });

  if (!formMessage && fieldErrors._form) {
    formMessage = fieldErrors._form;
    delete fieldErrors._form;
  }

  return { ...fieldErrors, _form: formMessage };
};

const firstErrorMessage = (errors) => {
  if (errors._form) return errors._form;
  const firstKey = Object.keys(errors).find((k) => k !== "_form");
  return firstKey ? errors[firstKey] : "Something went wrong";
};

const ProfileSettingsPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linkingEmail, setLinkingEmail] = useState(false);
  const [isPhoneOnly, setIsPhoneOnly] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [form, setForm] = useState({
    phone_number: "",
    mpesa_payout_number: "",
    city: "",
    car_owner: false,
    renters: false,
  });
  const [emailForm, setEmailForm] = useState({
    link_email: "",
    link_password: "",
    link_re_password: "",
    first_name: "",
    last_name: "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [emailErrors, setEmailErrors] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await profileAPIService.getMyProfile();
        setIsPhoneOnly(Boolean(profile.is_phone_only_account));
        setLoginEmail(profile.email || "");
        setForm({
          phone_number: profile.phone_number || "",
          mpesa_payout_number: profile.mpesa_payout_number || "",
          city: profile.city || "",
          car_owner: Boolean(profile.car_owner),
          renters: Boolean(profile.renters),
        });
        setEmailForm({
          link_email: "",
          link_password: "",
          link_re_password: "",
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
        });
      } catch {
        toast.error("Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEmailFormChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
    if (emailErrors[name]) {
      setEmailErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.username) return;
    setSaving(true);
    setProfileErrors({});
    try {
      await profileAPIService.updateProfile(user.username, form);
      toast.success("Profile updated");
    } catch (error) {
      const errors = parseApiErrors(error);
      setProfileErrors(errors);
      toast.error(firstErrorMessage(errors));
    } finally {
      setSaving(false);
    }
  };

  const handleLinkEmail = async (e) => {
    e.preventDefault();
    setLinkingEmail(true);
    setEmailErrors({});
    try {
      const result = await profileAPIService.linkEmailLogin({
        email: emailForm.link_email.trim(),
        password: emailForm.link_password,
        re_password: emailForm.link_re_password,
        first_name: emailForm.first_name.trim(),
        last_name: emailForm.last_name.trim(),
      });
      if (result.user) {
        authService.setUser(result.user);
      }
      await dispatch(getCurrentUser());
      setIsPhoneOnly(false);
      setLoginEmail(result.user?.email || emailForm.link_email);
      setEmailForm({
        link_email: "",
        link_password: "",
        link_re_password: "",
        first_name: result.user?.first_name || emailForm.first_name,
        last_name: result.user?.last_name || emailForm.last_name,
      });
      toast.success(result.message || "Email login enabled");
    } catch (error) {
      const errors = parseApiErrors(error);
      const mapped = {
        link_email: errors.email || "",
        link_password: errors.password || "",
        link_re_password: errors.re_password || "",
        _form: errors._form || "",
      };
      setEmailErrors(mapped);
      toast.error(
        mapped.link_email ||
          mapped.link_password ||
          mapped.link_re_password ||
          mapped._form ||
          "Could not enable email login"
      );
    } finally {
      setLinkingEmail(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Container className="py-5" style={{ marginTop: "80px" }}>
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1 className="fw-bold page-title mb-2">Profile settings</h1>
          <p className="text-muted mb-4">
            Contact, login, and M-Pesa details for payments and owner payouts.
          </p>

          {isPhoneOnly ? (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-2">Enable email login</h5>
                <p className="text-muted small mb-3">
                  You signed up with phone OTP. Add an email and password here if you
                  also want to sign in from the Email tab on the login page.
                </p>
                <Form
                  id="link-email-login-form"
                  onSubmit={handleLinkEmail}
                  autoComplete="off"
                >
                  <input type="text" name="username" autoComplete="username" hidden readOnly tabIndex={-1} aria-hidden="true" />
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                          type="email"
                          name="link_email"
                          id="link-email-address"
                          value={emailForm.link_email}
                          onChange={handleEmailFormChange}
                          placeholder="you@example.com"
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="none"
                          spellCheck={false}
                          required
                          className={emailErrors.link_email ? "error" : ""}
                        />
                        {emailErrors.link_email && (
                          <small className="text-danger d-block mt-1">{emailErrors.link_email}</small>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                          type="text"
                          name="first_name"
                          value={emailForm.first_name}
                          onChange={handleEmailFormChange}
                          autoComplete="given-name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                          type="text"
                          name="last_name"
                          value={emailForm.last_name}
                          onChange={handleEmailFormChange}
                          autoComplete="family-name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <PasswordInput
                          id="link-new-password"
                          name="link_password"
                          value={emailForm.link_password}
                          onChange={handleEmailFormChange}
                          placeholder="At least 8 characters"
                          autoComplete="new-password"
                          className={emailErrors.link_password ? "error" : ""}
                          required
                        />
                        {emailErrors.link_password && (
                          <small className="text-danger d-block mt-1">{emailErrors.link_password}</small>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Confirm password</Form.Label>
                        <PasswordInput
                          id="link-confirm-password"
                          name="link_re_password"
                          value={emailForm.link_re_password}
                          onChange={handleEmailFormChange}
                          placeholder="Repeat password"
                          autoComplete="new-password"
                          className={emailErrors.link_re_password ? "error" : ""}
                          required
                        />
                        {emailErrors.link_re_password && (
                          <small className="text-danger d-block mt-1">{emailErrors.link_re_password}</small>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    type="submit"
                    className="btn-accent mt-3"
                    disabled={linkingEmail}
                  >
                    {linkingEmail ? "Saving..." : "Enable email login"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-2">Login methods</h5>
                <p className="text-muted small mb-0">
                  Email login is enabled for{" "}
                  <strong>{loginEmail}</strong>. You can also sign in with phone OTP
                  if your number is saved below.
                </p>
              </Card.Body>
            </Card>
          )}

          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-3">Contact &amp; payouts</h5>
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Phone number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                        placeholder="+254712345678"
                        autoComplete="tel"
                        className={profileErrors.phone_number ? "error" : ""}
                      />
                      {profileErrors.phone_number && (
                        <small className="text-danger d-block mt-1">{profileErrors.phone_number}</small>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>M-Pesa payout number (owners)</Form.Label>
                      <Form.Control
                        type="tel"
                        name="mpesa_payout_number"
                        value={form.mpesa_payout_number}
                        onChange={handleChange}
                        placeholder="254712345678"
                        autoComplete="off"
                      />
                      <Form.Text className="text-muted">
                        Where owner earnings are sent after a trip completes.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        autoComplete="address-level2"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="d-flex align-items-end gap-4">
                    <Form.Check
                      type="checkbox"
                      id="car_owner"
                      name="car_owner"
                      label="I list cars for rent"
                      checked={form.car_owner}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="checkbox"
                      id="renters"
                      name="renters"
                      label="I rent cars"
                      checked={form.renters}
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
                <Button type="submit" className="btn-accent mt-4" disabled={saving}>
                  {saving ? "Saving..." : "Save profile"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileSettingsPage;
