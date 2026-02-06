import { cn } from '@/lib/utils';
import { PieceColor, PieceType } from '../../../domain/constants';
import type { Piece as PieceEntity } from '../../../domain/entities/Piece';

interface PieceProps {
	piece: PieceEntity;
	isSelected?: boolean;
	onClick?: () => void;
}

const PIECE_LABELS: Record<PieceColor, Record<PieceType, string>> = {
	[PieceColor.RED]: {
		[PieceType.GENERAL]: '帅',
		[PieceType.ADVISOR]: '仕',
		[PieceType.ELEPHANT]: '相',
		[PieceType.HORSE]: '马',
		[PieceType.CHARIOT]: '车',
		[PieceType.CANNON]: '炮',
		[PieceType.SOLDIER]: '兵',
	},
	[PieceColor.BLACK]: {
		[PieceType.GENERAL]: '将',
		[PieceType.ADVISOR]: '士',
		[PieceType.ELEPHANT]: '象',
		[PieceType.HORSE]: '马',
		[PieceType.CHARIOT]: '车',
		[PieceType.CANNON]: '炮',
		[PieceType.SOLDIER]: '卒',
	},
};

export const Piece: React.FC<PieceProps> = ({ piece, isSelected, onClick }) => {
	const isRed = piece.color === PieceColor.RED;

	return (
		<button
			type='button'
			onClick={onClick}
			className={cn(
				'relative w-[85%] h-[85%] rounded-full flex items-center justify-center cursor-pointer select-none transition-all duration-200 border-none p-0 outline-none',
				// Selected Lift Effect
				isSelected
					? 'scale-110 -translate-y-1 z-20 drop-shadow-2xl'
					: 'hover:scale-105 hover:-translate-y-0.5 z-10 drop-shadow-md',
			)}
			style={{
				containerType: 'size',
				// Realistic 3D Cylinder Effect with CSS Gradients and Shadows
				background: isRed
					? 'radial-gradient(circle at 30% 30%, #ffefd5, #eecfa1 60%, #d2b48c)' // Light wood for Red? Or standard plastic? Let's stick to wood-like.
					: 'radial-gradient(circle at 30% 30%, #ffefd5, #eecfa1 60%, #d2b48c)', // Same base wood
				boxShadow: `
            inset 0 0 4px rgba(255,255,255,0.6), 
            inset -2px -2px 4px rgba(0,0,0,0.2),
            1px 2px 4px rgba(0,0,0,0.4)
        `,
			}}
		>
			{/* Outer Ring (Carved effect) */}
			<div
				className={cn(
					'absolute inset-1 rounded-full border-2 opacity-80',
					isRed ? 'border-red-600/30' : 'border-black/30',
				)}
			/>

			{/* Inner Circle (Carved effect) */}
			<div
				className={cn(
					'w-[75%] h-[75%] rounded-full border border-dashed flex items-center justify-center shadow-inner',
					isRed
						? 'border-red-600/40 bg-red-50/10'
						: 'border-black/40 bg-stone-50/10',
				)}
			>
				{/* Text with "Etched" effect (Inner Shadow) */}
				<span
					className={cn(
						'font-serif font-bold leading-none select-none pointer-events-none text-[50cqw]',
						isRed ? 'text-red-700' : 'text-stone-900',
					)}
					style={{
						textShadow:
							'0px 1px 0px rgba(255,255,255,0.5), 0px -1px 0px rgba(0,0,0,0.1)',
						fontFamily: '"KaiTi", "STKaiti", "SimKai", serif', // Prefer KaiTi for traditional look
					}}
				>
					{PIECE_LABELS[piece.color][piece.type]}
				</span>
			</div>

			{/* Side shine (High gloss) */}
			<div className='absolute top-[15%] left-[15%] w-[20%] h-[10%] bg-white rounded-full opacity-40 blur-[1px]' />
		</button>
	);
};
