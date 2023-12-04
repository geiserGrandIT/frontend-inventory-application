<script>
	import { onMount } from 'svelte';
	import { baseURL } from '../../config.js';
	import axios from 'axios';
	import Item from '../../components/Item.svelte';
	import ItemCrud from './ItemCrud.svelte';
	import Success from '../../components/success.svelte';
	let data = [];
	let updatedItems = {};
	const changeAmount = new Map();
	let open = false;
	let editingItem = null;
	// Gather Data
	//------------------------------------------------------------
	const fetchData = async () => {
		try {
			const response = await axios.get(baseURL() + '/items/');
			console.log(response);
			data = [...response.data];
			selectedData = [...data];
			
		} catch (error) {
			console.error('Error fetching data: ', error);
		}
	};
	onMount(() => {
		fetchData();
		
	});
	const submitChange = ({id, amount, min}) => {
		console.log("submitting change",id, amount, min);
		return axios.patch(`${baseURL()}/items/${id}/`, {
			'change-amount': `${amount}`,
			'is-audit': 'True',
			'change-min':`${min}`
		});
	};
	$ : {
		data;
		selectedData;
	}
	let showSuccess = false;
	const handleUpdate = (item, amount, minqty)=>{
		console.log('handleUpdate',item, amount, minqty)
		const d = {id:item,amount:amount,min:minqty }
		updatedItems[item] = d;
		//submitChange(d);
	}
	const openCrud = (item) =>{
		editingItem = item;
		open = true;
	}
	const saveAll = ()=>{
		console.log("saveAll");
		for (const id in updatedItems){
			submitChange(updatedItems[id]);
		}
		fetchData();
	}
	const sortByName = () => {
		console.log('sortingByName');

		selectedData = [...selectedData].sort((a, b) => a.name.localeCompare(b.name));
		console.log(selectedData);
	};
	const sortByStock = () => {
		selectedData = [...selectedData].sort((a, b) => a.quantity - b.quantity);
	};
	const sortByMinStock = () => {
		selectedData = [...selectedData].sort((a, b) => a.min_quantity - b.min_quantity);
	};
	const sortByCategory = () => {
		selectedData = data?.sort((a, b) => a.category.name.localeCompare(b.category.name));
	};
	const selectDataByDNR = () => {
		17
		selectedData = data?.filter((a) => !a.cancelled);

	};

	const ascentIcon = `<svg width="50" height="10" xmlns="http://www.w3.org/2000/svg">
  <line x1="10" y1="20" x2="190" y2="20" stroke="black" stroke-width="2" />
  <line x1="10" y1="50" x2="190" y2="50" stroke="black" stroke-width="1.5" />
  <line x1="10" y1="80" x2="190" y2="80" stroke="black" stroke-width="1" />
</svg>
`;
	let buttonCSS = 'shadow-md max-h-[2em] min-w-[4em] px-[4px] py-[2px] mb-[4px] rounded  ';
	let inactiveCSS = 'bg-gray-200 ';
	let selectedCSS = 'bg-red-300';
	let SaveAllCSS =
		'rounded bg-blue-500 shadow-md max-h-[2em] mt-[8em] min-w-4[em] px-[4px] py-[2px] text-white';
	let ascendingCSS = '';
	let stockCSS = '';
	let DNRCSS = '';
	$: {
		ascendingCSS = buttonCSS + ('Ascending' !== ascentText ? selectedCSS : inactiveCSS);
		stockCSS = buttonCSS + (lowWarning ? selectedCSS : inactiveCSS);
		DNRCSS = buttonCSS + (!isDNR ? selectedCSS : inactiveCSS);
		data;
		selectedData;
		ItemList;
	}
	$: {
	}
	let selectedData = [];
	let ascentText = 'Ascending';
	let lowWarning = false;
	let ItemList;
	let isDNR = true;
	const toggleWarning = () => {
		lowWarning = !lowWarning;
		if (lowWarning) {
			selectDataByWarning();
		} else {
			resetSelection();
		}
	};
	const toggleDNR = () => {
		isDNR = !isDNR;
		if (!isDNR) {
			selectDataByDNR();
		} else {
			resetSelection();
		}
	};
	const selectDataByWarning = () => {
		selectedData = data.filter((item) => item.quantity < item.min_quantity);
	};
	const resetSelection = () => {
		selectedData = [...data];
	};
	const reverseData = () => {
		ascentText = ascentText === 'Ascending' ? 'Descending' : 'Ascending';
		ItemList.classList.toggle('flex-col');
		ItemList.classList.toggle('flex-col-reverse');
	};
	let searchValue = "";
	$ : {
		searchValue;
		handleSearch();
	}
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

	const handleSearch = () =>{
		let failed = false;
		selectedData = [];
		let arr = [];
		console.log('search', searchValue.split(' '));
		const allSearch = searchValue.split(' ');
		for (const termIdx in allSearch) {
			console.log(allSearch[termIdx]);
			arr.push(filter(allSearch[termIdx]));
		}
		selectedData = [...new Set(arr.flat())];

		console.log(selectedData);
		if (selectedData.length === 0) {
			failed = searchValue === '' ? false : true;
			selectedData = data;
			resetSelection();
		}
	}
	const heads = {
		'Name': sortByName,
		'Stock': sortByStock,
		'Minimum stock': sortByMinStock,
		'Category': sortByCategory
	};
	const spaceBetween = 'justify-content:space-around';
	let isFocused = false;
	$: {
		isFocused;
	}
	const searchFocused = () =>{
		isFocused = true;
	}
	const searchUnFocused = () =>{
		isFocused = false;
	}
	const handleSuccessChange = () =>{

	}
	const handleCreateNew = () =>{
		openCrud(null);
	}
