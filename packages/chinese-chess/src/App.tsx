import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useGameStore } from './application/store/useGameStore';
import { ChessBoard } from './presentation/components/board/ChessBoard';

function App() {
	const { restartGame } = useGameStore();

	return (
		<div className='h-dvh w-full bg-stone-100 flex flex-col items-center justify-center overflow-hidden gap-2 py-2 md:gap-4 md:py-4'>
			{/* Header */}
			<div className='shrink-0 text-center pointer-events-none opacity-50 hover:opacity-100 transition-opacity'>
				<h1 className='text-xl md:text-2xl font-bold font-serif text-stone-800'>
					中国象棋
				</h1>
			</div>

			<div className='flex-1 w-full flex items-center justify-center min-h-0 px-2'>
				<ChessBoard />
			</div>

			<div className='shrink-0'>
				<Button
					onClick={restartGame}
					variant='outline'
					size='sm'
					className='border-stone-400 hover:bg-stone-200 bg-white/80 backdrop-blur-sm shadow-sm'
				>
					重新开始
				</Button>
			</div>

			<Toaster />
		</div>
	);
}

export default App;
