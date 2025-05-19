import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import Header from '../../components/shared/Header';
import Statistics from '../../components/Order/Statistics';
import OrderForm from '../../components/Order/OrderForm';
import { useAuth } from '../../contexts/Auth';
import orderService from '../../services/order.service';
import GlobalMatches from '../../components/GlobalMatches';
import MyActiveOrders from '../../components/MyActiveOrders';
import OrderBook from '../../components/BidAsk';
import MyHistory from '../../components/MyHistory';

/**
 * Orders page component
 * Shows trading interface with statistics, order books, and user orders
 */
export default function OrdersPage() {
  const { state, refreshUserProfile } = useAuth();
  const { user } = state;

  const [statistics, setStatistics] = useState({
    lastPrice: 0,
    btcVolume: 0,
    usdVolume: 0,
    high: 0,
    low: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('statistics');
  const [bidAskView, setBidAskView] = useState<'bid' | 'ask'>('bid');

  useEffect(() => {
    loadData();
    
    const intervalId = setInterval(() => {
      loadData();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const statsData = await orderService.getStatistics();
      setStatistics(statsData);
      
      await refreshUserProfile();
    } catch (err: unknown) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Error loading data:');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (type: string, amount: number, price: number) => {
    try {
      await orderService.createOrder(type, amount, price);
      
      loadData();
      
      alert(`${type === 'buy' ? 'Buy' : 'Sell'} order created successfully!`);
    } catch (err: unknown) {
      console.error('Error creating order:', err);
      alert(`Error creating order: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleTabSelect = (key: React.SetStateAction<string>) => {
    setActiveTab(key);
  };

  const handleBidAskViewChange = (view: 'bid' | 'ask') => {
    console.log('handleBidAskViewChange called with:', view);
    setBidAskView(view);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'statistics':
        return (
          <Statistics 
            stats={statistics}
            user={user}
          />
        );
      case 'globalMatches':
        return <GlobalMatches itemsPerPage={20} />;
      case 'trade':
        return (
          <OrderForm
            selectedOrder={selectedOrder}
            onCreateOrder={handleCreateOrder}
          />
        );
      case 'activeOrders':
        return (
          <MyActiveOrders 
            itemsPerPage={10} 
          />
        );
      case 'myHistory':
        return (
          <MyHistory 
            itemsPerPage={10} 
          />
        );
      case 'bidAsk':
        console.log('Rendering BidAsk with viewMode:', bidAskView);
        return <OrderBook itemsPerPage={10} viewMode={bidAskView} />;
      default:
        return <div>Default content</div>;
    }
  };

  return (
    <>
      <Header 
        activeTab={activeTab} 
        onTabSelect={handleTabSelect}
        bidAskView={bidAskView}
        onBidAskViewChange={handleBidAskViewChange}
      />
      
      <Container className="mt-3" style={{ maxWidth: '900px' }}>
        {loading && (
          <div className="position-absolute" style={{ top: '60px', right: '20px', zIndex: 1000 }}>
            <Spinner animation="border" size="sm" variant="primary" />
          </div>
        )}
        
        {error && (
          <div className="alert alert-danger m-2 p-2 small">
            {error}
            <button 
              className="btn btn-sm btn-outline-danger ms-2 py-0"
              onClick={loadData}
            >
              Try again
            </button>
          </div>
        )}
        
        <div className="tab-content bg-white border rounded">
          {renderTabContent()}
        </div>
      </Container>
    </>
  );
}