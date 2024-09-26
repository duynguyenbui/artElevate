import React, { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export const PaginationApp = ({
  currentPage,
  pageCount,
  onPageChange,
}: PaginationProps) => {
  const [pageNumber, setPageNumber] = useState(1);

  const handlePrevious = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setPageNumber(newPage);
      onPageChange(newPage);
    }
  };

  const handleNext = () => {
    if (currentPage < pageCount) {
      const newPage = currentPage + 1;
      setPageNumber(newPage);
      onPageChange(newPage);
    }
  };
  const handleTo = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pageCount) {
      setPageNumber(pageNumber);
      onPageChange(pageNumber);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
      pages.push(
        <PaginationLink
          key={i}
          isActive={pageNumber == i}
          onClick={() => handleTo(i)}
        >
          {i}
        </PaginationLink>
      );
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrevious} />
        </PaginationItem>
        {pageCount > 0 ? renderPageNumbers() : <PaginationEllipsis />}
        <PaginationItem>
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
