import { PieceType } from '../constants';
import type { Board } from '../entities/Board';
import type { Piece } from '../entities/Piece';
import type { Position } from '../entities/Position';
import type { IMoveValidator } from '../interfaces/IMoveValidator';
import { AdvisorValidator } from './AdvisorValidator';
import { CannonValidator } from './CannonValidator';
import { ChariotValidator } from './ChariotValidator';
import { ElephantValidator } from './ElephantValidator';
import { GeneralValidator } from './GeneralValidator';
import { HorseValidator } from './HorseValidator';
import { SoldierValidator } from './SoldierValidator';

export class MoveValidator implements IMoveValidator {
	private validators: Map<PieceType, IMoveValidator>;

	constructor() {
		this.validators = new Map();
		this.validators.set(PieceType.GENERAL, new GeneralValidator());
		this.validators.set(PieceType.ADVISOR, new AdvisorValidator());
		this.validators.set(PieceType.ELEPHANT, new ElephantValidator());
		this.validators.set(PieceType.HORSE, new HorseValidator());
		this.validators.set(PieceType.CHARIOT, new ChariotValidator());
		this.validators.set(PieceType.CANNON, new CannonValidator());
		this.validators.set(PieceType.SOLDIER, new SoldierValidator());
	}

	validate(board: Board, piece: Piece, to: Position): boolean {
		// 1. Basic check: Cannot move to same position
		if (piece.position.equals(to)) {
			return false;
		}

		// 2. Basic check: Target cannot be occupied by friendly piece
		const targetPiece = board.getPieceAt(to);
		if (targetPiece && targetPiece.color === piece.color) {
			return false;
		}

		// 3. Delegate to specific validator
		const validator = this.validators.get(piece.type);
		if (!validator) {
			throw new Error(`No validator for piece type: ${piece.type}`);
		}

		return validator.validate(board, piece, to);
	}
}
