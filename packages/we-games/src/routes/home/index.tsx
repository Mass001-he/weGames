import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/Button';

export const Route = createFileRoute('/home/')({
	component: RouteComponent,
});

function ChildrenComponent() {
	console.log('children component render');
	return <div className='text-3xl font-bold'>children component</div>;
}

function RouteComponent() {
	const [count, setCount] = useState(0);
	return (
		<>
			<div className='text-4xl font-bold'>we-games</div>
			<div>
				<Button type='primary' onClick={() => setCount(count + 1)}>
					新增{count}
				</Button>
			</div>
			<ChildrenComponent />
		</>
	);
}
