import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import profileAPIService from "../features/profile/profileAPIService";

const ProfileSettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    phone_number: "",
    mpesa_payout_number: "",
    city: "",
    car_owner: false,
    renters: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const profile = await profileAPIService.getMyProfile();
        setForm({
          phone_number: profile.phone_number || "",
          mpesa_payout_number: profile.mpesa_payout_number || "",
          city: profile.city || "",
          car_owner: Boolean(profile.car_owner),
          renters: Boolean(profile.renters),
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.username) return;
    setSaving(true);
    try {
      await profileAPIService.updateProfile(user.username, form);
      toast.success("Profile updated");
    } catch {
      toast.error("Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <Container className="py-5" style={{ marginTop: "80px" }}>
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1 className="fw-bold page-title mb-2">Profile settings</h1>
          <p className="text-muted mb-4">
            Contact and M-Pesa details for payments and owner payouts.
          </p>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
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
                      />
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
