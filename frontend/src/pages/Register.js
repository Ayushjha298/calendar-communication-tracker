import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth'; 
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('user'); 
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
    
        try {
            
            const response = await register(email, password, role); 
    
            if (response.token && response.role) {
                setSuccess('Registration successful! Redirecting to login page...');
                setTimeout(() => {
                    
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('role', response.role);
                    navigate(response.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
                }, 2000);
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred during registration.');
            console.error('Registration error:', err);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f0f4f8' }}>
            <Row className="w-100">
                <Col md={6} lg={4} className="mx-auto">
                    <Card className="shadow-lg border-0 rounded-4 p-4" style={{ backgroundColor: '#fff' }}>
                        <Card.Body>
                            <h2 className="text-center mb-4" style={{ fontSize: '30px', color: '#4e4e4e', fontWeight: '600' }}>Create an Account</h2>
                            {error && <Alert variant="danger" style={{ marginBottom: '20px' }}>{error}</Alert>}
                            {success && <Alert variant="success" style={{ marginBottom: '20px' }}>{success}</Alert>}
                            <Form onSubmit={handleRegister}>
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label style={{ fontWeight: '500' }}>Email</Form.Label>
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

                                <Form.Group className="mb-3" controlId="confirmPassword">
                                    <Form.Label style={{ fontWeight: '500' }}>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        placeholder="Confirm your password"
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
                                    Register
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className="text-center mt-3">
                        <small>
                            Already have an account? <a href="/login" style={{ color: '#4CAF50', fontWeight: '500' }}>Login</a>
                        </small>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
