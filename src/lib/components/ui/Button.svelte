<script lang="ts">
	import { type Snippet } from 'svelte';

	let { 
		children, 
		onclick, 
		variant = 'primary', 
		size = 'default',
		class: className = '',
		disabled = false,
		...rest 
	}: { 
		children: Snippet; 
		onclick?: (e: MouseEvent) => void; 
		variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon'; 
		size?: 'default' | 'sm' | 'icon';
		class?: string;
		disabled?: boolean;
		[key: string]: any; 
	} = $props();

	const base = "font-display font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95 flex items-center justify-center gap-2 leading-none";
	
	const sizes: Record<string, string> = {
		default: "h-12 px-6 text-base",
		sm: "h-9 px-4 text-sm",
		icon: "h-10 w-10 p-0"
	};

	const variants: Record<string, string> = {
		primary: "bg-theme-primary text-black hover:brightness-110 border-2 border-transparent rounded",
		secondary: "bg-grey/80 text-light-grey border border-light-grey rounded hover:bg-grey hover:text-white hover:border-white",
		danger: "bg-pink text-white border border-pink/50 rounded hover:brightness-110",
		ghost: "bg-transparent text-pink border-none hover:text-theme-primary",
		icon: "bg-transparent text-pink border-none hover:text-theme-primary rounded"
	};
</script>

<button 
	class="{base} {sizes[size]} {variants[variant]} {className}"
	{onclick}
	{disabled}
	{...rest}
>
	{@render children()}
</button>
