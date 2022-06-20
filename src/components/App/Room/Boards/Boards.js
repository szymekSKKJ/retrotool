import './Boards.css';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebaseInitialize';
import CreateModal, { closeModal } from '../../../CreateModal/CreateModal';
import Button from '../../../../custom_elements/Button/Button';
import { useEffect, useState } from 'react';

const Boards = ({ currentUser, roomId, setCurentBoardActive }) => {
	const [isModalOpenForCreatingBoard, setIsModalOpenForCreatingBoard] = useState(false);
	const [boardsElement, setBoardsElement] = useState([]);

	const isEmpty = (str) => !str.trim().length;

	const getBoardsElement = async () => {
		const boradsElementLocal = [];
		const querySnapshot = await getDocs(collection(db, 'rooms', roomId, 'boards'));
		querySnapshot.forEach((doc) => {
			const { title, background } = doc.data();
			boradsElementLocal.push({
				id: doc.id,
				title: title,
				background: background,
			});
		});
		setBoardsElement(boradsElementLocal);
	};

	const createBoard = async (boardTitleInput) => {
		if (!isEmpty(boardTitleInput.value)) {
			const docRef = await addDoc(collection(db, 'rooms', roomId, 'boards'), {
				title: boardTitleInput.value,
				background: 'undefined',
			});
			getBoardsElement();
			return true;
		} else {
			return false;
		}
	};

	const addNewBoard = () => {
		setIsModalOpenForCreatingBoard(true);
	};

	useEffect(() => {
		getBoardsElement();
	}, []);

	return (
		<div className="borads">
			{boardsElement.map((board, index) => {
				const { title, background, id } = board;
				return (
					<div
						className="borad"
						key={index}
						onClick={() => {
							setCurentBoardActive({
								id: id,
								title: title,
							});
						}}
					>
						<h1>{title}</h1>
						<div className="background-cover"></div>
						<img src={background == 'undefined' ? null : background}></img>
					</div>
				);
			})}

			{isModalOpenForCreatingBoard && (
				<CreateModal title="Utwórz nową tablicę" stateForModal={setIsModalOpenForCreatingBoard}>
					<div className="creating-board">
						<input type="text" placeholder="Podaj nazwę tablicy"></input>
						<Button
							action={async (event) => {
								const isReadyToClose = await createBoard(event.target.previousSibling);
								if (isReadyToClose) {
									closeModal(
										setIsModalOpenForCreatingBoard,
										event.target.parentElement.parentElement.parentElement
									);
								}
							}}
							customStyles={{ marginTop: '25px' }}
						>
							Utwórz
						</Button>
					</div>
				</CreateModal>
			)}
			{currentUser.isAdmin && (
				<div className="borad add" onClick={() => addNewBoard()}>
					<span className="material-symbols-outlined">add</span>
				</div>
			)}
		</div>
	);
};

export default Boards;
