<script>
    export let successMsg = "failed to update";
    export let show = false;
    export let killTime = 5000000.0;
    
    const killSelf = () => {
        setTimeout(() => {
            show = false;
        }, killTime)
    }
    killSelf();
</script>



<div class="fixed bottom-0 w-[100vw] flex flex row justify-center center-items">
    <div class="bg-red-300 text-2xl py-[10px]  ">
        <p>{successMsg}</p>
    </div>
    
</div>
<style>
    
</style>