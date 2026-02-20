<script lang="ts">
	import { base } from '$app/paths';
	import { theme } from '$lib/theme.svelte';
	import { game } from '$lib/game.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import MapMinimap from '$lib/components/game/MapMinimap.svelte';
	import ImageViewer from '$lib/components/game/ImageViewer.svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import { onMount, tick } from 'svelte';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import Flag from 'lucide-svelte/icons/flag';
	import CircleCheckBig from 'lucide-svelte/icons/circle-check-big';
	import SkipForward from 'lucide-svelte/icons/skip-forward';
	import MapIcon from 'lucide-svelte/icons/map';
	import Camera from 'lucide-svelte/icons/camera';
	import Trophy from 'lucide-svelte/icons/trophy';
    import House from 'lucide-svelte/icons/house';

	type ViewMode = 'photo' | 'map';

	let viewMode = $state<ViewMode>('photo');
	let selectedMap = $state<string | null>(null);
	let resultMessage = $state<string | null>(null);
	let resultStatus = $state<'idle' | 'success' | 'failure'>('idle');
    
	let userGuess = $state<{x: number, y: number} | null>(null);
	let answer = $state<{x: number, y: number} | null>(null);

	const MAPS = ['Mill', 'Metro', 'Skyway', 'Commons', 'Canal'];
	const roundDone = $derived(game.status === 'success' || game.status === 'failure');

	onMount(() => { game.startGame(); });

	function handleMapSelect(map: string) {
		if (roundDone) return;
		selectedMap = map;
		viewMode = 'map';
	}

	function handlePinPlace(x: number, y: number) {
		if (roundDone) return;
		userGuess = { x, y };
	}

    let scrollContainer: HTMLElement | null = $state(null);
    let showLeftFade = $state(false);
    let showRightFade = $state(false);

    function handleScroll(e: Event) {
        const target = e.currentTarget as HTMLElement;
        const { scrollLeft, scrollWidth, clientWidth } = target;
        
        showLeftFade = scrollLeft > 20;
        showRightFade = Math.abs(scrollLeft + clientWidth - scrollWidth) > 20;
    }
    
    $effect(() => {
        if (scrollContainer && !roundDone) {
            handleScroll({ currentTarget: scrollContainer } as unknown as Event);
        }
    });

    async function scrollToMap(mapName: string) {
        await tick();
        setTimeout(() => {
            if (!scrollContainer) return;
            const btn = scrollContainer.querySelector(`button[aria-label="Select ${mapName} map"]`);
            if (btn) {
                const containerRect = scrollContainer.getBoundingClientRect();
                const btnRect = btn.getBoundingClientRect();
                const targetScrollLeft = scrollContainer.scrollLeft + btnRect.left - containerRect.left - (containerRect.width / 2) + (btnRect.width / 2);
                
                scrollContainer.scrollTo({ 
                    left: targetScrollLeft, 
                    behavior: 'smooth' 
                });
            }
        }, 50);
    }

	async function handleSubmit() {
		if (!userGuess || !selectedMap || roundDone) return;

		const result = game.guess(userGuess.x, userGuess.y, selectedMap);
		if (result) {
			resultMessage = result.message;
            resultStatus = game.status === 'success' ? 'success' : 'failure';
			answer = { x: result.correct.x, y: result.correct.y };
			
			if (game.currentRound) {
				if (selectedMap !== game.currentRound.map) {
					userGuess = null;
				}
				selectedMap = game.currentRound.map; 
			}
			
			viewMode = 'map';
            scrollToMap(selectedMap!);
		}
	}

	async function handleGiveUp() {
		const result = game.giveUp();
		if (result) {
			resultMessage = "Revealing location...";
			resultStatus = 'failure';
			answer = { x: result.x, y: result.y };
            
            if (game.currentRound) {
                const actualMap = game.currentRound.map;
                if (selectedMap !== actualMap) {
                    userGuess = null;
                }

                selectedMap = actualMap;
                viewMode = 'map';
                scrollToMap(actualMap);
            }
		}
	}

	function handleClear() {
		if (roundDone) return;
		userGuess = null;
		answer = null;
		selectedMap = null;
		viewMode = 'photo';
	}

	function handleNext() {
		game.nextRound();
		selectedMap = null;
		userGuess = null;
        answer = null;
		resultMessage = null;
        resultStatus = 'idle';
        viewMode = 'photo';
	}
</script>

