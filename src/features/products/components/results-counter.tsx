interface ResultsCounterProps {
  currentPage: number
  perPage: number
  totalResults: number
}

export const ResultsCounter = ({
  currentPage,
  perPage,
  totalResults,
}: ResultsCounterProps) => {
  const start = (currentPage - 1) * perPage + 1
  const end = Math.min(currentPage * perPage, totalResults)

  return (
    <p className="text-sm text-gray-600">
      Showing {start}–{end} of {totalResults} results
    </p>
  )
}
