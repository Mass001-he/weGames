import { PieceColor } from '../constants';
import type { Board } from '../entities/Board';
import type { Piece } from '../entities/Piece';
import type { Position } from '../entities/Position';
import type { IMoveValidator } from '../interfaces/IMoveValidator';

export class GeneralValidator implements IMoveValidator {
	validate(_: Board, piece: Piece, to: Position): boolean {
		const dx = Math.abs(to.x - piece.position.x);
		const dy = Math.abs(to.y - piece.position.y);

		// 1. Move one step orthogonal
		if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
			return false;
		}

		// 2. Confined to Palace
		// Palace X: 3, 4, 5
		if (to.x < 3 || to.x > 5) {
			return false;
		}

		// Palace Y: Black 0-2, Red 7-9
		if (piece.color === PieceColor.RED) {
			if (to.y < 7 || to.y > 9) return false;
		} else {
			if (to.y < 0 || to.y > 2) return false;
		}

		return true;
	}
}
