import type { PieceColor, PieceType } from '../constants';
import type { Position } from './Position';

export class Piece {
	readonly id: string;
	readonly type: PieceType;
	readonly color: PieceColor;
	position: Position;

	constructor(
		id: string,
		type: PieceType,
		color: PieceColor,
		position: Position,
	) {
		this.id = id;
		this.type = type;
		this.color = color;
		this.position = position;
	}

	moveTo(newPosition: Position): void {
		this.position = newPosition;
	}

	// Clone for immutability in store if needed, though class instance mutation is often used in simple domain logic
	// but for React state, cloning is better.
	clone(): Piece {
		return new Piece(this.id, this.type, this.color, this.position);
	}
}
