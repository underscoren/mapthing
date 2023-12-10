<script lang="ts">
	import Editor from '$lib/Editor.svelte';
	import Map from '$lib/Map.svelte';

	let modalElement: HTMLDivElement;
	let editorContents: string | void;
	let newMarkerPos: google.maps.LatLngLiteral;
	let mapComponent: Map;

	function openModal(ev: google.maps.MapMouseEvent) {
		modalElement.classList.add('is-active');
		newMarkerPos = ev.latLng?.toJSON() ?? { lat: 0, lng: 0 };
	}

	function closeModal() {
		modalElement.classList.remove('is-active');
	}

	function sendMessage() {
		fetch('/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pos: newMarkerPos,
				text: editorContents
			})
		}).then(async (resp) => {
			const outcome = await resp.json();

			if (outcome.success) {
				closeModal();
				mapComponent.createMarker(newMarkerPos, outcome.contents);
			}
		});
	}
</script>

<div class="fullscreen-container">
	<div class="map-container">
		<Map onNewMarker={openModal} bind:this={mapComponent} />
	</div>
	<div class="title-container">
		<img src="/about.png" alt="Not quite the same place" />
	</div>
</div>

<div class="modal" bind:this={modalElement}>
	<div class="modal-background"></div>
	<div class="modal-content">
		<div class="box content">
			<Editor
				on:mardownChanged={(ev) => {
					editorContents = ev.detail.markdown;
				}}
			/>
			<div style="margin-top: 1.5rem">
				<button class="button is-primary" on:click={sendMessage}>Add to map</button>
				<button class="button is-danger" on:click={closeModal}>Exit</button>
			</div>
		</div>
	</div>
	<button class="modal-close is-large" aria-label="close" on:click={closeModal}></button>
</div>

<style lang="sass">
	.fullscreen-container
		width: 100vw
		height: 100vh
		padding: 0
		margin: 0
		display: flex
		position: relative

	$map-width: 100vw
	.map-container
		display: inline-block
		width: $map-width
		height: 100vh
		margin: 0
		padding: 0
	
	.title-container
		position: absolute
		top: -8rem
		left: 1rem
		width: 25rem
</style>
