'use client';
import { useEffect, useReducer } from 'react';
import Header from './components/Header';
import { Main } from './components/Main';
import Loader from './components/Loader';
import Error from './components/Error';
import { StartScreen } from './components/StartScreen';
import { Question } from './components/Question';
import { NextButton } from './components/NextButton';
import { Progress } from './components/Progress';
import FinishedScreen from './components/FinishedScreen';
import Footer from './components/Footer';
import Timer from './components/Timer';


const  SECS_PER_QUESTION = 30

const initialState = {
	questions: [],
	//'loading', 'error', 'ready','active','finished'
	status: 'loading',
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
	secondsRemaining: null,
};
function reducer(state, action) {
	switch (action.type) {
		case 'dataReceived':
			return { ...state, questions: action.payload, status: 'ready' };
		case 'dataFailed':
			return { ...state, status: 'error' };
		case 'start':
			return {
				...state,
				status: 'active',
				secondsRemaining: state.questions?.length * SECS_PER_QUESTION,
			};
		case 'newAnswer':
			const question = state.questions.at(state.index);
			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points,
			};
		case 'nextQuestion':
			return {
				...state,
				index: state.index + 1,
				answer: null,
			};
		case 'finished':
			return {
				...state,
				status: 'finished',
				highscore:
					state.points > state.highscore ? state.points : state.highscore,
			};
		case 'restart':
			return {
				...initialState,
				questions: state.questions,
				status: 'ready',
			};
		// return {
		// 	...state,
		// 	points: 0,
		// 	highscore: 0,
		// 	index: 0,
		// 	answer: null,
		// 	status: 'ready',
		// };
		case 'tick':
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? 'finished' : state.status,
			};

		default:
			throw new Error('action unknown');
	}
}

export default function Home() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const {
		questions,
		status,
		index,
		answer,
		points,
		highscore,
		secondsRemaining,
	} = state;
	const numQuestions = questions?.length;
	const maxPossiblePoints = questions?.reduce(
		(prev, cur) => prev + cur.points,
		0
	);

	console.log(points);

	useEffect(() => {
		async function getQuestions() {
			try {
				const res = await fetch('http://localhost:8000/questions');
				const data = await res.json();
				dispatch({ type: 'dataReceived', payload: data });
			} catch (err) {
				dispatch({ type: 'dataFailed' });
			}
		}
		getQuestions();
	}, []);

	return (
		<div className='app'>
			<Header />
			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}
				{status === 'ready' && (
					<StartScreen numQuestions={numQuestions} dispatch={dispatch} />
				)}
				{status === 'active' && (
					<>
						<Progress
							index={index}
							numQuestion={numQuestions}
							points={points}
							maxPossiblePoints={maxPossiblePoints}
							answer={answer}
						/>

						<Question
							question={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>

						<Footer>
							<Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
							<NextButton
								dispatch={dispatch}
								answer={answer}
								numQuestion={numQuestions}
								index={index}
							/>
						</Footer>
					</>
				)}
				{status === 'finished' && (
					<FinishedScreen
						points={points}
						maxPossiblePoints={maxPossiblePoints}
						highscore={highscore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
}
