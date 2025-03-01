import './App.css';

import usePagination from './hooks/usePagination';

const getUrl = (page: number, itemsLength: number) =>
	`https://cataas.com/api/cats?limit=${itemsLength}&skip=${page * itemsLength}`;

const App = () => {
	const {
		data,
		loading,
		nextPage,
		prevPage,
		pagesLengthText,
		curPageText,
		isPrevDisabled,
		isNextDisabled,
		firstPage,
		lastPage,
	} = usePagination(
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

	return (
		<div className="p-2 App">
			<h1>Cat List</h1>
			<p>Pages Length {pagesLengthText}</p>
			<p>Current Page {curPageText}</p>
			<div className="flex gap-1">
				<button
					className="bg-slate-500 disabled:bg-gray-400 p-2 rounded-lg text-white"
					disabled={isPrevDisabled}
					onClick={firstPage}
				>
					first page
				</button>
				<button
					className="bg-slate-500 disabled:bg-gray-400 p-2 rounded-lg text-white"
					disabled={isPrevDisabled}
					onClick={prevPage}
				>
					prev page
				</button>
				<button
					className="bg-slate-500 disabled:bg-gray-400 p-2 rounded-lg text-white"
					disabled={isNextDisabled}
					onClick={nextPage}
				>
					next page
				</button>
				<button
					className="bg-slate-500 disabled:bg-gray-400 p-2 rounded-lg text-white"
					disabled={isNextDisabled}
					onClick={lastPage}
				>
					last page
				</button>
			</div>
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
		</div>
	);
};

export default App;
