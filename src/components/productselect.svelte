<script>
	import axios from 'axios';
	import { onMount, createEventDispatcher } from 'svelte';
	import { baseURL } from '../config.js';
	import ItemCard from './ItemCard.svelte';
	let data = [];
	export let message = '';

	let selectedData = [];
	let searchData = [];
	let filterData = [];
	const dispatch = createEventDispatcher();
	const sendItem = (name = '') => {
		dispatch('messageEvent', name);
	};

	async function fetchData() {
		try {
			const msg = `${baseURL()}/categories/${encodeURIComponent(message)}`;
			const response = await axios.get(msg);
			data = response.data;
			selectedData = data;
			filterData = data;
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}
	onMount(() => {
		fetchData();
	});
	let search = '';
	$: {
		search;
		handleSearch();
	}
	let failed = false;
	const handleSearch = () => {
		failed = false;
		console.log('searching', search);
		selectedData = [];
		let arr = [];
		console.log('search', search.split(' '));
		const allSearch = search.split(' ');
		for (const termIdx in allSearch) {
			console.log(allSearch[termIdx]);
			arr.push(filter(allSearch[termIdx]));
		}
		selectedData = [...new Set(arr.flat())];

		console.log(selectedData);
		if (selectedData.length === 0) {
			failed = search === '' ? false : true;
			selectedData = data;
			resetFilter();
		}
	};

	const handleChange = (event) => {
		search = event.target.value;
		handleSearch();
	};

	const filter = (searchTerm) => {
		const filteredData = data.filter((item) => {
			const nameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
			const tagMatch = item.tags.some((tag) => {
				const tagValue = tag.name.toLowerCase();
				return tagValue.includes(searchTerm.toLowerCase());
			});

			return nameMatch || tagMatch;
		});
		return filteredData;
	};

	let filtersVisible = false;

	const showFilters = (show) => {
		if (show) {
			filtersVisible = show;
			return;
		}
		filtersVisible = !filtersVisible;
	};

	let item_styling =
		' flex flex-col items-center pt-[5px] justify-center center-items bg-white rounded pt-.2em rounded-lg m-[4px] text-2xl shadow-md min-h-3 min-w-3';

	let warning_color = ' border-[#e33] border shadow shadow-[#e33] ';
	let isDNR = false;
	const sortDNR = () => {
		console.log('remving isDNR');
		isDNR = !isDNR;
		if (isDNR) {
			filterData = data?.filter((a) => !a.cancelled);
		} else {
			resetFilter();
		}
	};
	let isStock = false;
	const sortStock = () => {};
	let isName = false;
	const sortAscending = () => {
		filterData = selectedData?.sort((a, b) => a.name.localeCompare(b.name));
	};
	const resetFilter = () => {
		console.log('data:', data);
		filterData = data;
		console.log('filterData', filterData);
	};
</script>

<div class=" flex justify-center center-items">
	<div class="">
		<div class="flex flex-col justify-center center-items">
			<div class="mb-[.5em] mt-[1em] flex justify-center center-items">
				<input
					type="text"
					class="justify-center text-2xl"
					bind:value={search}
					on:change={handleChange}
				/>
				<button
					class="bg-blue-200 rounded rounded-lg m-[2px] min-h-[2em] min-w-[2em]"
					on:click={handleSearch}>🔍</button
				>
			</div>
			<div class="text-center text-red-300 text-xl">
				{failed ? `unable to find "${search}"` : ''}
			</div>
		</div>
		<div class="flex flex-row">
			<button
				class="rounded bg-orange-200 mx-[3px] shadow-sm p-[4px]"
				on:focus={() => showFilters(true)}
				on:blur={() => showFilters(false)}
				on:mouseover={showFilters}
				on:click={showFilters}
				>Filters {filtersVisible ? '▼' : '►'}
			</button>
		</div>
		{#if filtersVisible}
			<div
				class="relative"
				role="dialog"
				aria-label="dropdown"
				on:mouseleave={() => showFilters(false)}
			>
				<ul
					class="flex flex-col overflow-hidden absolute rounded-lg bg-white min-w-[8em] min-h-[1em]"
				>
					<button
						class=" py-[4px] transition duration 300 ease-in-out hover:bg-blue-300"
						on:click={()=>{sortDNR()}} on:touchstart={sortDNR}><li>{!isDNR ? 'Filter out DNR' : 'reset DNR'}</li></button
					>
					<!-- <button
						class=" py-[4px] transition duration 300 ease-in-out hover:bg-blue-300"
						on:click={sortStock}><li>lowStock</li></button
					>
					<button
						class=" py-[4px] transition duration 300 ease-in-out hover:bg-blue-300"
						on:click={sortAscending}><li>Name</li></button
					> -->
				</ul>
			</div>
		{/if}
		<ul class="flex justify-center center-items flex-row flex-wrap">
			{#each selectedData as item}
				{#if filterData.includes(item)}
					<button
						on:click={() => {
							sendItem(item.id);
						}}
					>
						<ItemCard {item} />
					</button>
				{/if}
			{/each}
		</ul>
	</div>
</div>

<style>
	@keyframes rotate-90 {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(90deg);
		}
	}
</style>