<div class="h-screen w-screen flex flex-col overflow-hidden relative selection:bg-theme-primary selection:text-black">
	
	<!-- Game Header -->
	<header class="flex items-center justify-between px-4 md:px-6 py-2 md:py-3 bg-black/60 backdrop-blur-md z-20 shrink-0 h-14 md:h-16 shadow-lg gap-2 md:gap-4 w-full">
		<!-- Left: Logo -->
		<div class="flex flex-1 justify-start min-w-0">
			<img 
				src={theme.current === 'S0' ? "/assets/Logos/SDGS0Logo.png" : "/assets/Logos/SDGS1Logo.png"} 
				alt="Spectre" 
				class="h-6 sm:h-8 md:h-10 w-auto object-contain drop-shadow-lg transition-all" 
			/>
		</div>
		
		<!-- Center: Score -->
		<div class="flex flex-none justify-center px-4 w-auto">
			<span class="font-display text-lg sm:text-xl md:text-2xl tracking-widest text-white uppercase drop-shadow-md whitespace-nowrap">
				Score: <span class="text-theme-primary font-bold ml-1">{game.score}</span>
			</span>
		</div>
		
		<!-- Right: Controls -->
		<div class="flex flex-1 justify-end items-center gap-3 min-w-0">
			<ThemeToggle />
            <a href="{base}/" class="flex items-center justify-center w-10 h-10 rounded-md transition-all duration-300 text-light-grey hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20" aria-label="Go Home">
                <House size={20} />
            </a>
		</div>
	</header>

	<!-- Result Bar -->
	<div class="h-10 flex items-center justify-center px-4 font-display text-lg uppercase tracking-widest shrink-0
		bg-black/60 backdrop-blur-md border-t border-white/10 z-20
		{resultStatus === 'success' ? 'text-green' : resultStatus === 'failure' ? 'text-pink' : 'text-theme-primary'}">
		{#if game.status === 'finished'}
			<span class="flex items-center gap-2"><Trophy size={18} /> Mission Complete — Final Score: {game.score}</span>
		{:else if resultMessage}
			{resultMessage}
		{:else}
			Where is this image?
		{/if}
	</div>

	<!-- Main Content Area -->
	<main class="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden relative w-full">
		{#if game.status === 'finished' && !game.currentRound}
			<!-- Game Over -->
			<div class="text-center space-y-4 md:space-y-6 bg-grey/30 p-6 md:p-10 rounded-xl backdrop-blur border border-grey/50 max-w-[95%]">
				<Trophy size={64} class="text-theme-primary mx-auto w-12 h-12 md:w-16 md:h-16" />
				<h2 class="text-3xl md:text-5xl font-display text-theme-primary uppercase tracking-widest">Mission Complete</h2>
				<p class="text-xl md:text-2xl text-light-grey">Final Score: <span class="text-white font-bold">{game.score}</span> / {game.allImages.length}</p>
				<Button onclick={() => { game.startGame(); handleClear(); }}>
					<SkipForward size={18} /> Replay
				</Button>
			</div>
		{:else if game.currentRound}
			<!-- Main Card -->
			<div class="flex flex-col bg-black/60 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 shadow-2xl w-full max-w-4xl" style="max-height: 75vh;">
				
                <!-- Display Area -->
                <div class="relative flex justify-center items-center overflow-hidden shrink-1 min-h-[300px] w-full bg-black/50 p-2 sm:p-4">
                    {#if game.currentRound}
                        <ImageViewer 
                            imageName={game.currentRound.imageData.name} 
                            map={game.currentRound.map} 
                            class="mx-auto relative shadow-2xl rounded-lg overflow-hidden w-full sm:w-fit flex items-center justify-center max-h-full"
                            imgClass="block max-h-[60vh] w-[100%] sm:w-auto h-auto sm:max-w-full m-auto"
                        >
                            {#if viewMode === 'map' && selectedMap}
                                <div class="absolute inset-0 z-10 bg-black/80 flex items-center justify-center p-2">
                                    <MapMinimap 
                                        map={selectedMap} 
                                        onguess={handlePinPlace} 
                                        userGuess={userGuess}
                                        answer={answer}
                                        disabled={roundDone}
                                    />
                                </div>
                            {/if}
                        </ImageViewer>
                    {/if}
                </div>

                <!-- Footer -->
                <footer class="p-3 sm:px-4 sm:py-3 bg-dark/90 backdrop-blur-md border-t border-grey/30 shrink-0 relative z-20 w-full flex items-center justify-center">
                    <div class="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-3 items-center w-full sm:justify-center">
                        <!-- Clear -->
                        <Button 
                            onclick={handleClear} 
                            variant="ghost" 
                            disabled={roundDone || (!selectedMap && !userGuess)} 
                            class="w-full sm:w-28 border-2 border-solid {roundDone ? 'border-grey text-grey opacity-50' : 'border-pink text-pink hover:bg-pink/10'} rounded transition-colors"
                        >
                            <Trash2 size={18} /> Clear
                        </Button>

                        <!-- View Toggle -->
                        {#if viewMode === 'map' && selectedMap}
                            <Button variant="secondary" onclick={() => viewMode = 'photo'} class="w-full sm:w-32">
                                <Camera size={18} /> Photo
                            </Button>
                        {:else}
                            <Button variant="secondary" onclick={() => viewMode = 'map'} disabled={!selectedMap && !roundDone} class="w-full sm:w-32">
                                <MapIcon size={18} /> Map
                            </Button>
                        {/if}

                        <!-- Give Up -->
                        <Button 
                            variant="danger" 
                            onclick={handleGiveUp} 
                            disabled={roundDone}
                            class="w-full sm:w-32 {roundDone ? 'opacity-30 grayscale cursor-not-allowed' : ''}"
                        >
                            <Flag size={18} /> Give Up
                        </Button>

                        <!-- Submit / Next -->
                        {#if !roundDone}
                            <Button variant="primary" onclick={handleSubmit} disabled={!userGuess} class="w-full sm:w-32">
                                <CircleCheckBig size={18} /> Submit
                            </Button>
                        {:else}
                            <Button variant="primary" onclick={handleNext} class="w-full sm:w-32 animate-[pulse_2s_infinite]">
                                <SkipForward size={18} /> Next
                            </Button>
                        {/if}
                    </div>
                </footer>
			</div>
            
            {/if}
	</main>

	<!-- Map Selection Bar -->
    <div class="relative w-full z-10 shrink-0">
        <!-- Left Fade -->
        <div class="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-dark/90 to-transparent pointer-events-none z-20 transition-opacity duration-300 {showLeftFade ? 'opacity-100' : 'opacity-0'}"></div>
        
        <nav 
            class="flex justify-start sm:justify-center items-center gap-2 sm:gap-4 px-3 py-4 bg-dark/90 backdrop-blur-md border-t border-grey/30 overflow-x-auto min-h-[90px] sm:min-h-[100px] w-full snap-x snap-mandatory scroll-smooth w-[100vw] sm:w-auto transition-opacity duration-500 hidden-scrollbar"
            bind:this={scrollContainer}
            onscroll={handleScroll}
        >
            <div class="flex gap-2 sm:gap-4 mx-auto w-max px-2">
            {#each MAPS as map}
                <button 
                    class="relative w-[110px] h-[68px] sm:w-32 sm:h-20 lg:w-40 lg:h-24 rounded-md overflow-hidden border-2 transition-all duration-300 shrink-0 group transform snap-center
                        {selectedMap === map 
                            ? 'border-theme-primary shadow-theme-glow scale-[1.02] sm:scale-105 opacity-100 z-10' 
                            : 'border-transparent hover:border-white hover:scale-[1.02] sm:hover:scale-105 opacity-80 hover:opacity-100'}
                        {roundDone && selectedMap !== map ? 'opacity-30 grayscale cursor-not-allowed pointer-events-none' : 'cursor-pointer'}"
                    onclick={() => handleMapSelect(map)}
                    disabled={roundDone && selectedMap !== map}
                    aria-label="Select {map} map"
                >
				<img 
					src="/assets/thumbnails/{map}.png" 
					alt={map} 
					class="w-full h-full object-cover transition-opacity duration-300 opacity-100"
					loading="lazy"
					width="160"
					height="96"
				/>
				<div class="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
					<span class="font-display text-white text-lg uppercase tracking-wider drop-shadow-md shadow-black {selectedMap === map ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}">
						{map}
					</span>
				</div>
			</button>
		    {/each}
        </div>
	</nav>

    <!-- Right Fade -->
    <div class="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-dark/90 to-transparent pointer-events-none z-20 transition-opacity duration-300 {showRightFade ? 'opacity-100' : 'opacity-0'}"></div>
    </div>
</div>

<style>
    .hidden-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .hidden-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>

