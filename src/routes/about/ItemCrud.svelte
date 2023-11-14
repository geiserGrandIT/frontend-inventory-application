<script>
	import { onMount } from 'svelte';
	import { baseURL } from '../../config';
	import { readFileAsDataURL } from '../../Utils/utils';
	import axios from 'axios';

	export let item;
	export let isEdit = true;
	export let refresh;
	let fileInputRef;
	const fetchAllTags = async () => {
		const response = axios.get(baseURL() + '/tags/');
		// for (const tag of (await response).data){
		//     //console.log(tag)
		//     tag.selected = false;
		//     allTags.push(tag);
		// }
		allTags = (await response).data;
        try{
            for (const tag of allTags) {
			for (const itag of item.tags) {
				if (itag.id === tag.id) {
					tag.selected = true;
				} else {
					tag.selected = false;
				}
			}
		}
        } catch (err){
            console.log('new Item', err)
        }
		
		//console.log(allTags)
	};
	const fetchAllCategories = async () => {
		const response = axios.get(baseURL() + '/categories/');
		allCategories = (await response).data;
        console.log('fetchAllCategories', allCategories)
	};
	const fetchAllDepartments = async () => {
        try{
            const response = axios.get(baseURL() + '/departments/');
		allDepartments = (await response).data;
		department = allDepartments.find((d) => d.id === departmentId).name;
        } catch (err){
            console.log('creating a new item',err);
        }

	};

	let allTags = [];
	let allCategories = [];
	let allDepartments = [];
	onMount(() => {
		fetchAllDepartments();
		fetchAllCategories();
		fetchAllTags();
	});
	console.log(item);

	let id = !item ? '' : item.id;
	let name = !item ? '' : item.name;
	let category = !item ? '' : item.category.name;
	let image = !item ? '' : item.image.image;
	let min_quantity = !item ? '' : item.min_quantity;
	let price = !item ? '' : item.price;
	let url = !item ? '' : item.url;
	let quantity = !item ? '' : item.quantity;
	let notes = !item ? '' : item.notes;
	let cancelled = !item ? false : !item.cancelled ? false : true;
	let department;

	let data;
    let imageSrc;
	const departmentId = !item ? '' : item.category.division;
	const dupeValue = (val) => {
		return val;
	};
	$: {
		name;
		category;
		image;
		min_quantity;
		quantity;
		price;
		notes;
		cancelled;
		department;
		url;
		allTags;
		allDepartments;
		allCategories;

		//for (const tag of allTags){ tag.selected}
		handleChange();
	}

	const handleChange = () => {

		data = {
			id: id,
			name: name,
			price: price,
			category: category,
			notes: notes,
			url: url,
			min_quantity: min_quantity,
			quantity: quantity,
			cancelled: cancelled,
            tags: allTags.filter(tag => tag.selected == true),
			image: image,
			'full-update': !id ? 'False' : 'True'
		};
        console.log('handleChange',data)
	};
	const handleImageDrop = async (e) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		console.log('handleImageDrop', file);
        image = file;

		if (file) {
			try {
				imageSrc = await readFileAsDataURL(file);
			} catch (err) {
				console.warn(err);
			}
		}
	};
	const handleImageChange = async (e) => {
		const file = e.target.files[0];
		console.log('handleImageChange', file);
		if (file) {
			try {
				imageSrc = await readFileAsDataURL(file);
			} catch (err) {
				console.warn(err);
			}
		}
	};
	const handleOpenDialog = (e) => {
		console.log(fileInputRef);
		fileInputRef.click();
	};

	const handleFollowLink = (e) => {
		if (e.ctrlKey || e.metaKey) {
			e.preventDefault();
			const link = e.target.value;
			window.open(link, '_blank');
		}
	};
	const handleSave = () => {
		console.log('sending', data);

		if (!item) {
            delete data.tags.selected;
            if (data.cancelled) {data.cancelled = Date()} else {delete data.cancelled}
            data.image = imageSrc;
			const result = axios
				.post(baseURL() + '/items/', data, {headers: {'Content-Type':'application/json'}})
				.then((result) => {
					if (result.status === 200) {
						console.log('success saving new', result);
					}
					refresh();
				})
				.catch((error) => console.warn(error));
		} else {
			const result = axios
				.patch(baseURL() + '/items/' + data.id + '/', data)
				.then((result) => {
					if (result.status === 200) {
						console.log('success editing', result.data);
					}
					refresh();
				})
				.catch((err) => {
					//console.log('failure', err);
				});
		}
	};

	const selectTag = (tag) => {
		const updatedTags = allTags.map((t) => {
			if (t.id === tag.id) {
				return { ...t, selected: !t.selected };
			} else {
				return t;
			}
		});
		allTags = updatedTags;
	};
	const updateCategories = ()=>{

    }
    console.log("allCategories",allCategories);
