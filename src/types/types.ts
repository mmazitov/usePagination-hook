/**
 * Options for the useFetch hook.
 * @property save - Enables caching when set to true.
 * @property savingMethod - Chooses the save storage. Options:
 *    - 'session': Uses sessionStorage.
 *    - 'local': Uses localStorage.
 *    - 'cache': Uses Cache Storage.
 * Default savingMethod is 'cache'.
 */
export interface UseFetchOptions {
	save?: boolean;
	savingMethod?: 'session' | 'local' | 'cache';
}

/**
 * Options for the usePagination hook.
 * @property getUrl - Function to generate the URL for fetching data.
 * @property page - The current page number.
 * @property itemsSize - The number of items per page.
 * @property pagesLength - The total number of pages. *
 * Defaults:
 * 	itemsLength = 5,
 * 	pagesLength = 5
 */
export interface UsePaginateOption {
	getUrl: (page: number, itemSize: number) => string;
	itemsLength?: number;
	pagesLength?: number;
}
