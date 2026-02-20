
import data from './data.json';

type Coordinate = { x: number; y: number };
type ImageData = {
	name: string;
	cords: Coordinate;
};
type MapData = {
	[key: string]: ImageData;
};

type FlattenedImage = {
	map: string;
	imageKey: string;
	imageData: ImageData;
};

export class GameEngine {
	// Game State
	currentRound = $state<FlattenedImage | null>(null);
	score = $state(0);
	history = $state<string[]>([]);
	status = $state<'idle' | 'guessing' | 'success' | 'failure' | 'finished'>('idle');
	
	// Data
	allImages: FlattenedImage[] = [];
	remainingImages = $state<FlattenedImage[]>([]);

	constructor() {
		this.initData();
	}

	private initData() {
		const maps = data.Maps as unknown as Record<string, Record<string, { name: string, cords: { x: string, y: string } }>>;
		const images: FlattenedImage[] = [];

		for (const [mapName, mapData] of Object.entries(maps)) {
			for (const [key, imgData] of Object.entries(mapData)) {
				const x = parseInt(imgData.cords.x, 10);
				const y = parseInt(imgData.cords.y, 10);
				
				if (isNaN(x) || isNaN(y)) continue;

				images.push({
					map: mapName,
					imageKey: key,
					imageData: {
						name: imgData.name,
						cords: { x, y }
					}
				});
			}
		}
		
		this.allImages = this.shuffle(images);
		this.remainingImages = [...this.allImages];
	}

	startGame() {
		this.score = 0;
		this.history = [];
		this.remainingImages = this.shuffle([...this.allImages]);
		this.nextRound();
	}

	nextRound() {
		if (this.remainingImages.length === 0) {
			this.status = 'finished';
			return;
		}

		this.currentRound = this.remainingImages.shift()!;
		this.status = 'guessing';
	}

	guess(x: number, y: number, mapName: string) {
		if (this.status !== 'guessing' || !this.currentRound) return;

		const targetMap = this.currentRound.map;
		const targetX = this.currentRound.imageData.cords.x;
		const targetY = this.currentRound.imageData.cords.y;

		if (mapName !== targetMap) {
			this.status = 'failure';
			return { success: false, message: 'Wrong Map!', correct: { x: targetX, y: targetY } };
		}

		const distX = Math.abs(x - targetX);
		const distY = Math.abs(y - targetY);

		if (distX < 15 && distY < 20) {
		    this.status = 'success';
		    this.score++;
		    return { success: true, message: 'Perfect!', correct: { x: targetX, y: targetY } };
		}

		this.status = 'failure';
		return { success: false, message: 'Not quite right.', correct: { x: targetX, y: targetY } };
	}
    
    giveUp() {
        if (!this.currentRound) return null;
        this.status = 'failure';
        return { 
            x: this.currentRound.imageData.cords.x, 
            y: this.currentRound.imageData.cords.y,
            map: this.currentRound.map
        };
    }
    
    getAnswer() {
         if (!this.currentRound) return null;
         return {
            x: this.currentRound.imageData.cords.x, 
            y: this.currentRound.imageData.cords.y,
            map: this.currentRound.map
         }
    }

	private shuffle(array: any[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
}

export const game = new GameEngine();
