<script>
	import { createEventDispatcher } from "svelte";
    import "../routes/styles.css" 
    console.log("lol");
    export let value = "";
    const dispatch = createEventDispatcher();
    const addNumber = (num=0) => {
        value += num.toString();
    }
    const removeNumber = () =>{
        value = value.slice(0,-1);
    }
    const clear = () =>{
        value=  "";
    }
    const submit = () =>{
            dispatch('messageEvent')
            setTimeout(()=>{
                value="";
            },500)
    }
    const incrementNumber = (num=1)=>{
        
        try{
            let v = Number(value);
            console.log(v)
            v -= num;
            v < 0 ? v = 0 : v;
            clear()
            addNumber(v.toString())
        }catch (err){
            console.log('unable to increment number to due ', err.message);
        }
        
    }
</script>

    <div class="max-w-[16em] flex flex-wrap flex-row items-center justify-center">
        <input type="text" class="my-[10px] min-w-[80%] pb-[3px] justify-center center-items align-center text-4xl" bind:value={value}/>
        <div class="flex flex-row items-center justify-between w-[90%]">
            <button class="min-h-[2em] min-w-[2em] shadow-md rounded-lg bg-white w-2 h-2 rounded m-[2px] text-4xl h-[2em] w-[2em]" on:click={() => incrementNumber(-1)}>+</button>
            <button class="min-h-[2em] min-w-[2em] shadow-md rounded-lg bg-white w-2 h-2 rounded m-[2px] text-4xl h-[2em] w-[2em]" on:click={() => incrementNumber(1)}>-</button>
        </div>
        <button class="justify-center min-h-[2em] min-w-[2em] shadow-md rounded-lg bg-white w-2 h-2 rounded m-[2px] text-4xl h-[2em] w-[2em]" on:click={() => addNumber(0)}>0</button>
        <button class="justify-center min-h-[2em] min-w-[2em] shadow-md rounded-lg bg-white w-2 h-2 rounded m-[2px] text-4xl h-[2em] w-[2em]" on:click={removeNumber}>🔙</button>
        <button class="justify-center min-h-[2em] min-w-[2em] shadow-md rounded-lg bg-white w-2 h-2 rounded m-[2px] text-4xl h-[2em] w-[2em]" on:click={clear}>CA</button>
      
        {#each Array(9) as _, i}
    <button class="justify-center text-4xl min-h-[2em] min-w-[2em] shadow-md rounded-lg bg-white w-2 h-2 rounded m-[2px]" on:click={()=>{addNumber(i+1)}}>
        {i+1}
    </button>
    {/each}
    
    <button class="justify-center min-h-[2em] min-w-[6em] shadow-md rounded-lg bg-white w-2 h-2 rounded m-[2px] text-4xl h-[2em] w-[2em]" on:click={submit}>Done</button>
    
</div>
