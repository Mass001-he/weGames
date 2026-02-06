import { toast } from 'sonner';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PieceColor } from '../../domain/constants';
import { Board } from '../../domain/entities/Board';
import type { Position } from '../../domain/entities/Position';
import { GameRules } from '../../domain/rules/GameRules';

interface GameState {
	board: Board;
	currentTurn: PieceColor;
	selectedPosition: Position | null;
	validMoves: Position[]; // Cache valid moves for selected piece
	winner: PieceColor | null; // null means game in progress
	gameRules: GameRules;

	// Actions
	selectPiece: (position: Position) => void;
	movePiece: (to: Position) => void;
	restartGame: () => void;

	version: number;
}

export const useGameStore = create<GameState>()(
	devtools(
		(set, get) => ({
			board: (() => {
				const b = new Board();
				b.initialize();
				return b;
			})(),
			currentTurn: PieceColor.RED,
			selectedPosition: null,
			validMoves: [],
			winner: null,
			gameRules: new GameRules(),
			version: 0,

			selectPiece: (position: Position) => {
				const { board, currentTurn, winner, selectedPosition, gameRules } =
					get();
				if (winner) return;

				const piece = board.getPieceAt(position);

				// 1. If no piece selected, only allow selecting own piece
				if (!selectedPosition) {
					if (piece && piece.color === currentTurn) {
						const moves = gameRules.getValidMoves(board, piece);
						set({ selectedPosition: position, validMoves: moves });
					}
					return;
				}

				// 2. If piece already selected:
				//    a. If clicking same position -> deselect
				//    b. If clicking own piece -> change selection
				//    c. If clicking empty or enemy -> try move

				if (selectedPosition.equals(position)) {
					set({ selectedPosition: null, validMoves: [] });
					return;
				}

				if (piece && piece.color === currentTurn) {
					const moves = gameRules.getValidMoves(board, piece);
					set({ selectedPosition: position, validMoves: moves });
					return;
				}

				// Try to move
				get().movePiece(position);
			},

			movePiece: (to: Position) => {
				const { board, currentTurn, selectedPosition, gameRules, version } =
					get();
				if (!selectedPosition) return;

				const piece = board.getPieceAt(selectedPosition);
				if (!piece) return;

				// Validate move
				if (gameRules.isMoveValid(board, piece, to)) {
					// Execute move
					board.movePiece(selectedPosition, to);

					// Check win condition (stalemate or checkmate logic from rules)
					const nextTurn =
						currentTurn === PieceColor.RED ? PieceColor.BLACK : PieceColor.RED;
					const winResult = gameRules.checkGameOver(board, nextTurn);

					// Play sound? (Maybe later)

					set({
						board: board,
						currentTurn: nextTurn,
						selectedPosition: null,
						validMoves: [],
						version: version + 1,
						winner:
							winResult === 'RED_WIN'
								? PieceColor.RED
								: winResult === 'BLACK_WIN'
									? PieceColor.BLACK
									: null,
					});

					if (winResult) {
						toast.success(
							winResult === 'RED_WIN' ? '红方胜利！' : '黑方胜利！',
						);
					} else {
						// Check if next player is in check
						if (gameRules.isKingInCheck(board, nextTurn)) {
							toast.warning(
								nextTurn === PieceColor.RED ? '红方被将军！' : '黑方被将军！',
							);
						}
					}
				} else {
					// Invalid move feedback
					toast.error('无效的移动！违反规则或送将。');
				}
			},

			restartGame: () => {
				const newBoard = new Board();
				newBoard.initialize();
				set({
					board: newBoard,
					currentTurn: PieceColor.RED,
					selectedPosition: null,
					validMoves: [],
					winner: null,
					version: 0,
				});
				toast.info('游戏已重置');
			},
		}),
		{ name: 'ChineseChessStore' },
	),
);
