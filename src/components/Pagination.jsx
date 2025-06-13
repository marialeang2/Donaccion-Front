import React from "react";
import { Pagination as BsPagination } from "react-bootstrap";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxPages = 5,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = Math.floor(maxPages / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, start + maxPages - 1);

    if (end - start + 1 < maxPages) {
      start = Math.max(1, end - maxPages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div data-testid="pagination" className="d-flex justify-content-center">
      <BsPagination>
        <BsPagination.First
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        />
        <BsPagination.Prev
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {visiblePages[0] > 1 && (
          <>
            <BsPagination.Item onClick={() => onPageChange(1)}>
              1
            </BsPagination.Item>
            {visiblePages[0] > 2 && <BsPagination.Ellipsis />}
          </>
        )}

        {visiblePages.map((page) => (
          <BsPagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </BsPagination.Item>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <BsPagination.Ellipsis />
            )}
            <BsPagination.Item onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </BsPagination.Item>
          </>
        )}

        <BsPagination.Next
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <BsPagination.Last
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </BsPagination>
    </div>
  );
};

export default Pagination;
