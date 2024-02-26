<script>
    import {createEventDispatcher} from 'svelte';
export let divisions;
console.log('divisions:',divisions);
const dispatch = createEventDispatcher();
const setDivision = (name) =>{
    console.log(name);
 dispatch('messageEvent', name)
}

</script>
{#if divisions}
<div class='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center flex-col'>
    <div class='bg-white min-w-[400px] min-h-[400px] flex justify-center items-center flex-col rounded'>
        <span class='my-1 text-xl'>Select Department</span>
        <span class='w-[21ch] mb-3 border-b'/>
    {#each divisions as division}
        <button class="my-2 lg-2 rounded border min-w-[80px] bg-blue-700 text-white text-center p-[8px] hover:pointer" on:click={()=>setDivision(division.name)}>{division.name}</button>
    {/each}
</div>
</div>
{/if}