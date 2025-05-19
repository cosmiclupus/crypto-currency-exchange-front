// src/components/BidAsk/index.tsx
import React, { useEffect, useState } from 'react';
import orderService from '../../services/order.service';
import DataCard from '../shared/DataCard';

interface OrderBookItem {
  price: number;
  volume: number;
}

interface OrderBookData {
  bids: OrderBookItem[]; 
  asks: OrderBookItem[]; 
}

interface OrderBookProps {
  itemsPerPage?: number;
  viewMode?: 'bid' | 'ask'; 
}

/**
 * OrderBook (BidAsk) component displays orders based on viewMode
 * Can show either buy orders (bid) or sell orders (ask)
 */
export default function OrderBook({
  itemsPerPage = 10,
  viewMode = 'bid'
}: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<OrderBookData>({ bids: [], asks: [] });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Vamos usar apenas uma paginação já que mostramos um tipo por vez
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        setLoading(true);
        
        const response = await orderService.getOrderBook() as any;
        
        let bookData: OrderBookData;
        
        if (response && response.orderBook) {
          bookData = response.orderBook;
        } else if (response && response.bids && response.asks) {
          bookData = response;
        } else {
          console.error('Could not extract order book data from response:', response);
          setError('Unexpected response format');
          setOrderBook({ bids: [], asks: [] });
          return;
        }
        
        setOrderBook(bookData);
        
        const items = viewMode === 'bid' ? bookData.bids : bookData.asks;
        setTotalPages(Math.ceil(items.length / itemsPerPage));
      } catch (error: any) {
        console.error('Error fetching order book:', error);
        setError('Failed to get order book');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderBook();
    
    const interval = setInterval(fetchOrderBook, 5000);
    
    return () => clearInterval(interval);
  }, [itemsPerPage, viewMode]); // Adicionado viewMode às dependências

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const formatUSD = (value: number): string => {
    return `US$ ${value.toLocaleString('en-US')}`;
  };

  const formatBTC = (value: number): string => {
    return `BTC ${value.toFixed(3)}`;
  };

  const getCurrentItems = (): OrderBookItem[] => {
    const items = viewMode === 'bid' ? orderBook.bids : orderBook.asks;
    if (!items || items.length === 0) return [];
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentItems = getCurrentItems();

  const getTitle = () => {
    return viewMode === 'bid' ? 'Bid (Sell Orders)' : 'Ask (Buy Orders)';
  };

  const tableHeaders = (
    <tr>
      <th className="px-4">Price</th>
      <th className="px-4">Volume</th>
    </tr>
  );
  
  const tableBody = (
    <>
      {currentItems.length > 0 ? (
        currentItems.map((item, index) => (
          <tr 
            key={`${viewMode}-${index}-${item.price}`}
            className={viewMode === 'bid' ? 'table-danger' : 'table-success'}
          >
            <td className={`px-4 ${viewMode === 'bid' ? 'text-danger' : 'text-success'}`}>
              {formatUSD(item.price)}
            </td>
            <td className="px-4">{formatBTC(item.volume)}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={2} className="text-center py-3">
            <em>No {viewMode === 'bid' ? 'bids' : 'asks'} available</em>
          </td>
        </tr>
      )}
    </>
  );

  return (
    <DataCard
      title={getTitle()}
      loading={loading && ((viewMode === 'bid' && !orderBook.bids.length) || 
                          (viewMode === 'ask' && !orderBook.asks.length))}
      error={error}
      loadingMessage={`Loading ${viewMode === 'bid' ? 'sell' : 'buy'} orders...`}
      tableHeaders={tableHeaders}
      tableBody={tableBody}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      noBodyPadding={true}
    />
  );
}
