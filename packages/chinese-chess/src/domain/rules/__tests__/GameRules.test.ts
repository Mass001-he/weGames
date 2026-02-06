import { beforeEach, describe, expect, it } from 'vitest';
import { PieceColor, PieceType } from '../../constants';
import { Board } from '../../entities/Board';
import { Piece } from '../../entities/Piece';
import { Position } from '../../entities/Position';
import { GameRules } from '../GameRules';

describe('GameRules', () => {
	let board: Board;
	let rules: GameRules;

	beforeEach(() => {
		board = new Board();
		board.initialize();
		rules = new GameRules();
	});

	describe('isMoveValid', () => {
		it('should allow valid opening move for Red Cannon', () => {
			// Red Cannon at (1, 7) -> (4, 7) (Central Cannon)
			const from = new Position(1, 7);
			const to = new Position(4, 7);
			const piece = board.getPieceAt(from);

			if (!piece) {
				throw new Error('Piece not found at (1, 7)');
			}

			expect(piece.type).toBe(PieceType.CANNON);

			const isValid = rules.isMoveValid(board, piece, to);
			expect(isValid).toBe(true);
		});

		it('should allow valid opening move for Red Horse', () => {
			// Red Horse at (1, 9) -> (2, 7)
			const from = new Position(1, 9);
			const to = new Position(2, 7);
			const piece = board.getPieceAt(from);

			if (!piece) {
				throw new Error('Piece not found at (1, 9)');
			}

			expect(piece.type).toBe(PieceType.HORSE);
			expect(rules.isMoveValid(board, piece, to)).toBe(true);
		});

		it('should prevent move that exposes King (Suicide)', () => {
			// Setup a custom scenario
			board.clear();

			// 1. Red King at (4, 9)
			const redKing = new Piece(
				'r_k',
				PieceType.GENERAL,
				PieceColor.RED,
				new Position(4, 9),
			);
			board.addPiece(redKing);

			// 2. Red Cannon at (4, 8) - blocking chariot
			const redCannon = new Piece(
				'r_c',
				PieceType.CANNON,
				PieceColor.RED,
				new Position(4, 8),
			);
			board.addPiece(redCannon);

			// 3. Black Chariot at (4, 0) - threatening king if cannon moves
			const blackChariot = new Piece(
				'b_r',
				PieceType.CHARIOT,
				PieceColor.BLACK,
				new Position(4, 0),
			);
			board.addPiece(blackChariot);

			// Try to move Red Cannon away
			const to = new Position(3, 8); // Move cannon left
			const isValid = rules.isMoveValid(board, redCannon, to);

			expect(isValid).toBe(false); // Should be invalid because it exposes King to Chariot
		});

		it('should prevent Flying General (Kings facing each other)', () => {
			board.clear();

			// 1. Red King at (4, 9)
			const redKing = new Piece(
				'r_k',
				PieceType.GENERAL,
				PieceColor.RED,
				new Position(4, 9),
			);
			board.addPiece(redKing);

			// 2. Black King at (4, 0)
			const blackKing = new Piece(
				'b_k',
				PieceType.GENERAL,
				PieceColor.BLACK,
				new Position(4, 0),
			);
			board.addPiece(blackKing);

			// 3. Red Pawn at (4, 5) acting as screen
			const redPawn = new Piece(
				'r_p',
				PieceType.SOLDIER,
				PieceColor.RED,
				new Position(4, 5),
			);
			board.addPiece(redPawn);

			// Move Red Pawn away, exposing Kings
			const to = new Position(3, 5);
			const isValid = rules.isMoveValid(board, redPawn, to);

			expect(isValid).toBe(false); // Cannot move screen away
		});
	});

	describe('checkGameOver', () => {
		it('should detect Checkmate (Stalemate is loss)', () => {
			board.clear();

			// Red King trapped
			const redKing = new Piece(
				'r_k',
				PieceType.GENERAL,
				PieceColor.RED,
				new Position(4, 9),
			);
			board.addPiece(redKing);

			// Black Chariot checking horizontally
			const blackChariot = new Piece(
				'b_r',
				PieceType.CHARIOT,
				PieceColor.BLACK,
				new Position(4, 8),
			);
			board.addPiece(blackChariot);

			// Black King facing Red King (preventing Red King from moving up)
			// Actually Black King at 4,0 prevents Red King from moving to 4,8 if Chariot wasn't there
			// Let's use two Chariots to checkmate
			// Chariot 1 at (4, 8) checking King at (4, 9)
			// Chariot 2 at (3, 7) covering (3, 9) and (5, 7) covering (5, 9)
			// Simplified:
			// King at (4, 9)
			// Enemy Chariot at (4, 8) -> King cannot move up (occupied), cannot stay (checked)
			// King can move to (3, 9) or (5, 9)?
			// Let's put enemy Chariot at (5, 8) covering rank 8 and 9? No.

			// Classic Checkmate:
			// Red King (4, 9)
			// Black King (4, 0)
			// Black Chariot (4, 8)
			// This is checkmate?
			// Red King can move to (3, 9) or (5, 9).
			// We need to block those too.
			// Black Chariot 2 at (3, 0) -- no

			// Let's use "Stalemate" scenario (困毙)
			// Red King at (3, 9) (Corner of palace)
			// Black King at (4, 0)
			// Black Chariot at (4, 9) -> Checks Red King.
			// Red King cannot take Chariot (protected by Black King? No, distance too far)
			// Wait, if Black Chariot at (4, 9), Red King at (3, 9).
			// Red King can take Chariot? Yes if adjacent.

			// Let's construct a definite "Stalemate/Checkmate"
			// Red King at (4, 9)
			// Black Chariot at (4, 8) -> Check
			// Black King at (4, 0) -> Protects the file? No.
			// We need horizontal protection.

			// Simpler:
			// Red King at (4, 9)
			// Black Chariot at (3, 8) and (5, 8) ? No
			// Black Chariot at (0, 9) -> Checks Rank 9.
			// Red King must move to Rank 8.
			// But Rank 8 is covered by Black Chariot at (0, 8).
			// So Red King has nowhere to go.

			const blackChariot1 = new Piece(
				'b_r1',
				PieceType.CHARIOT,
				PieceColor.BLACK,
				new Position(0, 9),
			);
			board.addPiece(blackChariot1);

			const blackChariot2 = new Piece(
				'b_r2',
				PieceType.CHARIOT,
				PieceColor.BLACK,
				new Position(0, 8),
			);
			board.addPiece(blackChariot2);

			// Check Red Status
			const result = rules.checkGameOver(board, PieceColor.RED);
			expect(result).toBe('BLACK_WIN');
		});
	});
});
