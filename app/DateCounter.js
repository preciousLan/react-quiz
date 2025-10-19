'use client';
import { useReducer } from 'react';

const initialState = { count: 0, step: 1 };
function reducer(state, action) {
	switch (action.type) {
		case 'des':
			return { ...state, count: state.count - state.step };
		case 'inc':
			return { ...state, count: state.count + state.step };
		case 'setcount':
			return { ...state, count: action.payload };
		case 'reset':
			return  initialState ;
		case 'setStep':
			return { ...state, step: action.payload };
		default:
			throw new Error('unknown action');
	}
}

function DateCounter() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { count, step } = state;

	// This mutates the date object.
	const date = new Date();
	date.setDate(date.getDate() + count);

	const defineCount = function (e) {
		dispatch({ type: 'setCount', payload: Number(e.target.value) });
	};

	const defineStep = function (e) {
		dispatch({ type: 'setStep', payload: Number(e.target.value) });
	};

	return (
		<div className='counter'>
			<div>
				<input
					type='range'
					min='0'
					max='10'
					value={step}
					onChange={defineStep}
				/>
				<span>{step}</span>
			</div>

			<div>
				<button onClick={() => dispatch({ type: 'des' })}>-</button>
				<input value={count === 0 ? 'zero' : count} onChange={defineCount} />
				<button onClick={() => dispatch({ type: 'inc' })}>+</button>
			</div>

			<p>{date.toDateString()}</p>

			<div>
				<button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
			</div>
		</div>
	);
}
export default DateCounter;
