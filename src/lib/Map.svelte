<script lang="ts">
	import { Loader } from '@googlemaps/js-api-loader';
	import { onMount } from 'svelte';

	const loader = new Loader({
		apiKey: 'AIzaSyADH5JtpIvfpLZ26i5e5NW71OrkOPfYoFc',
		version: 'weekly'
	});

	export let onNewMarker: (ev: google.maps.MapMouseEvent) => any;

	let createMarkerRef: (position: google.maps.LatLngLiteral, text: string) => any; // defined later (have to wait for GMAPI to load)
	export function createMarker(position: google.maps.LatLngLiteral, text: string) {
		createMarkerRef(position, text);
	}

	let mapElement: HTMLDivElement;
	onMount(async () => {
		const { Map, InfoWindow } = (await loader.importLibrary('maps')) as google.maps.MapsLibrary;
		const { AdvancedMarkerElement, PinElement } = (await loader.importLibrary(
			'marker'
		)) as google.maps.MarkerLibrary;

		const position = { lng: -0.1277, lat: 51.5055 }; // london

		const map = new Map(mapElement, {
			center: position,
			zoom: 10,
			mapId: 'dcc3d0704099b881',
			disableDefaultUI: true
		});

		createMarkerRef = function createMarker(position: google.maps.LatLngLiteral, text: string) {
			const pinElement = new PinElement({
				background: '#333',
				glyphColor: '#dfdfdf',
				borderColor: '#000'
			});

			const marker = new AdvancedMarkerElement({
				map,
				position,
				content: pinElement.element
			});

			const infoWindow = new InfoWindow({
				content: `<div class="content marker-text">${text}</div>`
			});

			marker.addListener('click', () => {
				infoWindow.open({
					anchor: marker,
					map
				});
			});
		};

		function loadMarkers() {
			const params = new URLSearchParams();
			params.set('lat', `${map.getCenter()?.lat() ?? 0}`);
			params.set('lng', `${map.getCenter()?.lng() ?? 0}`);
			params.set('r', '1');

			fetch('/markerdata?' + params.toString()).then(async (resp) => {
				if (!resp.ok) {
					console.error(await resp.json());
					return;
				}

				type MapMarkerData = {
					text: string;
					lat: number;
					lng: number;
				};

				const data = (await resp.json()) as MapMarkerData[];

				for (const markerData of data) {
					createMarker(
						{
							lat: markerData.lat,
							lng: markerData.lng
						},
						markerData.text
					);
				}
			});
		}

		const newMarkerPin = new PinElement({
			glyph: '+',
			background: '#333',
			glyphColor: '#dfdfdf',
			borderColor: '#000'
		});

		const newMarker = new AdvancedMarkerElement({
			content: newMarkerPin.element
		});

		newMarker.addListener('click', (ev: google.maps.MapMouseEvent) => {
			onNewMarker(ev);
		});

		map.addListener('click', (ev: google.maps.MapMouseEvent) => {
			console.log('map click');
			console.log(ev);

			newMarker.map = map;
			newMarker.position = ev.latLng?.toJSON() ?? { lat: 0, lng: 0 };
		});

		loadMarkers();
	});
</script>

<div id="map" bind:this={mapElement}></div>

<style lang="sass">
    #map
        width: 100%
        height: 100%

    :global(.marker-text p)
        font-size: 1rem
</style>
