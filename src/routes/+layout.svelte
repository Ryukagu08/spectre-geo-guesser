<script lang="ts">
	import './layout.css';
	import { theme } from '$lib/theme.svelte';

	let { children } = $props();

    $effect(() => {
        theme.init();
    });
</script>

<!-- Global Background with Smooth Transition -->
<div class="fixed inset-0 z-[-1] bg-dark">
    <!-- Spectre Background (S0) -->
    <img 
        src="/assets/backgrounds/S0_background.png" 
        alt="" 
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out {theme.current === 'S0' ? 'opacity-100' : 'opacity-0'}"
    />
    <!-- Flashpoint Background (S1) -->
    <img 
        src="/assets/backgrounds/S1_background.png" 
        alt="" 
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out {theme.current === 'S1' ? 'opacity-100' : 'opacity-0'}"
    />
    <!-- Darkening Overlay -->
    <div class="absolute inset-0 bg-black/60 pointer-events-none"></div>
</div>

<div class="relative z-10 w-full h-full flex flex-col overflow-hidden">
	{@render children()}
</div>
