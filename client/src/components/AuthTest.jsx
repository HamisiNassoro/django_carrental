import React from "react";
import { useSelector } from "react-redux";
import { Container, Card, Badge, Alert } from "react-bootstrap";

function AuthTest() {
  const { user, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Authentication Status</h2>

      {user ? (
        <Card className="shadow-sm">
          <Card.Header className="bg-success text-white">
            <h5 className="mb-0">
              <Badge bg="light" text="dark" className="me-2">✓</Badge>
              Authenticated
            </h5>
          </Card.Header>
          <Card.Body>
            <h6>User Information:</h6>
            <div className="row">
              <div className="col-md-6">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>First Name:</strong> {user.first_name || "Not provided"}</p>
                <p><strong>Last Name:</strong> {user.last_name || "Not provided"}</p>
              </div>
              <div className="col-md-6">
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Date Joined:</strong> {new Date(user.date_joined).toLocaleDateString()}</p>
                <p><strong>Last Login:</strong> {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}</p>
                <p><strong>Active:</strong> {user.is_active ? "Yes" : "No"}</p>
              </div>
            </div>
            <Alert variant="info" className="mt-3">
              <strong>Token Status:</strong> {localStorage.getItem("token") ? "Valid token stored" : "No token found"}
            </Alert>
          </Card.Body>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Card.Header className="bg-warning text-dark">
            <h5 className="mb-0">
              <Badge bg="secondary" className="me-2">✗</Badge>
              Not Authenticated
            </h5>
          </Card.Header>
          <Card.Body>
            <p>You are not currently logged in.</p>
            <Alert variant="warning">
              <strong>Token Status:</strong> {localStorage.getItem("token") ? "Token found but user not loaded" : "No token found"}
            </Alert>
            <div className="mt-3">
              <a href="/login" className="btn btn-primary me-2">Login</a>
              <a href="/register" className="btn btn-outline-primary">Register</a>
            </div>
          </Card.Body>
        </Card>
      )}

      <Card className="mt-4 shadow-sm">
        <Card.Header>
          <h6 className="mb-0">Local Storage Status</h6>
        </Card.Header>
        <Card.Body>
          <div className="row">
            <div className="col-md-6">
              <p><strong>User Data:</strong> {localStorage.getItem("user") ? "Present" : "Not found"}</p>
              <p><strong>Token:</strong> {localStorage.getItem("token") ? "Present" : "Not found"}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Token Length:</strong> {localStorage.getItem("token")?.length || 0} characters</p>
              <p><strong>User Data Length:</strong> {localStorage.getItem("user")?.length || 0} characters</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AuthTest;