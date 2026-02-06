import { BOARD_HEIGHT, BOARD_WIDTH } from '../constants';

export class Position {
	readonly x: number;
	readonly y: number;

	constructor(x: number, y: number) {
		if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT) {
			throw new Error(`Invalid position: (${x}, ${y})`);
		}
		this.x = x;
		this.y = y;
	}

	equals(other: Position): boolean {
		return this.x === other.x && this.y === other.y;
	}

	toString(): string {
		return `(${this.x}, ${this.y})`;
	}

	static from(x: number, y: number): Position {
		return new Position(x, y);
	}
}
