<script>
	import Header from './Header.svelte';

	import './styles.css';
</script>

<div class=" flex flex-row  justify-center center-items">
	<div class="max-w-[1080px] min-h-[100vh]">
		<div>
			<Header />

			<main>
				<slot />
			</main>
		</div>
	</div>
</div>

<style lang="postcss">
	:global(html) {
		background-color: theme(colors.gray.500);
	}

</style>
