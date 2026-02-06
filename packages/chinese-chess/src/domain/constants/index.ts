export const PieceColor = {
	RED: 'RED',
	BLACK: 'BLACK',
} as const;

export type PieceColor = (typeof PieceColor)[keyof typeof PieceColor];

export const PieceType = {
	GENERAL: 'GENERAL', // 帅/将
	ADVISOR: 'ADVISOR', // 仕/士
	ELEPHANT: 'ELEPHANT', // 相/象
	HORSE: 'HORSE', // 马
	CHARIOT: 'CHARIOT', // 车
	CANNON: 'CANNON', // 炮
	SOLDIER: 'SOLDIER', // 兵/卒
} as const;

export type PieceType = (typeof PieceType)[keyof typeof PieceType];

export const BOARD_WIDTH = 9;
export const BOARD_HEIGHT = 10;
