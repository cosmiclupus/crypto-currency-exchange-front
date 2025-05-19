import React, { useState, useEffect } from 'react';
import { Form, Button, Container, InputGroup, Spinner } from 'react-bootstrap';
import DataCard from '../../shared/DataCard';

interface OrderFormProps {
  selectedOrder?: any;
  onCreateOrder: (type: string, amount: number, price: number) => Promise<void>;
}

/**
 * OrderForm component using the DataCard reusable component
 */
export default function OrderForm({ selectedOrder, onCreateOrder }: OrderFormProps) {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  
  const [buyForm, setBuyForm] = useState({
    amount: '',
    price: '',
    total: 0
  });
  
  const [sellForm, setSellForm] = useState({
    amount: '',
    price: '',
    total: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState({
    buy: false,
    sell: false
  });
  
  const [error, setError] = useState<string | null>(null);
  const isLoading = false;

  useEffect(() => {
    if (selectedOrder) {
      if (selectedOrder.type === 'buy') {
        setOrderType('buy');
        setBuyForm({
          amount: selectedOrder.amount.toString(),
          price: selectedOrder.price.toString(),
          total: selectedOrder.amount * selectedOrder.price
        });
      } else {
        setOrderType('sell');
        setSellForm({
          amount: selectedOrder.amount.toString(),
          price: selectedOrder.price.toString(),
          total: selectedOrder.amount * selectedOrder.price
        });
      }
    }
  }, [selectedOrder]);
  
  const handleOrderTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderType(e.target.value as 'buy' | 'sell');
  };
  
  const handleBuyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...buyForm, [name]: value };
    
    if (name === 'amount' || name === 'price') {
      const amount = parseFloat(updatedForm.amount) || 0;
      const price = parseFloat(updatedForm.price) || 0;
      updatedForm.total = amount * price;
    }
    
    setBuyForm(updatedForm);
  };
  
  const handleSellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...sellForm, [name]: value };
    
    if (name === 'amount' || name === 'price') {
      const amount = parseFloat(updatedForm.amount) || 0;
      const price = parseFloat(updatedForm.price) || 0;
      updatedForm.total = amount * price;
    }
    
    setSellForm(updatedForm);
  };
  
  const handleBuySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting({ ...isSubmitting, buy: true });
      setError(null);
      
      const amount = parseFloat(buyForm.amount);
      const price = parseFloat(buyForm.price);
      
      await onCreateOrder('buy', amount, price);
      
      setBuyForm({
        amount: '',
        price: '',
        total: 0
      });
    } catch (error: any) {
      setError(error.message || 'Error creating purchase order');
    } finally {
      setIsSubmitting({ ...isSubmitting, buy: false });
    }
  };
  
  const handleSellSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting({ ...isSubmitting, sell: true });
      setError(null);
      
      const amount = parseFloat(sellForm.amount);
      const price = parseFloat(sellForm.price);
      
      await onCreateOrder('sell', amount, price);
      
      setSellForm({
        amount: '',
        price: '',
        total: 0
      });
    } catch (error: any) {
      setError(error.message || 'Error creating sales order');
    } finally {
      setIsSubmitting({ ...isSubmitting, sell: false });
    }
  };

  const orderFormContent = (
    <Container>
      <Form.Group className="mb-4">
        <Form.Label className="fw-medium mb-2">Operation Type</Form.Label>
        <Form.Select 
          value={orderType} 
          onChange={handleOrderTypeChange}
          className="form-select py-2"
        >
          <option value="buy">Buy BTC</option>
          <option value="sell">Sell BTC</option>
        </Form.Select>
      </Form.Group>

      {orderType === 'buy' && (
        <div className="buy-form">
          <Form onSubmit={handleBuySubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium mb-2">Amount (BTC)</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={buyForm.amount}
                onChange={handleBuyChange}
                placeholder="0.000"
                step="0.001"
                min="0.001"
                disabled={isSubmitting.buy}
                required
                className="py-2"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium mb-2">Price (USD)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={buyForm.price}
                onChange={handleBuyChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                disabled={isSubmitting.buy}
                required
                className="py-2"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium mb-2">USD Total</Form.Label>
              <InputGroup>
                <InputGroup.Text className="rounded-start">$</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={buyForm.total.toFixed(2)}
                  readOnly
                  className="py-2"
                />
              </InputGroup>
            </Form.Group>
            
            <div className="d-flex justify-content-center mt-4 mb-2">
              <Button 
                variant="success" 
                type="submit" 
                style={{ width: '30%' }}
                className="py-2 fw-bold"
                disabled={isSubmitting.buy}
              >
                {isSubmitting.buy ? 'Processing...' : 'Buy BTC'}
              </Button>
            </div>
          </Form>
        </div>
      )}
      
      {orderType === 'sell' && (
        <div className="sell-form mb-3">
          <Form onSubmit={handleSellSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium mb-2">Amount (BTC)</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={sellForm.amount}
                onChange={handleSellChange}
                placeholder="0.000"
                step="0.001"
                min="0.001"
                disabled={isSubmitting.sell}
                required
                className="py-2"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium mb-2">Price (USD)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={sellForm.price}
                onChange={handleSellChange}
                placeholder="0.00"
                step="5"
                min="1"
                disabled={isSubmitting.sell}
                required
                className="py-2"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-medium mb-2">USD Total</Form.Label>
              <InputGroup>
                <InputGroup.Text className="rounded-start">$</InputGroup.Text>
                <Form.Control
                  type="number"
                  value={sellForm.total.toFixed(2)}
                  readOnly
                  className="py-2"
                />
              </InputGroup>
            </Form.Group>
            
            <div className="d-flex justify-content-center mt-4 mb-2">
              <Button 
                variant="danger" 
                type="submit" 
                style={{ width: '30%' }}
                className="py-2 fw-bold"
                disabled={isSubmitting.sell}
              >
                {isSubmitting.sell ? 'Processing...' : 'Sell BTC'}
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Container>
  );

  return (
    <DataCard
      title="Buy and Sell"
      loading={isLoading}
      error={error}
      loadingMessage="Loading order form..."
    >
      <div className="p-4">
        {orderFormContent}
      </div>
    </DataCard>
  );
}