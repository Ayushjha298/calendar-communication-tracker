import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';

const Login = ({ setIsAuthenticated, setUserRole }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { token, role: responseRole } = await login(email, password, role);
            if (token && responseRole) {
                localStorage.setItem('token', token);
                localStorage.setItem('role', responseRole);
                setIsAuthenticated(true);
                setUserRole(responseRole);
                navigate(responseRole === 'admin' ? '/admin/dashboard' : '/user/dashboard');
            } else {
                setError('Failed to retrieve token or role.');
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
            console.error('Login error:', err);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f0f4f8' }}>
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <Card className="shadow-lg border-0 rounded-4 p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4" style={{ fontSize: '30px', color: '#4e4e4e', fontWeight: '600' }}>Welcome Back</h2>
                            {error && <Alert variant="danger" style={{ marginBottom: '20px' }}>{error}</Alert>}
                            <Form onSubmit={handleLogin}>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label style={{ fontWeight: '500' }}>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        placeholder="Enter your email"
                                        style={{
                                            borderRadius: '20px',
                                            padding: '15px',
                                            border: '1px solid #ddd',
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label style={{ fontWeight: '500' }}>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Enter your password"
                                        style={{
                                            borderRadius: '20px',
                                            padding: '15px',
                                            border: '1px solid #ddd',
                                            backgroundColor: '#fff'
                                        }}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="role">
                                    <Form.Label style={{ fontWeight: '500' }}>Role</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        style={{
                                            borderRadius: '20px',
                                            padding: '15px',
                                            border: '1px solid #ddd',
                                            backgroundColor: '#fff'
                                        }}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </Form.Control>
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100" style={{
                                    borderRadius: '25px',
                                    padding: '12px',
                                    backgroundColor: '#4CAF50',
                                    border: 'none',
                                    fontWeight: '600'
                                }}>
                                    Login
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className="text-center mt-3">
                        <small>
                            Don’t have an account? <a href="/signup" style={{ color: '#4CAF50', fontWeight: '500' }}>Sign up</a>
                        </small>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
