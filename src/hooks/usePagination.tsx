import { useCallback, useEffect, useMemo, useState } from 'react';
import { UseFetchOptions, UsePaginateOption } from '../types/types';

import useFetch from './useFetch';

/**
 * usePagination hook for paginating data fetched from an API.
 * Supports optional saving through the useFetch hook.
 *
 * @param getUrl - Function to generate the URL for the API request based on the current page and page size.
 * @param option - Configuration options for pagination.
 * @param useFetchOptions - Optional configuration options for the useFetch hook.
 *
 * Example usage:
 * const { data, loading, error, nextPage, prevPage } = usePagination(getUrl, { itemsLength: 5, pagesLength: 10 });
 *
 * Example with localStorage saving:
 * const { data, loading, error, nextPage, prevPage } = usePagination(getUrl, { itemsLength: 5, pagesLength: 10 }, { save: true, savingMethod: 'local' });
 */
function usePagination(
	getUrl: (page: number, pageSize: number) => string,
	option: Omit<UsePaginateOption, 'getUrl'>,
	useFetchOptions?: UseFetchOptions,
) {
	// State to keep track of the current page
	const [page, setPage] = useState(0);
	const { itemsLength = 5, pagesLength = 5 } = option;

	// Memoized URL based on the current page and items length
	const url = useMemo(
		() => getUrl(page, itemsLength),
		[page, itemsLength, getUrl],
	);

	// Fetch data using the useFetch hook
	const { data, loading, error, refetch } = useFetch(url, useFetchOptions);

	// Refetch data whenever the page changes
	useEffect(() => {
		refetch();
	}, [page, refetch]);

	// Function to go to the next page
	const nextPage = useCallback(() => {
		setPage((prevPage) => Math.min(prevPage + 1, pagesLength - 1));
	}, [pagesLength]);

	// Function to go to the previous page
	const prevPage = useCallback(() => {
		setPage((prevPage) => Math.max(prevPage - 1, 0));
	}, []);

	// Function to go to the first page
	const firstPage = useCallback(() => {
		setPage(0);
	}, []);

	// Function to go to the last page
	const lastPage = useCallback(() => {
		setPage(pagesLength - 1);
	}, [pagesLength]);

	// Determine if the next button should be disabled
	const isNextDisabled = useMemo(
		() => loading || page === pagesLength - 1,
		[loading, page, pagesLength],
	);

	// Determine if the previous button should be disabled
	const isPrevDisabled = useMemo(() => loading || page === 0, [loading, page]);

	// Text representation of the total number of pages
	const pagesLengthText = pagesLength > 1 ? `${pagesLength}` : '1';

	// Text representation of the current page
	const curPageText = page + 1;

	return {
		data,
		loading,
		error,
		nextPage,
		prevPage,
		page,
		itemsLength,
		pagesLength,
		pagesLengthText,
		curPageText,
		isPrevDisabled,
		isNextDisabled,
		firstPage,
		lastPage,
	};
}

export default usePagination;
