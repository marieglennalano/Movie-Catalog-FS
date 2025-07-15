import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import Swal from 'sweetalert2';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://movie-catalog-api-zwov.onrender.com/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      // Save token
      localStorage.setItem('token', data.access);

      // Set user context
      login({
        email: formData.email,
        isAdmin: data.isAdmin || false,
      });

      Swal.fire({
        title: 'Success!',
        text: 'Logged in!',
        icon: 'success',
      }).then(() => {
        if (data.isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({
        title: 'Error!',
        text: err.message,
        icon: 'error',
      });
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="p-4 shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4">🔐 Sign In</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                <Button type="submit" className="w-100">Sign In</Button>
              </Form>
              <div className="mt-3 text-center small text-muted">
                Don’t have an account? <a href="/register">Register here</a>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
