<script lang="ts">
	export let title: string;
	let isFolded = true;
</script>

<p on:click={() => (isFolded = !isFolded)}>{title} {isFolded ? '⯅' : '⯆'}</p>
<div class="folded" class:is-active={isFolded}>
	<slot />
</div>

<style lang="sass">
    .folded
        display: none

        &.is-active
            display: unset
</style>
