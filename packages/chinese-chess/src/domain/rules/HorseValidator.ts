import type { Board } from '../entities/Board';
import type { Piece } from '../entities/Piece';
import { Position } from '../entities/Position';
import type { IMoveValidator } from '../interfaces/IMoveValidator';

export class HorseValidator implements IMoveValidator {
	validate(board: Board, piece: Piece, to: Position): boolean {
		const dx = Math.abs(to.x - piece.position.x);
		const dy = Math.abs(to.y - piece.position.y);

		// 1. "Ri" shape move (2x1 or 1x2)
		if (!((dx === 2 && dy === 1) || (dx === 1 && dy === 2))) {
			return false;
		}

		// 2. Block check (Horse Leg)
		let legX = piece.position.x;
		let legY = piece.position.y;

		if (dx === 2) {
			// Moving horizontally 2 steps, leg is at (midX, y)
			legX = (piece.position.x + to.x) / 2;
		} else {
			// Moving vertically 2 steps, leg is at (x, midY)
			legY = (piece.position.y + to.y) / 2;
		}

		if (board.getPieceAt(new Position(legX, legY))) {
			return false;
		}

		return true;
	}
}
