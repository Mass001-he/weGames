import { PieceColor } from '../constants';
import type { Board } from '../entities/Board';
import type { Piece } from '../entities/Piece';
import type { Position } from '../entities/Position';
import type { IMoveValidator } from '../interfaces/IMoveValidator';

export class SoldierValidator implements IMoveValidator {
	validate(_: Board, piece: Piece, to: Position): boolean {
		const dx = Math.abs(to.x - piece.position.x);
		const dy = Math.abs(to.y - piece.position.y);
		const yDiff = to.y - piece.position.y;

		// 1. Move 1 step
		if (dx + dy !== 1) {
			return false;
		}

		// 2. Direction check (Cannot move backward)
		if (piece.color === PieceColor.RED) {
			// Red moves UP (decreasing Y)
			if (yDiff > 0) return false; // Cannot move down (backward)
		} else {
			// Black moves DOWN (increasing Y)
			if (yDiff < 0) return false; // Cannot move up (backward)
		}

		// 3. Crossing river check
		// Red river boundary: y <= 4 crossed
		// Black river boundary: y >= 5 crossed
		const isCrossedRiver =
			piece.color === PieceColor.RED
				? piece.position.y <= 4
				: piece.position.y >= 5;

		if (!isCrossedRiver) {
			// Before crossing river: Can only move forward
			if (dx !== 0) return false;
		}
		// After crossing: Can move forward or sideways (already covered by dx+dy=1 and backward check)

		return true;
	}
}
