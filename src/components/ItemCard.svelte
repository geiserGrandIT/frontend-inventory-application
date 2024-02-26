<script>
	export let item;
	let cardCSS = 'bg-white rounded pt-[.2em] rounded-lg m-[6px] text-2xl max-w-[4em] min-h-[3em] m-2 min-w-[6em]';
	let itemCSS;
	$: {
		itemCSS =  cardCSS + (item.min_quantity > item.quantity ? ' border border-3 shadow-red-300 shadow-md border-w-[5px] border-red-300' : '');
    }
</script>

<div class={itemCSS}>
	<li class='flex flex-col justify-center center-items'>
        <div class="flex flex-row justify-center center-items">
			<img src={item.image.image} alt={'product image'} height="100px" width="100px" />
    	</div>
        <div >
			<h3 class="overflow-y-auto pt-[4px] h-[15ch] ">{item.name}</h3>
			<p class="text-sm text-[#687] pt-auto mb-[10px]">stock:{item.quantity}</p>
		</div>
	</li>
</div>
