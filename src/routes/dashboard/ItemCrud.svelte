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
		//     ////console.log(tag)
		//     tag.selected = false;
		//     allTags.push(tag);
		// }
		allTags = (await response).data;
		console.log('allTags', allTags);
		try {
			for (const tag of allTags) {
				for (const itag of item.tags) {
					if (itag.id === tag.id) {
						tag.selected = true;
					} else {
						tag.selected = false;
					}
				}
			}
		} catch (err) {
			//console.log('new Item', err);
		}

		////console.log(allTags)
	};
	const fetchAllCategories = async () => {
		const response = axios.get(baseURL() + '/categories/');
		allCategories = (await response).data;
		//console.log('fetchAllCategories', allCategories);
	};
	const fetchAllDepartments = async () => {
		try {
			const response = axios.get(baseURL() + '/departments/');
			allDepartments = (await response).data;
		} catch (err) {
			//console.log('creating a new item', err);
		}
	};
	const getDepartment = (id) => {
		console.log('getDepartmentCalled', allDepartments, id);
		if (!id) {
			return ;
		}
		
		return allDepartments.find((d) => d.id === id).name;
	};
	if (!item) {
		isEdit = false;
		item = {
			id: '',
			name: '',
			category: '',
			image: '',
			min_quantity: '',
			price: '',
			url: '',
			quantity: '',
			notes: '',
			concelled: '',
			department: '',
			data: '',
			imageSrc: '',
			departmentId: ''
		};
	}
	let id = item.id || '';
	let name = item.name || '';
	let category = item.category.name || '';
	let image = item.image.image || '';
	let min_quantity = item.min_quantity || '';
	let price = item.price || '';
	let url = item.url || '';
	let quantity = item.quantity || '';
	let notes = item.notes || '';
	let cancelled = !item ? false : !item.cancelled ? false : true;
	let department;
	let data;
	let imageSrc;
	let departmentId = item.category.division || '';

	let allTags = [];
	let allCategories = [];
	let allDepartments = [];
	onMount(async () => {
		await fetchAllDepartments();
		await fetchAllCategories();
		console.log('allCategories',allCategories, departmentId);
		if (!departmentId) departmentId=1;
		department = getDepartment(departmentId);
		if (category === "") category=allCategories.find((d)=>d.division===departmentId).name
		//console.log('dept info', department, allDepartments);
		fetchAllTags();
		handleChange();
	});
	//console.log(item);

	const dupeValue = (val) => {
		return val;
	};

	$: {
		name;
		category;
		image;
		imageSrc;
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
		//console.log('imageSrc', imageSrc);
		//for (const tag of allTags){ tag.selected}
		handleChange();
	}
	onMount(() => {
		if (!imageSrc) {
			imageSrc = image;
		}
		if (!departmentId) {
			departmentId = item.category.division;
		}
		//console.log('itemRef', item);
	});

	const handleChange = () => {
		console.log('handleChange', category)
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
			tags: allTags.filter((tag) => tag.selected == true),
			image: image,
			'full-update': !id ? 'False' : 'True'
		};
		//console.log('handleChange', data);
	};
	const handleImageDrop = async (e) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		//console.log('handleImageDrop', file);
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
		//console.log('handleImageChange', file);
		if (file) {
			try {
				imageSrc = await readFileAsDataURL(file);
			} catch (err) {
				console.warn(err);
			}
		}
	};
	const handleOpenDialog = (e) => {
		//console.log(fileInputRef);
		fileInputRef.click();
	};

	const handleFollowLink = (e) => {
		if (e.ctrlKey || e.metaKey) {
			e.preventDefault();
			const link = e.target.value;
			window.open(link, '_blank');
		}
	};

	// Posting Item to DB
	//------------------------------------------------------------

	// Function to check if a string is a URL
	function isUrl(string) {
		try {
			console.log('isUrl',string);
			new URL(string);
			return true;
		} catch (_) {
			return false;
		}
	}

	// Function to convert a URL to an image Blob
	async function urlToImageBlob(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return await response.blob();
		} catch (error) {
			console.error('Error fetching the image:', error);
		}
	}

	function postItem(postItem) {
		console.log('postItem', postItem);
		const result = axios
			.post(baseURL() + '/items/', postItem, { headers: { 'Content-Type': 'multipart/form-data' } })
			.then((result) => {
				if (result.status === 200) {
					console.log('success saving new', result);
				}
				refresh();
			})
			.catch((error) => console.warn(error));
	}

	function patchItem(postItem, id) {
		console.log('patchItem', postItem);
		const result = axios
			.patch(baseURL() + '/items/' + id + '/', postItem)
			.then((result) => {
				if (result.status === 200) {
					//console.log('success editing', result.data);
				}
				refresh();
			})
			.catch((err) => {
				////console.log('failure', err);
			});
	}

	async function prepItemForPost(postItem) {
		
		const date = new Date();
		const form = new FormData();
		console.log(imageSrc);
		await new Promise( async (res, rej) => {
			
			if (imageSrc) {
				if (typeof imageSrc === typeof ''){
					if (isUrl(imageSrc)){
						console.log('it is an image source')
						const blob = await urlToImageBlob(imageSrc)
						form.append('image', blob, 'image.jpg');
						console.log('isurl',blob)
						delete postItem.image;
						res(true);
					}
					else{
						form.append('image',new Blob(imageSrc, {type: imageSrc.type}), imageSrc.type);
						console.log(isNotURL)
						delete postItem.image;
						res(true)
					}
					
					
				}else {
					form.append('image',  imageSrc, 'image.jpg');
					delete postItem.image;
				res(true);
				}
				
			}

		});

		console.log('post Promise')
		postItem.category = allCategories.find((x) => x.name === postItem.category).id;


		console.log('this is the postItem being edited',postItem)
		console.log('post category')

		postItem.last_update = date.toISOString();
		postItem.isAudit = true;
		if (postItem.cancelled === true) postItem.cancelled = date.toISOString().split('T',1).toString();
		else {
			delete postItem.cancelled;
		}
		console.log(postItem.cancelled)
		console.log('post cancelled')
		console.log (await postItem.image);
		console.log('item.tags',item.tags)

		console.log('attempting stuf', Object.keys(postItem));
		for (const key of Object.keys(postItem)) {
			if (!['image', 'tags'].includes(key)) {
				console.log(key);

				form.append(key, postItem[key]);
			}
		}

		return form;
	}

	const handleSave = async () => {
		//console.log('sending', data);
		console.log('isEdit', isEdit);
		console.log('item before processing', data);

		const formData = await prepItemForPost(data);

		console.log('after processing', data);
		if (!isEdit) {
		//	formData.append('in_use', date.toISOString());
			postItem(formData);
		} else {
			patchItem(formData, data.id);
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
	const updateCategories = () => {};
	const updateImgCSS = () => {};
	//console.log('allCategories', allCategories);

	// End of Script
	//------------------------------------------------------------------
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
				on:dragover={(e) => {
					e.preventDefault();
					updateImgCSS();
				}}
			/>
			<div>
				<input class={'text-lg py-2'} bind:value={name} />
				<select bind:value={departmentId}>
					{#each allDepartments as allDepartment (allDepartment.id)}
						<option value={allDepartment.id} on:click={updateCategories}
							>{allDepartment.name}</option
						>
					{/each}
				</select>
				<select bind:value={category}>
					{#each allCategories as allcategory}
						{#if allcategory.division === departmentId}
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
						</li>
					{/each}
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
