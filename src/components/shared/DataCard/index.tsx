import React from 'react';
import { Card, Table, Alert, Spinner, Button } from 'react-bootstrap';

interface DataCardProps {
  title: string;
  loading: boolean;
  error: string | null;
  children?: React.ReactNode;
  loadingMessage?: string;
  tableHeaders?: React.ReactNode;
  tableBody?: React.ReactNode;
  footerContent?: React.ReactNode;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  noBodyPadding?: boolean;
}

/**
* Standardized card component for displaying data
* Used to maintain visual consistency between different sections of the application
*/
export default function DataCard({
  title,
  loading,
  error,
  children,
  loadingMessage = "Loading data...",
  tableHeaders,
  tableBody,
  footerContent,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  noBodyPadding = false
}: DataCardProps) {
  const cardMinHeight = "520px"; 
  
  return (
    <div className="order-forms bg-light rounded overflow-hidden shadow-sm">
      <div className="bg-primary text-white fw-bold p-3 pb-2 pt-2 text-center">
        {title}
      </div>
      
      <div className={noBodyPadding ? "p-0" : "p-4"} style={{ minHeight: cardMinHeight }}>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0">{loadingMessage}</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="m-3">
            {error}
          </Alert>
        ) : (
          <>
            {tableHeaders && tableBody && (
              <Table responsive striped hover className="mb-0">
                <thead>
                  {tableHeaders}
                </thead>
                <tbody>
                  {tableBody}
                </tbody>
              </Table>
            )}
            
            {children}
          </>
        )}
      </div>
    </div>
  );
}