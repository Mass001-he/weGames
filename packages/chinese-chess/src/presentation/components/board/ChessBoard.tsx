import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useGameStore } from '../../../application/store/useGameStore';
import {
	BOARD_HEIGHT,
	BOARD_WIDTH,
	PieceColor,
} from '../../../domain/constants';
import { Position } from '../../../domain/entities/Position';
import { Piece } from '../pieces/Piece';

// SVG Board Component for better rendering
// ViewBox updated to 950x1050 to add padding around the 900x1000 grid
const BoardBackground = () => (
	<svg
		viewBox='0 0 950 1050'
		className='absolute inset-0 w-full h-full pointer-events-none z-0'
		preserveAspectRatio='none'
	>
		<title>Chinese Chess Board</title>
		<defs>
			<pattern
				id='wood-pattern'
				width='100'
				height='100'
				patternUnits='userSpaceOnUse'
			>
				<rect width='100' height='100' fill='#eecfa1' />
				<filter id='noise'>
					<feTurbulence
						type='fractalNoise'
						baseFrequency='0.5'
						numOctaves='3'
						stitchTiles='stitch'
					/>
				</filter>
				<rect width='100' height='100' filter='url(#noise)' opacity='0.1' />
			</pattern>
		</defs>

		{/* Base Background - Fills the new larger area */}
		<rect x='0' y='0' width='950' height='1050' fill='#eecfa1' />

		{/* Border - Adjusted for 950x1050 */}
		<rect
			x='10'
			y='10'
			width='930'
			height='1030'
			fill='none'
			stroke='#5d4037'
			strokeWidth='4'
		/>
		<rect
			x='18'
			y='18'
			width='914'
			height='1014'
			fill='none'
			stroke='#5d4037'
			strokeWidth='2'
		/>

		{/* Grid Lines Group - Shifted by (25, 25) to center the 900x1000 grid */}
		<g transform='translate(75, 75)' stroke='#5d4037' strokeWidth='2'>
			{/* Horizontal Lines (10 lines) */}
			{Array.from({ length: 10 }, (_, k) => k).map((i) => (
				<line key={`h-${i}`} x1='0' y1={i * 100} x2='800' y2={i * 100} />
			))}

			{/* Vertical Lines (Top Half) */}
			{Array.from({ length: 9 }, (_, k) => k).map((i) => (
				<line key={`v-top-${i}`} x1={i * 100} y1='0' x2={i * 100} y2='400' />
			))}

			{/* Vertical Lines (Bottom Half) */}
			{Array.from({ length: 9 }, (_, k) => k).map((i) => (
				<line
					key={`v-bottom-${i}`}
					x1={i * 100}
					y1='500'
					x2={i * 100}
					y2='900'
				/>
			))}

			{/* Side Vertical Lines (River Connection) */}
			<line x1='0' y1='400' x2='0' y2='500' />
			<line x1='800' y1='400' x2='800' y2='500' />

			{/* Palaces (X shape) */}
			{/* Top Palace (Black) */}
			<line x1='300' y1='0' x2='500' y2='200' />
			<line x1='500' y1='0' x2='300' y2='200' />

			{/* Bottom Palace (Red) */}
			<line x1='300' y1='700' x2='500' y2='900' />
			<line x1='500' y1='700' x2='300' y2='900' />

			{/* Cross Markers (The little corner marks) */}
			{[
				// Cannons
				[1, 2],
				[7, 2],
				[1, 7],
				[7, 7],
				// Soldiers
				[0, 3],
				[2, 3],
				[4, 3],
				[6, 3],
				[8, 3],
				[0, 6],
				[2, 6],
				[4, 6],
				[6, 6],
				[8, 6],
			].map(([gx, gy]) => {
				const x = gx * 100;
				const y = gy * 100;
				const offset = 5;
				const len = 15;

				// Helper to draw corner
				const Corner = ({ dx, dy }: { dx: number; dy: number }) => {
					// Skip if out of board or overlapping border (simplification)
					if (gx === 0 && dx === -1) return null;
					if (gx === 8 && dx === 1) return null;

					return (
						<polyline
							points={`${x + dx * offset},${y + dy * len} ${x + dx * offset},${y + dy * offset} ${x + dx * len},${y + dy * offset}`}
							fill='none'
							stroke='#5d4037'
							strokeWidth='2'
						/>
					);
				};

				return (
					<g key={`marker-${gx}-${gy}`}>
						<Corner dx={-1} dy={-1} />
						<Corner dx={1} dy={-1} />
						<Corner dx={-1} dy={1} />
						<Corner dx={1} dy={1} />
					</g>
				);
			})}
		</g>

		{/* River Text */}
		<g transform='translate(75, 75)'>
			<text
				x='200'
				y='470'
				textAnchor='middle'
				fontSize='50'
				fontFamily='KaiTi, serif'
				fill='#5d4037'
				className='select-none'
			>
				楚 河
			</text>
			<text
				x='600'
				y='470'
				textAnchor='middle'
				fontSize='50'
				fontFamily='KaiTi, serif'
				fill='#5d4037'
				className='select-none'
			>
				汉 界
			</text>
		</g>
	</svg>
);

