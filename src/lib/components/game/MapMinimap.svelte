<script lang="ts">
	let { 
        map, 
        onguess,
        userGuess = null,
        answer = null,
		disabled = false
    }: { 
        map: string; 
        onguess: (x: number, y: number) => void;
        userGuess?: { x: number, y: number } | null;
        answer?: { x: number, y: number } | null;
		disabled?: boolean;
    } = $props();

	let container: HTMLDivElement;
    let width = $state(0);
    let height = $state(0);

	function handleClick(e: MouseEvent) {
		if (disabled) return;
		if (!container) return;
		
		const rect = container.getBoundingClientRect();
		// The image is square (1:1) and uses object-contain. 
		// Its actual rendered size is constrained by the smallest container dimension.
		const imageSize = Math.min(rect.width, rect.height);
		const offsetX = (rect.width - imageSize) / 2;
		const offsetY = (rect.height - imageSize) / 2;
		
		let clickX = e.clientX - rect.left - offsetX;
		let clickY = e.clientY - rect.top - offsetY;

		// Clamp click to actual image bounds to avoid out of bounds guesses
		clickX = Math.max(0, Math.min(clickX, imageSize));
		clickY = Math.max(0, Math.min(clickY, imageSize));

		const scaleFactor = 720 / imageSize;
		onguess(Math.round(clickX * scaleFactor), Math.round(clickY * scaleFactor));
	}
    
    function getPosition(cords: {x: number, y: number}) {
        if (!width || !height) return { top: 0, left: 0 };
        const imageSize = Math.min(width, height);
        const offsetX = (width - imageSize) / 2;
        const offsetY = (height - imageSize) / 2;

        const scale = imageSize / 720;
        return { 
            left: offsetX + cords.x * scale, 
            top: offsetY + cords.y * scale 
        };
    }
</script>

<div 
	bind:this={container}
    bind:clientWidth={width}
    bind:clientHeight={height}
	class="relative w-full aspect-square max-h-full max-w-full mx-auto cursor-crosshair overflow-hidden select-none rounded-lg"
	class:cursor-default={disabled}
	onclick={handleClick}
	onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(e as unknown as MouseEvent); }}
    role="button"
    tabindex="0"
    aria-label="Minimap: Click to guess location"
>
	{#if map}
    <img 
        src="/assets/Minimaps/{map}_Minimap_Overlay.png" 
        alt="Map Overlay" 
        class="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        draggable="false"
    />
        
        {#if userGuess}
            {@const pos = getPosition(userGuess)}
            <div class="absolute z-10 pointer-events-none" style="left: {pos.left}px; top: {pos.top}px;">
                <!-- Ring 1 -->
                <div class="absolute w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-pink/50 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
                <!-- Ring 2 (Delayed) -->
                <div class="absolute w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-theme-primary/50 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite_0.5s] opacity-75"></div>
                <!-- Core Glow -->
                <div class="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-pink rounded-full border-2 border-white shadow-[0_0_15px_#ff0055,0_0_30px_#ff0055] -translate-x-1/2 -translate-y-1/2"></div>
            </div>
        {/if}

        {#if answer}
            {@const pos = getPosition(answer)}
            <div class="absolute z-10 pointer-events-none" style="left: {pos.left}px; top: {pos.top}px;">
                 <!-- Ring 1 -->
                <div class="absolute w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-theme-primary/50 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
                <!-- Ring 2 (Delayed) -->
                <div class="absolute w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-green/50 rounded-full -translate-x-1/2 -translate-y-1/2 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite_0.5s] opacity-75"></div>
                
                <!-- Core Glow -->
                <div class="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-green rounded-full border-2 border-white shadow-[0_0_15px_#24EDAE,0_0_30px_#24EDAE] -translate-x-1/2 -translate-y-1/2"></div>
            </div>
        {/if}
	{/if}
</div>
