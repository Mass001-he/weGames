import type { Board } from '../entities/Board';
import type { Piece } from '../entities/Piece';
import { Position } from '../entities/Position';
import type { IMoveValidator } from '../interfaces/IMoveValidator';

export class ChariotValidator implements IMoveValidator {
	validate(board: Board, piece: Piece, to: Position): boolean {
		const dx = Math.abs(to.x - piece.position.x);
		const dy = Math.abs(to.y - piece.position.y);

		// 1. Move orthogonal
		if (dx !== 0 && dy !== 0) {
			return false;
		}

		// 2. Cannot jump over pieces
		// Check path
		if (dx !== 0) {
			// Horizontal move
			const minX = Math.min(piece.position.x, to.x);
			const maxX = Math.max(piece.position.x, to.x);
			for (let x = minX + 1; x < maxX; x++) {
				if (board.getPieceAt(new Position(x, piece.position.y))) {
					return false;
				}
			}
		} else {
			// Vertical move
			const minY = Math.min(piece.position.y, to.y);
			const maxY = Math.max(piece.position.y, to.y);
			for (let y = minY + 1; y < maxY; y++) {
				if (board.getPieceAt(new Position(piece.position.x, y))) {
					return false;
				}
			}
		}

		return true;
	}
}
