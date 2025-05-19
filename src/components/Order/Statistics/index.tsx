import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Spinner, Alert } from 'react-bootstrap';
import tradeService from '../../../services/trade.service';
import { TradeStatistics as ApiTradeStatistics, TradeStatisticsBase, adaptToTradeStatistics } from '../../../types/trade.type';
import { useAuth } from '../../../contexts/Auth';

interface ComponentTradeStatistics {
  data: {
    statistics: {
      lastPrice: number;
      btcVolume: number;
      usdVolume: number;
      high: number;
      low: number;
      timestamp: string;
    }
  };
}

interface StatisticsProps {
  stats?: ApiTradeStatistics | TradeStatisticsBase | ComponentTradeStatistics;
  user?: any;
}

export default function Statistics(props: StatisticsProps) {
  const [statistics, setStatistics] = useState<ComponentTradeStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { state } = useAuth();

  const normalizeStatistics = (data: any): ComponentTradeStatistics | null => {
    if (!data) return null;

    if (data.data?.statistics?.lastPrice !== undefined) {
      return data as ComponentTradeStatistics;
    }
    
    if (data.success && data.data?.statistics) {
      return {
        data: {
          statistics: data.data.statistics
        }
      };
    }
    
    if (typeof data.lastPrice === 'number') {
      return {
        data: {
          statistics: {
            lastPrice: data.lastPrice,
            btcVolume: data.btcVolume,
            usdVolume: data.usdVolume,
            high: data.high,
            low: data.low,
            timestamp: new Date().toISOString()
          }
        }
      };
    }
    
    console.error('Unknown statistics format:', data);
    return null;
  };

  useEffect(() => {
    if (props.stats) {
      const normalized = normalizeStatistics(props.stats);
      setStatistics(normalized);
      setLoading(false);
      return;
    }

    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await tradeService.getStatistics();
        
        const normalized = normalizeStatistics(response);
        
        if (normalized) {
          setStatistics(normalized);
          setError(null);
        } else {
          throw new Error('Invalid statistics format');
        }
      } catch (error: any) {
        console.error('Error fetching statistics:', error);
        setError('Failed to load market statistics');
        setStatistics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
    
    const interval = setInterval(fetchStatistics, 30000);
    
    return () => clearInterval(interval);
  }, [props.stats]);

  const formatUSD = (value: number | undefined) => {
    if (value === undefined|| null) return 'US$ 0.00';
    return `US$ ${value?.toFixed(2)}`;
  };

  const formatBTC = (value: number | undefined) => {
    if (value === undefined) return '0.000 BTC';
    return `${value.toFixed(3)} BTC`;
  };

  const user = props.user || state.user;

  const lastItemClass = "border-bottom-0 mb-0";

  return (
    <div className="bg-light rounded overflow-hidden shadow-sm">
      <div className="bg-primary text-white fw-bold p-3 pb-2 pt-2">
        Statistics
      </div>
      
      {loading && !statistics ? (
        <div className="text-center p-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 mb-0">Loading market statistics...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="m-3">
          {error}
        </Alert>
      ) : (
        <ListGroup variant="flush" className="m-0 p-0 bg-light">
          <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light">
            <span className="text-muted">Last price:</span>
            <span className="fw-bold">{formatUSD(statistics?.data?.statistics?.lastPrice)}</span>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light">
            <span className="text-muted">BTC volume:</span>
            <span>{formatBTC(statistics?.data?.statistics?.btcVolume)}</span>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light">
            <span className="text-muted">USD volume:</span>
            <span>{formatUSD(statistics?.data?.statistics?.usdVolume)}</span>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light">
            <span className="text-muted">High:</span>
            <span className="text-success">{formatUSD(statistics?.data?.statistics?.high)}</span>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light">
            <span className="text-muted">Low:</span>
            <span className="text-danger">{formatUSD(statistics?.data?.statistics?.low)}</span>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light">
            <span className="text-muted">User USD balance:</span>
            <span>{formatUSD(user?.usdBalance)}</span>
          </ListGroup.Item>
          
          <ListGroup.Item className={`d-flex justify-content-between align-items-center bg-light ${lastItemClass}`}>
            <span className="text-muted">User BTC balance:</span>
            <span>{formatBTC((user?.btcBalance))}</span>
          </ListGroup.Item>
        </ListGroup>
      )}
    </div>
  );
}