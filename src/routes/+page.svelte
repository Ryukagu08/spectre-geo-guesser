<script lang="ts">
	import Play from 'lucide-svelte/icons/play';
	import { base } from '$app/paths';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { theme } from '$lib/theme.svelte';
</script>

<!-- Background Pattern handled by layout -->

<!-- Header -->
<header class="fixed top-0 left-0 w-full flex justify-between items-center p-6 z-50 pointer-events-none">
	<!-- Logo -->
	<div class="w-48 md:w-64 pointer-events-auto animate-in slide-in-from-top-4 duration-700">
		<img 
			src="/assets/Logos/SDGS{theme.current === 'S1' ? '1' : '0'}Logo.png" 
			alt="Spectre Divide Geoguessr" 
			class="w-full h-auto drop-shadow-[0_0_15px_rgba(255,203,0,0.3)] filter brightness-110"
			width="1024"
			height="224"
		/>
	</div>
	
	<!-- Theme Toggle -->
	<div class="pointer-events-auto animate-in slide-in-from-top-4 duration-700 delay-100">
		<ThemeToggle />
	</div>
</header>

<!-- Main Content -->
<div class="flex flex-col items-center justify-center min-h-[100dvh] p-4 sm:p-6 text-center relative w-full">
	
	<!-- Glass Card -->
	<div class="flex flex-col items-center justify-center bg-black/70 p-6 pt-20 pb-8 sm:pt-10 sm:p-8 lg:p-10 rounded-3xl backdrop-blur-md border border-white/10 shadow-2xl animate-in zoom-in-95 duration-700 w-full max-w-3xl mt-16 sm:mt-8 md:mt-12">
		
		<!-- Welcome Text -->
		<div class="space-y-4 sm:space-y-6 text-center w-full flex flex-col justify-center items-center mb-6 sm:mb-8">
			<h2 class="text-2xl sm:text-3xl md:text-5xl font-display text-white uppercase tracking-wider drop-shadow-md w-[80%] sm:w-auto max-w-3xl leading-tight">
				Welcome to Spectre Divide Geoguessr!
			</h2>
			
			<div class="space-y-4 sm:space-y-6 w-[80%] sm:w-auto">
				<p class="text-lg sm:text-2xl text-gray-100 leading-normal font-normal">
					Test your knowledge of the <span class="text-theme-primary font-bold">Spectre Divide</span> universe by identifying locations from images. 
					<br/>How well do you know the game's world?
				</p>
				
				<p class="text-lg text-gray-300 font-normal">
					This is a work in progress so feel free to leave any feedback in
					<a href="https://discord.com/channels/943308533439545415/1343990218096906311" target="_blank" rel="noopener" class="text-theme-primary hover:text-white transition-colors underline decoration-transparent hover:decoration-white underline-offset-4 ml-1 whitespace-nowrap">#🎨｜fan-art</a>
				</p>
			</div>
		</div>

		<!-- Play Button -->
		<div class="w-full flex justify-center mb-6">
			<a href="{base}/game" class="inline-block group relative w-[80%] sm:w-auto" data-sveltekit-preload-data="hover">
				<div class="relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-theme-primary/20 border border-white/10 group-hover:border-theme-primary/50 w-full aspect-square sm:aspect-auto sm:w-72 sm:h-72 md:w-80 md:h-80">
					<img 
						src="/assets/misc/lofiprimal.png" 
						alt="Play Game" 
						class="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500"
						width="320"
						height="320"
					/>
					<div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors duration-300">
						<span class="font-display text-5xl sm:text-7xl md:text-8xl text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-widest flex items-center gap-2 sm:gap-4 opacity-100 transition-all duration-300">
							<Play class="fill-white/20 w-8 h-8 sm:w-16 sm:h-16" strokeWidth={3} />
							PLAY
						</span>
					</div>
				</div>
			</a>
		</div>
		
		<!-- Footer -->
		<div class="w-full pt-8 lg:pt-10 border-t border-white/5 text-center mt-4 sm:mt-0">
			<p class="text-sm text-gray-500">
				© 2026 Spectre Divide Geoguessr Fan Project
			</p>
		</div>
	</div>
</div>