</script>

<svelte:head>
	<title>DashBoard</title>
	<meta name="description" content="About this app" />
</svelte:head>
<div class="flex flex-row">
	<div class="flex flex-row justify-center centeri-items">
		<div class="fixed flex flex-col mt-[8em] mr-[14em] justify-center center-items">
			<button class={ascendingCSS} on:click={reverseData}>{ascentText}</button>
			<button class={stockCSS} on:click={toggleWarning}>Show Only Low Stock</button>
			<button class={DNRCSS} on:click={toggleDNR}
				>{!isDNR ? 'Show' : 'Remove'} Do Not Reorder</button
			>
			<div class="relative flex-row flex  justify-center center-items"><input class="rounded shadow-md p-[2px]" bind:value={searchValue} on:focus={searchFocused} on:focusout={searchUnFocused}/> <div class={isFocused ? "absolute opacity-0" : "absolute opacity-50"}>🔍</div></div>
			<button class={SaveAllCSS} on:click={saveAll}>Save All</button>
			<button class={'ounded bg-green-500 shadow-md max-h-[2em] mt-[8em] min-w-4[em] px-[4px] py-[2px] text-white '} on:click={handleCreateNew}>Create New</button>
		</div>
	</div>
	<div class="min-w-[60%] pt-[1em] justify-center center-items flex flex-row">
		<table class="flex flex-col flex-wrap">
			<div class="flex flex-row">
				<div class="w-[50px] bg-gray-400" />
				{#each Object.keys(heads) as head}
					<th class="min-w-[10em] bg-gray-400 text-center">
						<button on:click={heads[head]}>{head}</button>
					</th>
					<p class="bg-gray-400">|</p>
				{/each}
			</div>
			<div id="ItemList" bind:this={ItemList} class="flex flex-col-reverse">
				{#each selectedData as item (item.id)}
					<div class="flex flex-row center-items justify-center">
						<Item bind:item={item} onUpdate={(item, amount, minqty) => handleUpdate(item, amount, minqty)}/><button
							class="rounded bg-gray-200 shadow-md mt-[8px] max-h-[2em] min-w-[4em]"
							on:click={() => openCrud(item)}>edit</button
						>

					</div>
				{/each}
			</div>
		</table>
	</div>

		 {#if open}
		<div  class={"fixed w-[100vw] h-[100vh] top-0 left-0"} > 
			<div class="w-[100vw] h-[100vh] bg-gray-200 opacity-80 z-1 top-0 left-0 absolute" on:click={()=>{open=false}}/>
					<ItemCrud refresh={()=>{fetchData();showSuccess = true; open = !open}} item={editingItem}/>
					
		</div>
		 {:else}<div></div> {/if} 
		 {#if showSuccess}
			<Success bind:show={showSuccess} />
		{/if}
</div>
