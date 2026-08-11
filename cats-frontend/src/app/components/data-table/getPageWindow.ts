export type PageWindowItem = number | 'ellipsis';

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, index) => start + index);

/**
 * Pure page-window math for pagination controls.
 * Returns page numbers and ellipsis markers for a numbered window around
 * `currentPage`, always anchoring first/last when the total is large enough.
 */
export const getPageWindow = (
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PageWindowItem[] => {
  if (totalPages <= 0) {
    return [];
  }

  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    return [...range(1, leftItemCount), 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    return [
      1,
      'ellipsis',
      ...range(totalPages - rightItemCount + 1, totalPages),
    ];
  }

  return [
    1,
    'ellipsis',
    ...range(leftSiblingIndex, rightSiblingIndex),
    'ellipsis',
    totalPages,
  ];
};
