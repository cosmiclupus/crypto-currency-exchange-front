import React, { useEffect, useState } from 'react';
import matchService from '../../services/match.service';
import DataCard from '../shared/DataCard';

interface Match {
  id: string;
  price: number;
  volume: number;
  type: 'buy' | 'sell';
  timestamp: string;
  formattedPrice: string;
  formattedVolume: string;
}

interface MyHistoryProps {
  itemsPerPage?: number;
}

/**
 * Component that displays the user's history of recent matches
 */
export default function MyHistory({ 
  itemsPerPage = 10 
}: MyHistoryProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalMatches, setTotalMatches] = useState<number>(0);

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        setLoading(true);
        
        const response = await matchService.getMatchHistory();
        
        const responseData = response.data
        if (response.success && responseData.data && responseData.data.matches) {
          
          setMatches(responseData.data.matches);
          
          setTotalMatches(responseData.data.total);
          setTotalPages(Math.ceil(responseData.data.total / itemsPerPage));
          
          setError(null);
        } else {
          console.error('Unexpected API response format:', responseData);
          setError('Unexpected response format');
          setMatches([]);
        }
      } catch (error: any) {
        console.error('Error fetching match history:', error);
        setError('Failed to retrieve match history');
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchHistory();
    
    const interval = setInterval(fetchMatchHistory, 10000);
    return () => clearInterval(interval);
  }, [itemsPerPage]);

  const getCurrentPageItems = (): Match[] => {
    if (!Array.isArray(matches) || matches.length === 0) {
      return [];
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return matches.slice(start, end);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentItems = getCurrentPageItems();
  const hasItems = currentItems.length > 0;

  const tableHeaders = (
    <tr>
      <th className="px-4">Price</th>
      <th className="px-4">Volume</th>
      <th className="px-4">Type</th>
    </tr>
  );

  const tableBody = (
    <>
      {hasItems ? (
        currentItems.map(match => (
          <tr key={match.id}>
            <td className="px-4">{match.formattedPrice}</td>
            <td className="px-4">{match.formattedVolume}</td>
            <td className="px-4">
              <span className={match.type === 'buy' ? 'text-success' : 'text-danger'}>
                {match.type.charAt(0).toUpperCase() + match.type.slice(1)}
              </span>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={3} className="text-center py-3">
            <em>No match history</em>
          </td>
        </tr>
      )}
      {matches.length > 0 && matches.length < 5 && Array(5 - matches.length).fill(0).map((_, index) => (
        <tr key={`empty-${index}`} style={{ height: "43px" }}>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      ))}
    </>
  );

  return (
    <DataCard
      title="My history"
      loading={loading}
      error={error}
      loadingMessage="Loading match history..."
      tableHeaders={tableHeaders}
      tableBody={tableBody}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      noBodyPadding={true}
    />
  );
}