<script lang="ts">
	import Child from "./Child.svelte";
	export let name: string;
	let hasChild = true;
</script>

<main>
	<h1>Hello {name}!</h1>
	<button on:click={() => hasChild = !hasChild}
		>Toggle child (grandchild is renderless composed)</button
	>
	{#if hasChild}
		<Child
			on:eventChild={() => console.log("event from child")}
			on:eventForwarded={() => console.log("event forwarded")}
		/>
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
