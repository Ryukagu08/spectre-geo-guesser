<script lang="ts">
	let {
		map,
		imageName,
		class: className = "w-full aspect-square",
        imgClass = "w-full h-full object-contain",
		children,
        ...rest
	}: {
		map: string;
		imageName: string;
		class?: string;
        imgClass?: string;
		children?: import('svelte').Snippet;
        [key: string]: any;
	} = $props();

	let isLoading = $state(true);
	let hasError = $state(false);

	$effect(() => {
		if (map && imageName) {
			isLoading = true;
			hasError = false;
		}
	});
</script>

<div class={"relative bg-black/30 overflow-hidden rounded-lg " + className} {...rest}>
    {#if isLoading}
        <div class="absolute inset-0 flex items-center justify-center bg-dark z-10">
            <div class="w-10 h-10 border-3 border-theme-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    {/if}

    {#if hasError}
        <div class="absolute inset-0 flex flex-col items-center justify-center text-pink bg-dark z-10 gap-2">
            <span class="text-3xl">⚠</span>
            <span class="text-sm uppercase tracking-wider">Failed to load</span>
        </div>
    {/if}

	<img
		src="/assets/{map}Images/{imageName}.jpg"
		alt="Location to guess"
		class={"transition-opacity duration-300 " + (isLoading ? 'opacity-0 ' : 'opacity-100 ') + imgClass}
		onload={() => isLoading = false}
		onerror={() => { isLoading = false; hasError = true; }}
		draggable="false"
	/>
	
	{@render children?.()}
</div>
