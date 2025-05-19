import Pagination from 'react-bootstrap/Pagination';

interface PaginationControlsProps {
  /**
   * Total number of pages
   */
  totalPages: number;
  
  /**
   * Current active page (starting from 1)
   */
  currentPage: number;
  
  /**
   * Function called when the page is changed
   * @param page Selected page number
   */
  onPageChange: (page: number) => void;
  
  /**
   * Maximum number of page buttons to display
   * @default 5
   */
  maxVisiblePages?: number;
  
  /**
   * Whether to show first and last page buttons
   * @default true
   */
  showEndButtons?: boolean;
  
  /**
   * Whether to show previous and next page buttons
   * @default true
   */
  showNavButtons?: boolean;
  
  /**
   * Size of pagination controls
   * @default undefined (medium size)
   */
  size?: 'sm' | 'lg';
  
  /**
   * Additional CSS class to apply to the component
   */
  className?: string;
  
  /**
   * Whether to display pages in a summarized version when there are many pages
   * Ex: 1 ... 4 5 6 ... 20 instead of showing all
   * @default true
   */
  useEllipsis?: boolean;
  
  /**
   * Whether to always show the pagination controls, even when there's only one page
   * @default false
   */
  alwaysShow?: boolean;
}

/**
 * A reusable pagination control component
 * Can be used in any context that requires pagination
 */
export default function PaginationControls({
  totalPages,
  currentPage,
  onPageChange,
  maxVisiblePages = 5,
  showEndButtons = true,
  showNavButtons = true,
  size,
  className = '',
  useEllipsis = true,
  alwaysShow = false
}: PaginationControlsProps) {
  // Don't render anything if there are no pages
  if (totalPages < 1) {
    return null;
  }
  
  // For single page scenario, check if we should show or not
  if (totalPages === 1 && !alwaysShow) {
    return null;
  }

  // Ensure currentPage is within valid range
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  if (validCurrentPage !== currentPage) {
    setTimeout(() => onPageChange(validCurrentPage), 0);
    return null;
  }

  // Event handlers with debugging
  const handleFirstPage = () => {
    onPageChange(1);
  };
  
  const handlePrevPage = () => {
    const prev = Math.max(currentPage - 1, 1);
    onPageChange(prev);
  };
  
  const handleNextPage = () => {
    const next = Math.min(currentPage + 1, totalPages);
    onPageChange(next);
  };
  
  const handleLastPage = () => {
    onPageChange(totalPages);
  };
  
  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Determine which pages to display
  const getDisplayedPages = () => {
    const pages: number[] = [];
    
    if (!useEllipsis || totalPages <= maxVisiblePages) {
      // Display all pages if not using ellipsis or if there are few pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Use strategy with ellipsis for many pages
      let startPage: number;
      let endPage: number;
      
      // If we're near the beginning
      if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
        startPage = 1;
        endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
        pages.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
        
        if (totalPages > maxVisiblePages - 1) {
          pages.push(-1); // Right ellipsis
          pages.push(totalPages);
        }
      }
      // If we're near the end
      else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        startPage = Math.max(totalPages - maxVisiblePages + 2, 2);
        endPage = totalPages;
        
        pages.push(1);
        if (startPage > 2) {
          pages.push(-1); // Left ellipsis
        }
        pages.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
      }
      // If we're in the middle
      else {
        const offset = Math.floor((maxVisiblePages - 3) / 2);
        startPage = currentPage - offset;
        endPage = currentPage + offset;
        
        pages.push(1);
        if (startPage > 2) {
          pages.push(-1); // Left ellipsis
        }
        pages.push(...Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i));
        if (endPage < totalPages - 1) {
          pages.push(-1); // Right ellipsis
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const displayedPages = getDisplayedPages();

  return (
    <Pagination size={size} className={className}>
      {/* First page and previous buttons */}
      {showEndButtons && (
        <Pagination.First onClick={handleFirstPage} disabled={currentPage === 1} />
      )}
      {showNavButtons && (
        <Pagination.Prev onClick={handlePrevPage} disabled={currentPage === 1} />
      )}
      
      {/* Page numbers */}
      {displayedPages.map((page, index) => 
        page === -1 ? (
          // Ellipsis
          <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />
        ) : (
          // Page number
          <Pagination.Item 
            key={page} 
            active={page === currentPage}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </Pagination.Item>
        )
      )}
      
      {/* Next and last page buttons */}
      {showNavButtons && (
        <Pagination.Next onClick={handleNextPage} disabled={currentPage === totalPages} />
      )}
      {showEndButtons && (
        <Pagination.Last onClick={handleLastPage} disabled={currentPage === totalPages} />
      )}
    </Pagination>
  );
}