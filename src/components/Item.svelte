<script>
	export let item;
	let status;
	
	$: {
		item;
		item.name;
		item.quantity;
		item.min_quantity;
		status = 'w-[8px] mr-[4px] rounded-sm ';
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

<tr class={"flex flex-row py-[3px] my-[2px] border-b border-gray-500"}>
	<td class={status}></td>
	<td class="h-[50px] min-w-[55px]"><img class="object-contain h-full" src={item.image.image} /></td
	>
	<td class="w-[10em] text-center"><a href={item.url} target="blank">{item.name}</a></td>
	<td class="w-[10em] text-center"><input class="w-[9.8em]"  bind:value={quantity} /></td>
	<td class="w-[10em] text-center"><input class="w-[9.8em]"  bind:value={min_quantity} /></td>
	<td class="w-[10em] text-center">{item.category.name}</td>
	</tr>
