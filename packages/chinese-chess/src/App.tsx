import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { useGameStore } from './application/store/useGameStore';
import { ChessBoard } from './presentation/components/board/ChessBoard';

function App() {
	const { restartGame } = useGameStore();

	return (
		<div className='min-h-screen bg-stone-100 flex flex-col items-center py-8'>
			<h1 className='text-3xl font-bold mb-6 font-serif text-stone-800'>
				中国象棋 (Chinese Chess)
			</h1>

			<ChessBoard />

			<div className='mt-8 flex gap-4'>
				<Button
					onClick={restartGame}
					variant='outline'
					className='border-stone-400 hover:bg-stone-200'
				>
					重新开始
				</Button>
			</div>

			<div className='mt-8 text-sm text-stone-500 max-w-md text-center'>
				<p>规则：红先黑后，困毙即负。</p>
				<p>Built with React, TypeScript, Zustand, and Clean Architecture.</p>
			</div>

			<Toaster />
		</div>
	);
}

export default App;
