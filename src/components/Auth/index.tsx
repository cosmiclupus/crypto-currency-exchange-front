import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/Auth';

export default function Auth() {
  const [username, setUsername] = useState<string>('');
  const { state, login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.trim() === '') {
      return;
    }
    
    await login(username);
  };
  
  return (
    <Card className="shadow" style={{ minHeight: '250px' }}>
      <Card.Header as="h4" className="text-center bg-primary text-white">
        Trading Platform
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={state.loading}
              required
            />
            <Form.Text className="text-muted">
              New users will be registered automatically with 100 BTC and 100,000 USD.
            </Form.Text>
          </Form.Group>
          
          {state.error && (
            <Alert variant="danger">{state.error}</Alert>
          )}
          
          <div className="d-grid gap-2">
            <Button 
              variant="primary" 
              type="submit"
              disabled={state.loading}
            >
              {state.loading ? 'Loading...' : 'Login / Register'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}