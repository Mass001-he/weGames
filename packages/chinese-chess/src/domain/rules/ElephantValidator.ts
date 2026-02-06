import { PieceColor } from '../constants';
import type { Board } from '../entities/Board';
import type { Piece } from '../entities/Piece';
import { Position } from '../entities/Position';
import type { IMoveValidator } from '../interfaces/IMoveValidator';

export class ElephantValidator implements IMoveValidator {
	validate(board: Board, piece: Piece, to: Position): boolean {
		const dx = Math.abs(to.x - piece.position.x);
		const dy = Math.abs(to.y - piece.position.y);

		// 1. Move 2 steps diagonal
		if (dx !== 2 || dy !== 2) {
			return false;
		}

		// 2. Cannot cross river
		if (piece.color === PieceColor.RED) {
			if (to.y < 5) return false; // Red territory 5-9
		} else {
			if (to.y > 4) return false; // Black territory 0-4
		}

		// 3. Block check (Eye of Elephant)
		const eyeX = (piece.position.x + to.x) / 2;
		const eyeY = (piece.position.y + to.y) / 2;
		const eyePos = new Position(eyeX, eyeY);

		if (board.getPieceAt(eyePos)) {
			return false;
		}

		return true;
	}
}
