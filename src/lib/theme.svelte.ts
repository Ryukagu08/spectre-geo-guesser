class ThemeState {
	current = $state<'S0' | 'S1'>('S0');

	constructor() {
		// Initialize in effect or on mount elsewhere, but here we just set defaults
	}

	toggle = () => {
		this.current = this.current === 'S0' ? 'S1' : 'S0';
		this.apply();
	};

	set = (value: 'S0' | 'S1') => {
		this.current = value;
		this.apply();
	};

	apply = () => {
		if (typeof document !== 'undefined') {
			document.body.setAttribute('data-theme', this.current);
			localStorage.setItem('spectreTheme', this.current);
		}
	};

	init = () => {
		if (typeof localStorage !== 'undefined') {
			const saved = localStorage.getItem('spectreTheme') as 'S0' | 'S1';
			if (saved) {
				this.current = saved;
				this.apply();
			}
		}
	};
}

export const theme = new ThemeState();
