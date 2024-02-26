<script>
    export let successMsg = "Successfully Updated";
    export let show = false;
    export let killTime = 2000.0;
    
    const killSelf = () => {
        setTimeout(() => {
            show = false;
        }, killTime)
    }
    killSelf();
</script>



<div class="fixed bottom-0  md:w-[100vw] lg:w-[1080px]  ">
    <div class="bg-green-300 text-center w-[100%] text-2xl rounded overflow-hidden shadow-md py-[10px]  ">
        <p>{successMsg}</p>
    </div>
    
</div>
<style>
    
</style>