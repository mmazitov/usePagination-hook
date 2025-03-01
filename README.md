<h1>usePagination Hook</h1>

<h2>Description</h2>

<code>usePagination</code> is a custom React hook for paginating API data. It works alongside the <code><a href="https://github.com/mmazitov/useFetch-hook">useFetch</a></a></code> hook to fetch paginated data while managing loading, data, and error states.

<h2>Installation</h2>
Ensure that axios is installed in your project as it's required for <code><a href="https://github.com/mmazitov/useFetch-hook">useFetch</a></a></code>: <br/>
<code>npm install axios</code> <br />
Then, import the hook into your component: <br />
<code>import usePagination from './hooks/usePagination';</code>

<h2>Usage</h2>
<h3>Basic Example</h3>

```
const { data, loading, error, nextPage, prevPage } = usePagination(
	(page, size) => `https://api.example.com/data?page=${page}&size=${size}`,
	{ itemsLength: 5, pagesLength: 10 }
);
```

<h3>Example with Local Storage Saving</h3>

```
const { data, loading, error, nextPage, prevPage } = usePagination(
	(page, size) => `https://api.example.com/data?page=${page}&size=${size}`,
	{ itemsLength: 5, pagesLength: 10 },
	{ save: true, savingMethod: 'local' }
);
```

<h2>API</h2>
<h3>Parameters</h3>
usePagination(getUrl, option, useFetchOptions?)

- <code>getUrl: (page: number, pageSize: number) => string</code> - Function to generate the API request URL based on the current page and page size.
- <code>option: UsePaginateOption</code> - Configuration options for pagination:<br/>
  - <code>itemsLength: number</code> (default: <code>5</code>) - Number of items per page.<br/>
  - <code>pagesLength: number</code> (default: <code>5</code>) - Total number of pages.
- <code>useFetchOptions?: UseFetchOptions</code> - Optional configuration for useFetch:<br/>
  - <code>save?: boolean</code>> - Enables caching when set to <code>true</code>.
  - <code>savingMethod?: 'session' | 'local' | 'cache'</code> - Specifies the storage type for caching (<code>sessionStorage</code>, <code>localStorage</code>, or <code>Cache Storage</code>). Default is <code>cache</code>.

<h3>Return Value</h3>
The hook returns an object with the following properties:

- <code>data: T | null</code> - The fetched paginated data.
- <code>loading: boolean</code> - Indicates whether data is being loaded.
- <code>error: Error | null</code> - Stores any request errors.
- <code>nextPage: () => void</code> - Moves to the next page.
- <code>prevPage: () => void</code> - Moves to the previous page.
- <code>firstPage: () => void</code> - Moves to the first page.
- <code>lastPage: () => void</code> - Moves to the last page.
- <code>page: number</code> - The current page number.
- <code>itemsLength: number</code> - The number of items per page.
- <code>pagesLength: number</code> - The total number of pages.
- <code>pagesLengthText: string</code> - Text representation of the total number of pages.
- <code>curPageText: string</code> - Text representation of the current page.
- <code>isPrevDisabled: boolean</code> - Indicates whether the previous button should be disabled.
- <code>isNextDisabled: boolean</code> - Indicates whether the next button should be disabled.

<h2>Example Usage in a Component</h2>

```
import React from 'react';
import usePagination from './hooks/usePagination';

const getUrl = (page: number, itemsLength: number) =>
	`https://cataas.com/api/cats?limit=${itemsLength}&skip=${page * itemsLength}`;

const PaginatedList: React.FC = () => {
  const { data, loading, error, nextPage, prevPage, isPrevDisabled,  isNextDisabled } = usePagination(
    getUrl,
    {
      itemsLength: 2,
      pagesLength: 20,
    },
    {
      save: true,
      savingMethod: 'cache',
    },
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
	  <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="flex">
          {data?.map((cat: any) => (
            <li key={cat.id}>
              <img
                className="w-[300px] h-[300px]"
                src={`https://cataas.com/cat/${cat.id}`}
                alt={cat.tags.join(', ')}
              />
            </li>
          ))}
        </ul>
      )}
      <button onClick={prevPage} disabled={isPrevDisabled}>Previous</button>
      <button onClick={nextPage} disabled={isNextDisabled}>Next</button>
    </div>
  );
};

export default PaginatedList;

```

<h2>How It Works</h2>

- The <code>usePagination</code> hook initializes with the first page and fetches data using the <code>useFetch</code> hook.
- Whenever <code>nextPage</code> or <code>prevPage</code> is called, the page number updates, triggering a new data fetch.
- Pagination buttons are automatically disabled when reaching the first or last page.

<h2>Contributing</h2>

Contributions are welcome! Please feel free to submit a pull request or open an issue if you encounter any bugs or have feature requests.
