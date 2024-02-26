<script>
	export let item;
	let status;
	
	$: {
		item;
		item.name;
		item.quantity;
		item.min_quantity;
		status = 'w-[8px] mr-[4px] rounded-sm h-[100%] h-[100%] min-h-[8ch]';
		status += !item.cancelled
			? '' + (item.quantity > item.min_quantity ? '' : ' bg-red-600')
			: ' bg-gray-800';
		handleChanged();
	}
	const handleChanged = () =>{
		quantity = item.quantity;
		min_quantity = item.min_quantity;
	}
	const copyValue =(val) => {return val};
	let quantity = copyValue(item.quantity);
	let min_quantity = copyValue( item.min_quantity);
	
	const id = item.id;


	$: {
		quantity;
		min_quantity;
		handleUpdate();
	}
	const handleUpdate = () =>{
		//console.log(id, quantity, min_quantity, item)
		onUpdate(id, quantity, min_quantity);
	}
	export let onUpdate;
	
</script>

<tr class={"flex flex-row py-[3px]  justify-between items-center "}>
	<td class={status}></td>
	<td class="w-[8ch]"><img class="object-contain h-full" src={item.image.image} /></td
	>
	<td class="w-[13ch] mr-[3ch] text-center"><a href={item.url} target="blank" on:click={(e)=>e.stopPropagation()}>{item.name}</a></td>
	<td class=" w-[15ch] mr-[3ch] text-center"><input class="w-[13ch]"  bind:value={quantity} 	 on:click={(e)=>e.stopPropagation()}/></td>
	<td class=" w-[15ch] mr-[2ch] text-center"><input class='w-[13ch]'  bind:value={min_quantity} on:click={(e)=>e.stopPropagation()} /></td>
	<td class=" w-[18ch] text-center">{item.category.name}</td>
</tr>
