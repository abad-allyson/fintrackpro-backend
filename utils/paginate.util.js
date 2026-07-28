export function paginate({
  items = [],
  page = 0,
  limit = 10,
  length = 0,
} = {}) {
  if (length === 0) {
    return {
      items: [],
      currentPage: 0,
      totalPages: 0,
      totalItems: 0,
      pageRange: "0 of 0",
    };
  }

  const startIndex = page * limit + 1;
  const endIndex = Math.min(startIndex + limit - 1, length);

  return {
    items,
    currentPage: page + 1,
    totalPages: Math.ceil(length / limit),
    totalItems: length,
    pageRange: `${startIndex}-${endIndex} of ${length}`,
  };
}
