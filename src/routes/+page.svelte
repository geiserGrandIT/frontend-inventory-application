<script>
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcome_fallback from '$lib/images/svelte-welcome.png';

	import CategorySelect from '../components/categoryselect.svelte';
	import ItemSelect from '../components/productselect.svelte';
	import axios from 'axios';
	import { baseURL } from '../config.js';
	import {onMount} from 'svelte';
	import Calculator from '../components/calculator.svelte';
	import Success from '../components/success.svelte';
	import Whois from '../components/whois.svelte';

	let currentPage = 0;
	let productSelection = '';
	let categoryselection = '';
	let amountSubmitted = '';
	let audit = {};
	let AuditMode = true;
	let adt = '';
	let showSuccess =false;

	let currentDivision = 0
	let divisionValue = null;
	

	// Information Fetching and setting
	//--------------------------------------------------------------------------------
	const setDivision=(value={})=>{console.log(value); divisionValue=value.detail; setCookie('division',value.detail);}
	let divisions;

	onMount(async ()=>{
		divisionValue = getCookie('division'); console.log('dV',divisionValue)
		if (!divisionValue) {divisions = await fetchDivisions(); console.log(divisions)}
	})

	function fetchDivisions(){
		return new Promise((res, rej) =>{axios.get(baseURL()+'/departments/')
			.then(result => res(result.data))
			.catch(err=>{rej(err)})
		})
	}

	const getCookie = (name='')=>{
		let nameEQ = name+"=";
		let ca = document.cookie.split(';');
		for (let i = 0; i < ca.length; i++){
			let c = ca[i];
			while (c.charAt(0) === ' ') {c = c.substring(1, c.length);}
			if (c.indexOf(nameEQ) === 0) {return c.substring(nameEQ.length, c.length);}

		}
		return null;
	}
	const setCookie = (name='', value='', days=999) =>{
		let expires = '';
		if (days){
			let date = new Date();
			date.setTime(date.getTime() + (days * 25 * 60 * 60 * 1000));
			expires = "; expires="+ date.toUTCString();
		}
		document.cookie = `${name}=${value}${expires}; path=/`;
	}
		
	// Page Handling
	//----------------------------------------------------------------------------------

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
		console.log("event detail:",event);
		if (AuditMode) {amountSubmitted=event.detail.amt.toString();}
		productSelection = event.detail.name;
		
		
	};
	
	// Backend Communication
	//----------------------------------------------------------

	const submitChange = (event) => {
		let amt = 0;
		// Obsolete Code AuditMode is always on
		
			try {amt = parseInt(amountSubmitted);}
				catch (err){console.log(err);}
		adt = AuditMode ? 'True' : 'False';
		
		//Sending info
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
	
    let mode = AuditMode ? "Set Mode" : "Subtract Mode";
    const handleChangeMode = () =>{
        AuditMode = !AuditMode
        mode = AuditMode ? "Set Mode" : "Subtract Mode";
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
			<div class=" w-[100%] h-[100%] flex flex-flow flex-row-reverse justify-between items-center">
				<!-- <div class="text-3xl bg-orange-200 rounded shadow p-[4px]">
					<button
						class="{AuditMode
							? 'bg-orange-200'
							: 'bg-white'} min-h-[6ch] text-2xl min-h-[1em] min-w-[5em] justify-center items-center rounded-lg rounded w-2 shadow-md m-[2px]"
						on:click={handleChangeMode}>{mode}</button
					>
				</div> -->
				{#if currentPage !== 0}
					<div>
						<button
							class="text-3xl bg-gray-100 my-2 rounded-full shadow px-[9px]"
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
	{#if !divisionValue}
		<Whois
			on:messageEvent={(name) => {
				setDivision(name);
			}}
			bind:divisions
		/>
	{/if}
	{#if showSuccess}
		<Success bind:show={showSuccess} />
	{/if}
</section>
