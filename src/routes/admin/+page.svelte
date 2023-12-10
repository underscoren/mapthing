<script lang="ts">
	import Folded from '$lib/Folded.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	console.log(data);

	function adjudicate(id: string, verdict: 'approve' | 'delete') {
		fetch('/admin/judge', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id,
				verdict
			})
		})
			.then(async (resp) => {
				const outcome = await resp.json();

				if (outcome.success) {
					console.log('success');
					data.pending = data.pending.filter((p) => p._id.toString() != id);
				}
			})
			.catch(console.error);
	}
</script>

<div class="section content">
	<h1>Secret admin panel</h1>

	{#if data.pending?.length}
		<p>Pending markers</p>

		{#each Object.entries(data.pending) as [id, marker]}
			<div class="box markerBox">
				<h2>Marker #{id}</h2>
				<p>
					<a href={`https://google.com/maps/place/${marker.lat},${marker.lng}`}
						>Lat: {marker.lat}, Lng: {marker.lng}</a
					>
				</p>
				<Folded title="Source info:">
					<p>ID: <code>{marker._id}</code></p>
					<p>from: <code>{marker.source.ip}</code></p>
					<p>headers:</p>
					<code>{@html marker.source.headers.join('<br>')}</code>
				</Folded>
				<p>raw markdown:</p>
				<code>{@html marker.textRaw.replaceAll('\n', '<br>')}</code>
				<p>rendered:</p>
				<div class="box">
					{@html marker.textHTML}
				</div>
				<div class="button-container">
					<button
						class="button is-primary"
						on:click={() => adjudicate(marker._id.toString(), 'approve')}>Approve</button
					>
					<button
						class="button is-danger"
						on:click={() => adjudicate(marker._id.toString(), 'delete')}>Delete permanently</button
					>
				</div>
			</div>
		{/each}
	{:else}
		<p>No pending markers!</p>
	{/if}
</div>

<style lang="sass">
    p
        margin-bottom: 0.5rem
</style>
