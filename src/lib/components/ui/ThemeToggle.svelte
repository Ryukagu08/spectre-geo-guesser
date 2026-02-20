<script lang="ts">
	import Palette from 'lucide-svelte/icons/palette';
	import { theme } from '$lib/theme.svelte';

    $effect(() => {
        theme.init();
    });
</script>

<button 
	onclick={theme.toggle}
	class="flex items-center gap-2 px-3 h-10 rounded-md transition-all duration-300 cursor-pointer font-display uppercase tracking-wider text-sm
		text-white hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20 bg-transparent"
	aria-label="Toggle theme"
>
	<Palette size={16} class="transition-transform duration-300 group-hover:rotate-12" />
	<span class="hidden sm:inline transition-opacity duration-300">{theme.current === 'S0' ? 'Spectre' : 'Flashpoint'}</span>
</button>
