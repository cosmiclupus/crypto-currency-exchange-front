import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import globalMatchService, { GlobalMatch } from '../../services/globalMatch.service';
import DataCard from '../shared/DataCard';

// Interface for component props
interface GlobalMatchesProps {
  initialData?: GlobalMatch[];
  itemsPerPage?: number;
}

/**
 * GlobalMatches component displays a table of the most recent trading matches
 * with pagination support, showing the most recent matches first
 */
export default function GlobalMatches({ 
  initialData, 
  itemsPerPage = 10 
}: GlobalMatchesProps) {
  const [matches, setMatches] = useState<GlobalMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    if (initialData) {
      setMatches(initialData);
      setTotalPages(Math.max(1, Math.ceil(initialData.length / itemsPerPage)));
      setLoading(false);
      return;
    }

    const fetchGlobalMatches = async () => {
      try {
        setLoading(true);
        const response = await globalMatchService.getGlobalMatches();
        
        if (response.success) {
          const matchesData = Array.isArray(response.data?.data?.matches) 
            ? response.data.data.matches 
            : [];
          
          setMatches(matchesData);
          
          const calculatedPages = Math.max(1, Math.ceil(matchesData.length / itemsPerPage));
          setTotalPages(calculatedPages);
          setError(null);
        } else {
          setError(response.message || 'Failed to load matches');
        }
      } catch (error: any) {
        console.error('Error fetching global matches:', error);
        setError('Failed to load global matches');
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalMatches();
    
    const interval = setInterval(fetchGlobalMatches, 10000);
    
    return () => clearInterval(interval);
  }, [initialData, itemsPerPage]);

  const formatUSD = (value: number): string => {
    return `US$ ${value.toFixed(0)}`;
  };

  const formatBTC = (value: number): string => {
    return `BTC ${value.toFixed(3)}`;
  };

  const getCurrentPageItems = (): GlobalMatch[] => {
    if (!matches || !Array.isArray(matches) || matches.length === 0) {
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
    </tr>
  );

  const tableBody = (
    <>
      {hasItems ? (
        currentItems.map(match => (
          <tr key={match.id}>
            <td className="px-4">{match.formattedPrice || formatUSD(match.price)}</td>
            <td className="px-4">{match.formattedVolume || formatBTC(match.volume)}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={2} className="text-center py-3">
            <em>No matches found</em>
          </td>
        </tr>
      )}
      {matches.length > 0 && matches.length < 5 && Array(5 - matches.length).fill(0).map((_, index) => (
        <tr key={`empty-${index}`} style={{ height: "43px" }}>
          <td></td>
          <td></td>
        </tr>
      ))}
    </>
  );

  return (
    <DataCard
      title="Global matches"
      loading={loading}
      error={error}
      loadingMessage="Loading global matches..."
      tableHeaders={tableHeaders}
      tableBody={tableBody}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      noBodyPadding={true}
    />
  );
}