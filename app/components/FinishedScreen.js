import React from 'react';

const FinishedScreen = ({ points, maxPossiblePoints, highscore, dispatch }) => {
	const percentage = (points / maxPossiblePoints) * 100;

	let emoji;
	if (percentage >= 100) emoji = '(❁´◡`❁)';
	if (percentage < 100) emoji = '😂';
	if (percentage === 0) emoji = '🤣';

	return (
		<>
			<div className='result'>
				<span>{emoji}</span> You scored <strong> {points}</strong> of out{' '}
				{maxPossiblePoints}({Math.ceil(percentage)}%)
			</div>
			<p className='highscore'>(Highscore : {highscore} points) </p>

			<button
				className='btn btn-ui'
				onClick={() => dispatch({ type: 'restart' })}>
				
				Restart Quiz
			</button>
		</>
	);
};

export default FinishedScreen;