</script>

<div class="relative mt-[20vh] ml-[38vw]">
	<div
		class="rounded bg-white shadow-lg p-[5px] fixed w-[50ch] px-[40px] py-[30px] h-[70ch] overflow-scroll"
	>
		<div class="flex flex-row justify-center center-item">
			<input
				class={!image ? 'hidden' : 'hidden'}
				on:change={handleImageChange}
				type={'file'}
				bind:this={fileInputRef}
				on:drop={handleImageDrop}
				accept="img/"
			/>
			<img
				class={!image ? '' : ''}
				height={'100px'}
				width={'100px'}
				src={imageSrc}
				on:click={handleOpenDialog}
				on:drop={handleImageDrop}
				on:dragover={(e) => e.preventDefault()}
			/>
			<div>
      				<input class={'text-lg py-2'} bind:value={name} />
				<select bind:value={department}>
					{#each allDepartments as allDepartment (allDepartment.id)}
						<option value={allDepartment.id} on:click={updateCategories}>{allDepartment.name}</option>
					{/each}
				</select>
				<select bind:value={category}>
                    
					{#each allCategories as allcategory}

						{#if allcategory.division === department}
							<option value={allcategory.name}>{allcategory.name}</option>
						{/if}
					{/each}
				</select>
			</div>
		</div>
		<div class="flex flex-row flex-wrap">
			<p class="w-[9ch] mt-[9px]">$</p>
			<input class="border-b my-[8px] border-black w-[26ch]" bind:value={price} />
			<p class="w-[9ch]">url:</p>
			<input
				class="border-b my-[8px] border-black text-sm w-[30ch]"
				on:click={handleFollowLink}
				bind:value={url}
			/>
			<p class="w-[9ch]">Stock:</p>
			<input class="border-b my-[8px] border-black w-[26ch]" bind:value={quantity} />
			<p class="w-[11ch] text-sm">Warning Stock:</p>
			<input class="border-b my-[8px] border-black w-[26ch]" bind:value={min_quantity} />
			<p class="w-[11ch] text-sm">Tags:</p>
			<div class="overflow-y-scroll w-[26ch] border rounded h-[11ch]">
				<ul class="tag-list-item">
					{#each allTags as tag}<li
							class={tag.selected ? 'bg-blue-200' : ''}
							data-tag-id={tag.id}
							on:click={(e) => selectTag(tag)}
						>
							{tag.name}
						</li>{/each}
				</ul>
			</div>
			<p class="w-[11ch] text-sm">Cancelled ?</p>
			<input type="checkbox" class="my-[8px]" {handleChange} bind:checked={cancelled} />

			<input
				class=" rounded border border-gray-300 text-sm w-[38ch] h-[9ch]"
				type="text"
				bind:value={notes}
			/>
			<button
				class={'rounded shadow-md bg-blue-300 text-white w-[10ch] mt-[4px]'}
				on:click={handleSave}>Save</button
			>
		</div>
	</div>
</div>
