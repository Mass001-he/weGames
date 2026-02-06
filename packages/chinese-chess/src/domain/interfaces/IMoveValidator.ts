import type { Board } from '../entities/Board';
import type { Piece } from '../entities/Piece';
import type { Position } from '../entities/Position';

export interface IMoveValidator {
	validate(board: Board, piece: Piece, to: Position): boolean;
}
