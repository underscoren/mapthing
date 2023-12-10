<script lang="ts">
	import { Editor, rootCtx } from '@milkdown/core';
	import { commonmark } from '@milkdown/preset-commonmark';
	import { nord } from '@milkdown/theme-nord';
	import { replaceAll } from '@milkdown/utils';
	import { listener, listenerCtx } from '@milkdown/plugin-listener';
	import { createEventDispatcher } from 'svelte';

	export let defaultMarkdown = 'Write something inspiring';

	let editorReference: Editor;
	export function setContents(contents: string) {
		editorReference.action(replaceAll(contents));
	}

	const dispatch = createEventDispatcher();

	function editor(dom: Node) {
		const MakeEditor = Editor.make()
			.config((ctx) => {
				ctx.set(rootCtx, dom);
			})
			.config((ctx) => {
				ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
					dispatch('mardownChanged', { markdown });
				});
			})
			.use(listener)
			.config(nord)
			.use(commonmark)
			.create();

		MakeEditor.then((editor) => {
			editor.action(replaceAll(defaultMarkdown));
			editorReference = editor;
		});
	}
</script>

<div use:editor />

<style lang="sass">
    div
        border: solid 1px black
        border-radius: 0.25rem
        min-height: 25vh
        padding: .5rem
</style>
