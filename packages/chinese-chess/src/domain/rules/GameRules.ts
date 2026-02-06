import { BOARD_HEIGHT, BOARD_WIDTH, PieceColor, PieceType } from '../constants';
import type { Board } from '../entities/Board';
import type { Piece } from '../entities/Piece';
import { Position } from '../entities/Position';
import { MoveValidator } from './MoveValidator';

export class GameRules {
	private moveValidator: MoveValidator;

	constructor() {
		this.moveValidator = new MoveValidator();
	}

	// Check if a move is valid (including check safety)
	isMoveValid(board: Board, piece: Piece, to: Position): boolean {
		// 1. Validate movement rules (geometry, blocking, etc.)
		if (!this.moveValidator.validate(board, piece, to)) {
			return false;
		}

		// 2. Simulate move to check if it exposes King to check (Suicide check)
		// We need to clone board to simulate
		const nextBoard = board.clone();

		// We need to find the piece on the new board
		// Since board.clone() creates deep copy of pieces, we can't use 'piece' reference directly
		// But 'piece.position' is the key.
		const movingPiece = nextBoard.getPieceAt(piece.position);
		if (!movingPiece) {
			// Should not happen if logic is correct
			return false;
		}

		// Execute move on simulation board
		nextBoard.movePiece(piece.position, to);

		// 3. Check if my King is in check
		if (this.isKingInCheck(nextBoard, piece.color)) {
			return false;
		}

		// 4. Special Rule: Flying General (Kings facing each other without screen)
		if (this.areKingsFacing(nextBoard)) {
			return false;
		}

		return true;
	}

	// Get all valid moves for a piece
	getValidMoves(board: Board, piece: Piece): Position[] {
		const validMoves: Position[] = [];

		// Optimization: Depending on piece type, we can reduce search space.
		// But iterating 9x10=90 is fast enough.

		for (let x = 0; x < BOARD_WIDTH; x++) {
			for (let y = 0; y < BOARD_HEIGHT; y++) {
				const to = new Position(x, y);

				// Basic optimization: don't check if target is same color
				const target = board.getPieceAt(to);
				if (target && target.color === piece.color) continue;

				// Optimization for some pieces to skip distant checks?
				// Validator checks geometry first, so it fails fast.

				if (this.isMoveValid(board, piece, to)) {
					validMoves.push(to);
				}
			}
		}
		return validMoves;
	}

	// Check if the King of specific color is being attacked
	isKingInCheck(board: Board, color: PieceColor): boolean {
		// 1. Find the King
		const king = board
			.getAllPieces()
			.find((p) => p.type === PieceType.GENERAL && p.color === color);

		if (!king) {
			// Should not happen in normal game
			return true; // Technically lost if no king
		}

		// 2. Check if any enemy piece can attack the King
		const enemyPieces = board.getAllPieces().filter((p) => p.color !== color);

		for (const enemy of enemyPieces) {
			// We use moveValidator to check if enemy can capture King
			// Note: We only check basic move validity, not recursive "isMoveValid" to avoid infinite loop
			// moveValidator.validate checks geometry and blocking, which is what we need.
			if (this.moveValidator.validate(board, enemy, king.position)) {
				return true;
			}
		}

		return false;
	}

	// Check if Kings are facing each other directly
	areKingsFacing(board: Board): boolean {
		const redKing = board
			.getAllPieces()
			.find((p) => p.type === PieceType.GENERAL && p.color === PieceColor.RED);
		const blackKing = board
			.getAllPieces()
			.find(
				(p) => p.type === PieceType.GENERAL && p.color === PieceColor.BLACK,
			);

		if (!redKing || !blackKing) return false;

		// Must be on same column (x)
		if (redKing.position.x !== blackKing.position.x) return false;

		// Check pieces between them
		const x = redKing.position.x;
		const minY = Math.min(redKing.position.y, blackKing.position.y);
		const maxY = Math.max(redKing.position.y, blackKing.position.y);

		for (let y = minY + 1; y < maxY; y++) {
			if (board.getPieceAt(new Position(x, y))) {
				return false; // There is a screen
			}
		}

		return true; // No screen, facing directly
	}

	// Check if the player of 'color' has any valid moves (Checkmate or Stalemate)
	hasValidMoves(board: Board, color: PieceColor): boolean {
		const myPieces = board.getAllPieces().filter((p) => p.color === color);

		for (const piece of myPieces) {
			if (this.getValidMoves(board, piece).length > 0) {
				return true;
			}
		}
		return false;
	}

	// Get Game Status
	checkGameOver(
		board: Board,
		currentTurnColor: PieceColor,
	): 'RED_WIN' | 'BLACK_WIN' | null {
		if (!this.hasValidMoves(board, currentTurnColor)) {
			// Current player has no moves.
			// In Chinese Chess, if you are Stalemate (no moves), you lose. (Unlike Western Chess where it's Draw)
			return currentTurnColor === PieceColor.RED ? 'BLACK_WIN' : 'RED_WIN';
		}
		return null;
	}
}