export const ChessBoard: React.FC = () => {
	const {
		board,
		selectedPosition,
		validMoves,
		selectPiece,
		winner,
		currentTurn,
	} = useGameStore();

	// Create grid cells logic (logical positions)
	const cells = useMemo(() => {
		const grid: { x: number; y: number }[] = [];
		for (let y = 0; y < BOARD_HEIGHT; y++) {
			for (let x = 0; x < BOARD_WIDTH; x++) {
				grid.push({ x, y });
			}
		}
		return grid;
	}, []);

	const handleCellClick = (x: number, y: number) => {
		selectPiece(new Position(x, y));
	};

	// New Dimensions
	const VIEWBOX_WIDTH = 950;
	const VIEWBOX_HEIGHT = 1050;
	const GRID_WIDTH = 900;
	const GRID_HEIGHT = 1000;
	const PADDING_X = 25;
	const PADDING_Y = 25;

	return (
		<div className='w-full h-full flex flex-col items-center justify-center gap-2 md:gap-4'>
			{/* Game Status Banner - Compact on mobile */}
			<div className='shrink-0 bg-white/80 backdrop-blur-sm px-4 py-2 md:px-8 md:py-3 rounded-full shadow-lg border border-stone-200 z-20'>
				<div className='text-lg md:text-xl font-bold font-serif tracking-widest'>
					{winner ? (
						<span
							className={
								winner === PieceColor.RED
									? 'text-red-600 drop-shadow-sm'
									: 'text-stone-900 drop-shadow-sm'
							}
						>
							{winner === PieceColor.RED ? '🎉 红方获胜 🎉' : '🎉 黑方获胜 🎉'}
						</span>
					) : (
						<span className='flex items-center gap-2'>
							<span className='text-stone-500 text-sm md:text-base font-normal'>
								当前回合
							</span>
							<span
								className={cn(
									'text-xl md:text-2xl transition-colors duration-300',
									currentTurn === PieceColor.RED
										? 'text-red-600'
										: 'text-stone-900',
								)}
							>
								{currentTurn === PieceColor.RED ? '红方' : '黑方'}
							</span>
						</span>
					)}
				</div>
			</div>

			{/* Board Container - Responsive & Maximized */}
			<div className='flex-1 w-full flex items-center justify-center min-h-0 relative'>
				<div
					className='relative rounded-lg shadow-2xl select-none bg-[#5d4037] shrink-0'
					style={{
						aspectRatio: `${VIEWBOX_WIDTH}/${VIEWBOX_HEIGHT}`,
						maxHeight: '100%',
						maxWidth: '100%',
						// These ensure the board tries to fill the space but respects aspect ratio and container limits
						height: '100%',
						width: 'auto',
					}}
				>
					{/* Inner Board Area */}
					<div className='relative w-full h-full overflow-hidden rounded bg-[#eecfa1]'>
						<BoardBackground />

						{/* Grid for Interaction & Pieces */}
						{/* Positioned absolutely to match the SVG grid coordinates */}
						<div
							className='absolute z-10'
							style={{
								display: 'grid',
								gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
								gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
								left: `${(PADDING_X / VIEWBOX_WIDTH) * 100}%`,
								top: `${(PADDING_Y / VIEWBOX_HEIGHT) * 100}%`,
								width: `${(GRID_WIDTH / VIEWBOX_WIDTH) * 100}%`,
								height: `${(GRID_HEIGHT / VIEWBOX_HEIGHT) * 100}%`,
							}}
						>
							{cells.map(({ x, y }) => {
								const position = new Position(x, y);
								const piece = board.getPieceAt(position);
								const isSelected = selectedPosition?.equals(position);
								const isValidMove = validMoves.some((m) => m.equals(position));

								return (
									<button
										key={`${x}-${y}`}
										type='button'
										className='relative flex items-center justify-center w-full h-full border-none p-0 bg-transparent outline-none cursor-pointer'
										onClick={() => handleCellClick(x, y)}
									>
										{/* Piece Layer */}
										<div className='z-10 relative w-[90%] h-[90%] flex items-center justify-center'>
											{piece && <Piece piece={piece} isSelected={isSelected} />}

											{/* Valid Move Indicator (Dot) */}
											{isValidMove && !piece && (
												<div className='w-3 h-3 md:w-4 md:h-4 bg-green-600/60 rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)] animate-pulse' />
											)}
											{/* Capture Indicator (Ring) */}
											{isValidMove && piece && (
												<div className='absolute inset-0 -m-1 rounded-full border-4 border-red-500/60 animate-ping opacity-75 pointer-events-none' />
											)}
										</div>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
