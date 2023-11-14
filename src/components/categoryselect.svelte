<script>
	import axios from 'axios'
	import { onMount, createEventDispatcher } from 'svelte';
    import "../routes/styles.css"
	import { baseURL } from '../config';
    let data = [];
    const dispatch = createEventDispatcher();
    const sendCategory = (name = "") =>{
        dispatch('messageEvent',name);
    }

	async function fetchData(){
		try {
			const response = await axios.get(baseURL()+"/categories/");
            console.log(response);
			data = response.data;
		} catch (error) {
			console.error("Error fetching data:", error)
		}
	}
	onMount(() => {
		fetchData();
	})

    let isAuditMode = false;
    let mode = isAuditMode ? "Audit Mode" : "Update Mode";
    const handleChangeMode = () =>{
        isAuditMode = !isAuditMode
        mode = isAuditMode ? "Audit Mode" : "Update Mode";
    }
    
    
</script>

<div class=" w-[18em] flex flex-col justify-center">
    <h2 class=" text-3xl justify-center">Category</h2>
    <div class="flex flex-row justify-center items-center">
    <ul class="flex flex-col ">
        {#each data as item}
            <li class="bg-white text-2xl justify-center items-center rounded-lg rounded shadow-md m-[2px] pt-[.3em] min-h-[2em] px-[.5em]"><button on:click={() =>{sendCategory(item.name)}}>{item.name}</button></li>
        {/each}
    </ul>   
    </div>
</div>