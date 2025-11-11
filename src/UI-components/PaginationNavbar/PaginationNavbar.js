const PaginationNavbar = ({
  currentPage,
  totalItems,
  itemsPerPage,
  CMSContent,
  setNewPaginationIndex,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const window = 1; // neighbors on each side
  const start = Math.max(1, currentPage - window);
  const end = Math.min(totalPages, currentPage + window);

  const items = [];
  if (start > 1) items.push(1);
  if (start > 2) items.push("…");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 1) items.push("…");
  if (end < totalPages) items.push(totalPages);

  const hasNextPage = totalItems - currentPage * itemsPerPage > 0;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="mb-6 md:mb-8 mt-4 flex gap-2 justify-center items-center">
      {hasPrevPage && (
        <button
          onClick={setNewPaginationIndex(currentPage - 1)}
          className="font-semibold underline"
        >
          {CMSContent.PrevPageText}
        </button>
      )}

      {items.map((it, i) =>
        it === "…" ? (
          <p key={`pag${i}`}>...</p>
        ) : (
          <button
            onClick={setNewPaginationIndex(it)}
            className="bg-purple text-white px-3 py-1 rounded"
            key={it}
          >
            {it}
          </button>
        )
      )}

      {hasNextPage && (
        <button
          onClick={setNewPaginationIndex(currentPage + 1)}
          className="font-semibold underline"
        >
          {CMSContent.NextPageText}
        </button>
      )}
    </div>
  );
};

export default PaginationNavbar;
