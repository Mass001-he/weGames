import { BOARD_WIDTH, PieceColor, PieceType } from '../constants';
import { Piece } from './Piece';
import { Position } from './Position';

export class Board {
	// Map key string "x,y" to Piece
	private pieces: Map<string, Piece>;

	constructor() {
		this.pieces = new Map();
	}

	initialize(): void {
		this.pieces.clear();
		this.setupPieces(PieceColor.RED);
		this.setupPieces(PieceColor.BLACK);
	}

	clear(): void {
		this.pieces.clear();
	}

	getPieceAt(position: Position): Piece | null {
		return this.pieces.get(position.toString()) || null;
	}

	movePiece(from: Position, to: Position): void {
		const piece = this.getPieceAt(from);
		if (!piece) {
			throw new Error(`No piece at ${from}`);
		}

		// Remove captured piece if any
		const targetKey = to.toString();
		if (this.pieces.has(targetKey)) {
			this.pieces.delete(targetKey);
		}

		// Move piece
		this.pieces.delete(from.toString());
		piece.moveTo(to);
		this.pieces.set(to.toString(), piece);
	}

	// Manually add piece for testing/setup
	addPiece(piece: Piece): void {
		this.pieces.set(piece.position.toString(), piece);
	}

	getAllPieces(): Piece[] {
		return Array.from(this.pieces.values());
	}

	// Helper to create initial board
	private setupPieces(color: PieceColor): void {
		const isRed = color === PieceColor.RED;
		// Y coordinates
		const backRow = isRed ? 9 : 0;
		const cannonRow = isRed ? 7 : 2;
		const soldierRow = isRed ? 6 : 3;

		// Helper to add piece
		const add = (type: PieceType, x: number, y: number, idSuffix: number) => {
			const pos = new Position(x, y);
			const id = `${color}_${type}_${idSuffix}`;
			const piece = new Piece(id, type, color, pos);
			this.pieces.set(pos.toString(), piece);
		};

		// Rooks (Chariots)
		add(PieceType.CHARIOT, 0, backRow, 1);
		add(PieceType.CHARIOT, 8, backRow, 2);

		// Horses
		add(PieceType.HORSE, 1, backRow, 1);
		add(PieceType.HORSE, 7, backRow, 2);

		// Elephants
		add(PieceType.ELEPHANT, 2, backRow, 1);
		add(PieceType.ELEPHANT, 6, backRow, 2);

		// Advisors
		add(PieceType.ADVISOR, 3, backRow, 1);
		add(PieceType.ADVISOR, 5, backRow, 2);

		// General
		add(PieceType.GENERAL, 4, backRow, 1);

		// Cannons
		add(PieceType.CANNON, 1, cannonRow, 1);
		add(PieceType.CANNON, 7, cannonRow, 2);

		// Soldiers
		for (let i = 0; i < BOARD_WIDTH; i += 2) {
			add(PieceType.SOLDIER, i, soldierRow, i / 2 + 1);
		}
	}

	clone(): Board {
		const newBoard = new Board();
		for (const piece of this.pieces.values()) {
			const clonedPiece = piece.clone();
			newBoard.pieces.set(clonedPiece.position.toString(), clonedPiece);
		}
		return newBoard;
	}
}
