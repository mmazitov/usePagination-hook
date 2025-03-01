import axios, { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { UseFetchOptions } from '../types/types';

/**
 * useFetch hook for fetching data from an API with optional saving.
 * Supports caching across three storage mechanisms: sessionStorage, localStorage, and Cache Storage.
 *
 * @param url - The URL for the API request.
 * @param options - Configuration options for the hook.
 *
 * Example without saving:
 * const { data, loading, error } = useFetch('https://api.example.com/data');
 *
 * Example with localStorage saving:
 * interface Cat { id: string }
 * const { data, loading, error } = useFetch<Cat[]>('https://api.example.com/cats', { save: true, savingMethod: 'local' });
 */
function useFetch<T = any>(url: string, options: UseFetchOptions = {}) {
	const { save = false, savingMethod = 'cache' } = options;
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<AxiosError | null>(null);

	/**
	 * Retrieves saved data from the specified storage method.
	 * @returns The saved data or null if not found.
	 */
	const getSavedData = async (): Promise<T | null> => {
		if (!save) return null;

		try {
			if (savingMethod === 'session') {
				const item = sessionStorage.getItem(url);
				if (item) {
					return JSON.parse(item) as T;
				}
			} else if (savingMethod === 'local') {
				const item = localStorage.getItem(url);
				if (item) {
					return JSON.parse(item) as T;
				}
			} else if (savingMethod === 'cache' && typeof caches !== 'undefined') {
				const cacheStorage = await caches.open('useFetchCache');
				const cachedResponse = await cacheStorage.match(new Request(url));
				if (cachedResponse) {
					return (await cachedResponse.json()) as T;
				}
			}
		} catch (cacheError) {
			console.error('Cache retrieval error:', cacheError);
		}
		return null;
	};

	/**
	 * Saves data to the specified storage method.
	 * @param dataToSave - The data to save.
	 */
	const setSavedData = async (dataToSave: T): Promise<void> => {
		if (!save) return;

		try {
			const dataString = JSON.stringify(dataToSave);
			if (savingMethod === 'session') {
				sessionStorage.setItem(url, dataString);
			} else if (savingMethod === 'local') {
				localStorage.setItem(url, dataString);
			} else if (savingMethod === 'cache' && typeof caches !== 'undefined') {
				const cacheStorage = await caches.open('useFetchCache');
				const responseToCache = new Response(dataString, {
					headers: { 'Content-Type': 'application/json' },
				});
				await cacheStorage.put(new Request(url), responseToCache);
			}
		} catch (cacheError) {
			console.error('Cache storage error:', cacheError);
		}
	};

	/**
	 * Fetches data from the API and handles saving if enabled.
	 */
	const fetchData = useCallback(async () => {
		// Attempt to retrieve saved data if saving is enabled.
		const savedData = await getSavedData();
		if (savedData !== null) {
			setData(savedData);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await axios.get<T>(url);
			setData(response.data);
			// Store data after successful fetch.
			if (save) {
				await setSavedData(response.data);
			}
		} catch (err) {
			setError(err as AxiosError);
		} finally {
			setLoading(false);
		}
	}, [url, save, savingMethod]);

	// Fetch data when the component mounts or the URL changes
	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
}

export default useFetch;
