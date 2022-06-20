import './CurrentBoard.css';
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebaseInitialize';
import { useEffect, useState } from 'react';
import CreateModal, { closeModal } from '../../../CreateModal/CreateModal';
import Button from '../../../../custom_elements/Button/Button';
import html2canvas from 'html2canvas';

const CurrentBoard = ({ setCurentBoardActive, currentUse, roomId, curentBoardActive }) => {
	const [fields, setFields] = useState([]);
	const [isModalOpenForCreatingField, setIsModalOpenForCreatingFields] = useState(false);

	const getFields = async () => {
		const querySnapshot = await getDocs(collection(db, 'rooms', roomId, 'boards', curentBoardActive.id, 'fields'));
		const fieldsLocal = [];
		querySnapshot.forEach((doc) => {
			const { content } = doc.data();
			fieldsLocal.push({
				id: doc.id,
				content: content,
			});
		});
		setFields(fieldsLocal);
	};

	const addField = async (titleInput) => {
		const docRef = await addDoc(collection(db, 'rooms', roomId, 'boards', curentBoardActive.id, 'fields'), {
			content: titleInput.value,
		});
		getFields();
		return true;
	};

	const saveBackgroundImage = () => {
		if (window.screen.width > 1024) {
			html2canvas(document.body).then(function (canvas) {
				const imageURL = canvas.toDataURL();
				const canvasElement = document.createElement('canvas');
				const ctx = canvasElement.getContext('2d');
				canvasElement.height = 480;
				canvasElement.width = 854;
				const image = new Image();
				image.src = imageURL;
				image.onload = async () => {
					ctx.drawImage(image, 0, 0, 854, 480);
					const canvasURL = canvasElement.toDataURL();

					await updateDoc(doc(db, 'rooms', roomId, 'boards', curentBoardActive.id), {
						background: canvasURL,
					});

					setCurentBoardActive(null);
				};
			});
		} else {
			setCurentBoardActive(null);
		}
	};

	useEffect(() => {
		getFields();
	}, []);

	return (
		<div className="current-board">
			<div className="upper-side">
				<button
					className="back-button"
					onClick={() => {
						saveBackgroundImage();
					}}
				>
					<span className="material-symbols-outlined">arrow_back_ios</span>
				</button>
				<h1>{curentBoardActive.title}</h1>
			</div>
			<div className="tools-and-fields-wrapper">
				<div className="tools">
					<div className="tool">
						<p>O</p>
					</div>
				</div>
				<div className="fields">
					{fields.map((field, index) => {
						const { content } = field;
						return (
							<div className="field" key={index}>
								<p>{content}</p>
							</div>
						);
					})}
					<div className="field add" onClick={() => setIsModalOpenForCreatingFields(true)}>
						<span className="material-symbols-outlined">add</span>
					</div>
				</div>
			</div>
			{isModalOpenForCreatingField && (
				<CreateModal title="Utwórz nową notatkę" stateForModal={setIsModalOpenForCreatingFields}>
					<div className="creating-field">
						<input type="text" placeholder="Podaj nazwę notatki"></input>
						<Button
							action={async (event) => {
								const isReadyToClose = await addField(event.target.previousSibling);
								if (isReadyToClose) {
									closeModal(
										setIsModalOpenForCreatingFields,
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
		</div>
	);
};

export default CurrentBoard;
