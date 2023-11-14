<script>
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	import CategorySelect from '../components/categoryselect.svelte';
	import ItemSelect from '../components/productselect.svelte';
	import axios from 'axios';
	import { baseURL } from '../config.js';
	import Calculator from '../components/calculator.svelte';
	import Success from '../components/success.svelte';

	let currentPage = 0;
	let productSelection = '';
	let categoryselection = '';
	let amountSubmitted = '';
	let audit = {};
	let AuditMode = false;
	let adt = '';
	let showSuccess =false;
	function changePage(num = 0) {
		currentPage = num;
		console.log(currentPage);
	}
	const selectCategory = (event) => {
		changePage(1);
		categoryselection = event.detail;
	};
	const selectProduct = (event) => {
		changePage(2);
		productSelection = event.detail;
	};
	const submitChange = (event) => {
		let amt = 0;
		console.log(AuditMode);
		if (AuditMode) {
			try {
				amt = parseInt(amountSubmitted);
			} catch (err) {
				console.error(err);
				return null;
			}
		} else {
			try {
				amt -= parseInt(amountSubmitted);
			} catch (err) {
				console.error(err);
				return null;
			}
		}
		adt = AuditMode ? 'True' : 'False';
		console.log(`${baseURL()}/items/${productSelection}`);
		const response = axios
			.patch(`${baseURL()}/items/${productSelection}/`, {
				'change-amount': amt.toString(),
				'is-audit': adt
			})
			.then((resp) => {
				
				changePage(1);
				showSuccess = true;
			})
			.catch((err) => console.error(err));
		console.log(response);
	};
	
    let mode = AuditMode ? "Audit Mode" : "Update Mode";
    const handleChangeMode = () =>{
        AuditMode = !AuditMode
        mode = AuditMode ? "Audit Mode" : "Update Mode";
    }
    
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>
<section class="">
<div class="mt-[2em] flex flex-row justify-center items-center">
	
	<div
		class="flex flex-flow flex-col items-center min-w-[320px] justify-center shadow-md p-2 rounded"
	>
		<div class=" w-[100%] h-[100%]  flex flex-flow  flex-row-reverse justify-between items-center">
			
			<div class="text-3xl  bg-orange-200 rounded shadow p-[4px]">
				<button class="{AuditMode ? "bg-orange-200" : "bg-white"} text-2xl min-h-[1em] min-w-[5em] justify-center items-center rounded-lg rounded w-2 shadow-md m-[2px] " on:click={handleChangeMode}>{mode}</button>
			</div>
			{#if currentPage !== 0}
			<div>
				<button
					class="text-3xl   bg-gray-100 my-2 rounded-full shadow px-[9px]"
					on:click={() => {
						changePage(currentPage - 1);
					}}>&lt;</button
				>
			</div>
			{/if}
		</div>
		{#if currentPage === 0}
			<CategorySelect
				
				on:messageEvent={(event) => {
					selectCategory(event);
				}}
			/>
		{/if}
		{#if currentPage === 1}
			<ItemSelect
				on:messageEvent={(event) => {
					selectProduct(event);
				}}
				message={categoryselection}
			/>
		{/if}
		{#if currentPage === 2}
			<Calculator bind:value={amountSubmitted} on:messageEvent={submitChange} />
		{/if}
		<ul />
	</div>
</div>
{#if showSuccess}
<Success bind:show={showSuccess} />
{/if}
</section>