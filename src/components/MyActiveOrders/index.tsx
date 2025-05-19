// src/components/MyActiveOrders/MyActiveOrders.tsx
import React, { useEffect, useState } from 'react';
import { Card, Table, Spinner, Alert, Button } from 'react-bootstrap';
import orderService from '../../services/order.service';
import PaginationControls from '../shared/PaginationControls';
import { Order } from '../../types/order.type';
import DataCard from '../shared/DataCard';

interface MyActiveOrdersProps {
  itemsPerPage?: number;
  onOrderCancelled?: () => void;
}

/**
 * Component that displays the user's active orders with options to cancel them
 */
export default function MyActiveOrders({ 
  itemsPerPage = 10,
  onOrderCancelled
}: MyActiveOrdersProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        setLoading(true);
        
        const response = await orderService.getActiveOrders();
        
        const typedResponse = response as any;
        
        if (typedResponse.success && typedResponse.data?.orders) {
          const ordersArray = typedResponse.data.orders;
          setOrders(ordersArray);
          setTotalPages(Math.ceil(ordersArray.length / itemsPerPage));
          setError(null);
        } else {
          console.error('Unexpected API response format:', typedResponse);
          setError('Unexpected response format');
          setOrders([]);
        }
      } catch (error: any) {
        console.error('Error fetching active orders:', error);
        setError('Failed to get active orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveOrders();
    
    const interval = setInterval(fetchActiveOrders, 10000);
    
    return () => clearInterval(interval);
  }, [itemsPerPage]);

  const formatAmount = (amount: number): string => {
    return `BTC ${amount.toFixed(3)}`;
  };

  const formatPrice = (price: number): string => {
    return `US$ ${price.toLocaleString('pt-BR')}`;
  };

  const getCurrentPageItems = (): Order[] => {
    if (!Array.isArray(orders) || orders.length === 0) {
      return [];
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return orders.slice(start, end);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingOrderId(orderId);
      await orderService.cancelOrder(orderId);
      
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      
      if (onOrderCancelled) {
        onOrderCancelled();
      }
    } catch (error: any) {
      console.error('Error cancelling order:', error);
      setError(`Failed to cancel order: ${error.message}`);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const currentItems = getCurrentPageItems();
  const hasItems = currentItems.length > 0;

  const tableHeaders = (
    <tr>
      <th className="px-4">Amount</th>
      <th className="px-4">Price</th>
      <th className="px-4">Type</th>
      <th className="px-4 text-center"></th>
    </tr>
  );

  const tableBody = (
    <>
      {hasItems ? (
        currentItems.map(order => (
          <tr key={order.id}>
            <td className="px-4">{formatAmount(order.amount)}</td>
            <td className="px-4">{formatPrice(order.price)}</td>
            <td className="px-4">
              <span className={order.type === 'buy' ? 'text-success' : 'text-danger'}>
                {order.type}
              </span>
            </td>
            <td className="px-4 text-center">
              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={() => handleCancelOrder(order.id)}
                disabled={cancellingOrderId === order.id}
                aria-label="Cancelar ordem"
                style={{ padding: '0.15rem 0.5rem', lineHeight: '1.2' }}
              >
                {cancellingOrderId === order.id ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                    />
                    <span className="visually-hidden">Canceling...</span>
                    X
                  </>
                ) : (
                  'X'
                )}
              </Button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={4} className="text-center py-3">
            <em>No active orders</em>
          </td>
        </tr>
      )}
      {orders.length > 0 && orders.length < 5 && Array(5 - orders.length).fill(0).map((_, index) => (
        <tr key={`empty-${index}`} style={{ height: "43px" }}>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      ))}
    </>
  );

  return (
    <DataCard
      title="My active orders"
      loading={loading}
      error={error}
      loadingMessage="Loading active orders..."
      tableHeaders={tableHeaders}
      tableBody={tableBody}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      noBodyPadding={true}
    />
  );
}